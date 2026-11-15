$ErrorActionPreference = 'Stop'
$script:AppName = 'Spotifine'

function Find-SpotifyExe {
    $candidates = @(
        (Join-Path $env:APPDATA 'Spotify\Spotify.exe'),
        (Join-Path $env:PROGRAMFILES 'Spotify\Spotify.exe'),
        (Join-Path ${env:ProgramFiles(x86)} 'Spotify\Spotify.exe')
    )
    foreach ($candidate in $candidates) {
        if ($candidate -and (Test-Path -LiteralPath $candidate)) { return $candidate }
    }
    $uninstallKeys = @(
        'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\Spotify',
        'HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\Spotify'
    )
    foreach ($key in $uninstallKeys) {
        try {
            $location = (Get-ItemProperty -Path $key -ErrorAction Stop).InstallLocation
            if ($location) {
                $exe = Join-Path $location 'Spotify.exe'
                if (Test-Path -LiteralPath $exe) { return $exe }
            }
        }
        catch { }
    }
    $store = Join-Path $env:LOCALAPPDATA 'Microsoft\WindowsApps\Spotify.exe'
    if (Test-Path -LiteralPath $store) { return $store }
    return $null
}

function Test-DevToolsPort {
    param([int]$Port = 9222)
    try {
        $null = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/json/version" -TimeoutSec 2
        return $true
    }
    catch { return $false }
}

function Get-SpotifyPageTarget {
    param([int]$Port = 9222)
    try {
        $targets = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/json/list" -TimeoutSec 4
    }
    catch { return $null }
    if (-not $targets) { return $null }
    $page = $targets | Where-Object { $_.type -eq 'page' -and $_.url -like 'https://xpui.app.spotify.com*' } | Select-Object -First 1
    if (-not $page) { $page = $targets | Where-Object { $_.type -eq 'page' } | Select-Object -First 1 }
    return $page
}

function Stop-SpotifyClient {
    $windows = Get-Process -Name 'Spotify' -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 }
    foreach ($process in $windows) {
        try { $null = $process.CloseMainWindow() } catch { }
    }
    $deadline = (Get-Date).AddSeconds(6)
    while ((Get-Date) -lt $deadline) {
        if (-not (Get-Process -Name 'Spotify' -ErrorAction SilentlyContinue)) { return }
        Start-Sleep -Milliseconds 300
    }
    Get-Process -Name 'Spotify' -ErrorAction SilentlyContinue | ForEach-Object {
        try { Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue } catch { }
    }
}

function Start-SpotifyWithDebug {
    param(
        [Parameter(Mandatory = $true)][string]$SpotifyExe,
        [int]$Port = 9222
    )
    $arguments = @(
        "--remote-debugging-port=$Port",
        "--remote-allow-origins=http://localhost:$Port"
    )
    Start-Process -FilePath $SpotifyExe -ArgumentList $arguments | Out-Null
}

function Wait-DevToolsPort {
    param(
        [int]$Port = 9222,
        [int]$TimeoutSeconds = 40
    )
    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        if (Test-DevToolsPort -Port $Port) { return $true }
        Start-Sleep -Milliseconds 500
    }
    return $false
}

function Invoke-CdpExpression {
    param(
        [Parameter(Mandatory = $true)][string]$WebSocketUrl,
        [Parameter(Mandatory = $true)][string]$Expression,
        [int]$TimeoutSeconds = 45
    )

    $socket = New-Object System.Net.WebSockets.ClientWebSocket
    $socket.Options.KeepAliveInterval = [TimeSpan]::FromSeconds(15)
    $cancel = [System.Threading.CancellationToken]::None
    try {
        $socket.ConnectAsync([Uri]$WebSocketUrl, $cancel).Wait($TimeoutSeconds * 1000) | Out-Null
        if ($socket.State -ne [System.Net.WebSockets.WebSocketState]::Open) {
            throw "Could not open the DevTools connection ($($socket.State))."
        }

        $payload = @{
            id     = 1
            method = 'Runtime.evaluate'
            params = @{
                expression    = $Expression
                awaitPromise  = $true
                returnByValue = $true
                userGesture   = $true
            }
        } | ConvertTo-Json -Depth 6 -Compress

        $bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
        $socket.SendAsync([ArraySegment[byte]]::new($bytes), [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $cancel).Wait($TimeoutSeconds * 1000) | Out-Null

        $buffer = New-Object byte[] 1048576
        $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
        while ((Get-Date) -lt $deadline) {
            $segment = [ArraySegment[byte]]::new($buffer)
            $receive = $socket.ReceiveAsync($segment, $cancel)
            $remaining = [int][Math]::Max(1000, ($deadline - (Get-Date)).TotalMilliseconds)
            if (-not $receive.Wait($remaining)) { throw 'Timed out waiting for Spotify to respond.' }

            $result = $receive.Result
            $text = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $result.Count)
            if (-not $result.EndOfMessage) { continue }
            if (-not $text.TrimStart().StartsWith('{')) { continue }

            $message = $text | ConvertFrom-Json
            if ($message.PSObject.Properties.Name -notcontains 'id') { continue }
            if ($message.id -ne 1) { continue }
            if ($message.result -and $message.result.exceptionDetails) {
                $detail = $message.result.exceptionDetails
                $description = if ($detail.exception -and $detail.exception.description) { $detail.exception.description } else { $detail.text }
                throw "Spotify page error: $description"
            }
            return $message.result.result.value
        }
        throw 'No response was received from Spotify.'
    }
    finally {
        if ($socket.State -eq [System.Net.WebSockets.WebSocketState]::Open) {
            try { $socket.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, 'done', $cancel).Wait(1500) | Out-Null } catch { }
        }
        $socket.Dispose()
    }
}

function Write-InjectorLog {
    param(
        [Parameter(Mandatory = $true)][string]$Message,
        [string]$LogPath
    )
    if (-not $LogPath) { return }
    try {
        $line = "{0} {1}" -f (Get-Date).ToString('s'), $Message
        Add-Content -LiteralPath $LogPath -Value $line -Encoding UTF8
        $info = Get-Item -LiteralPath $LogPath -ErrorAction SilentlyContinue
        if ($info -and $info.Length -gt 512000) {
            $lines = Get-Content -LiteralPath $LogPath -Tail 400
            Set-Content -LiteralPath $LogPath -Value $lines -Encoding UTF8
        }
    }
    catch { }
}
