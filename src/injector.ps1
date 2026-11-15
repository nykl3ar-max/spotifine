#Requires -Version 5.1
<#
.SYNOPSIS
    Injects the Spotify Ultimate Mod interface into the running Spotify client.

.DESCRIPTION
    Starts Spotify with the Chromium DevTools port enabled when necessary, then
    injects the mod payload (lyrics, translation, artist information and themes)
    into the Spotify window through the DevTools protocol. No Spotify files are
    modified.

.PARAMETER Port
    DevTools port. Defaults to 9222.

.PARAMETER Watch
    Keep the mod alive: re-inject after Spotify reloads or restarts.

.PARAMETER NoRestart
    Do not restart Spotify when it is running without the DevTools port.

.PARAMETER Quiet
    Suppress console output.
#>
[CmdletBinding()]
param(
    [int]$Port = 9222,
    [switch]$Watch,
    [switch]$NoRestart,
    [switch]$Quiet
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'common.ps1')

$installRoot = Split-Path -Parent $PSScriptRoot
$logPath = Join-Path $installRoot 'injector.log'
$payloadPath = Join-Path $PSScriptRoot 'payload.js'
$cssPath = Join-Path $PSScriptRoot 'theme.css'

function Say {
    param([string]$Message)
    if (-not $Quiet) { Write-Host $Message }
    Write-InjectorLog -Message $Message -LogPath $logPath
}

foreach ($required in @($payloadPath, $cssPath)) {
    if (-not (Test-Path -LiteralPath $required)) {
        Say "Missing file: $required"
        exit 1
    }
}

$spotifyExe = Find-SpotifyExe
if (-not $spotifyExe) {
    Say 'Spotify was not found. Install the desktop app from spotify.com, then run this again.'
    exit 1
}

if (-not (Test-DevToolsPort -Port $Port)) {
    if ($NoRestart) {
        Say 'Spotify is not running with the DevTools port. Start it through the Spotify Ultimate Mod shortcut.'
        exit 1
    }
    if (Get-Process -Name 'Spotify' -ErrorAction SilentlyContinue) {
        Say 'Restarting Spotify to enable the mod...'
        Stop-SpotifyClient
        Start-Sleep -Seconds 2
    }
    Say 'Starting Spotify...'
    Start-SpotifyWithDebug -SpotifyExe $spotifyExe -Port $Port
    if (-not (Wait-DevToolsPort -Port $Port -TimeoutSeconds 60)) {
        Say 'Spotify did not open its debugging port. Close Spotify and run this again.'
        exit 1
    }
}

$cssText = [System.IO.File]::ReadAllText($cssPath)
$payloadText = [System.IO.File]::ReadAllText($payloadPath)
$cssJson = ConvertTo-Json -InputObject $cssText -Compress
$expression = "window.__SUM_CSS__ = $cssJson;`n" + $payloadText

function Invoke-Injection {
    $target = Get-SpotifyPageTarget -Port $Port
    if (-not $target) { return $false }
    try {
        $result = Invoke-CdpExpression -WebSocketUrl $target.webSocketDebuggerUrl -Expression $expression -TimeoutSeconds 60
        return ($result -eq 'ok')
    }
    catch {
        Say "Injection attempt failed: $($_.Exception.Message)"
        return $false
    }
}

$injected = $false
for ($attempt = 0; $attempt -lt 12; $attempt++) {
    if (Invoke-Injection) { $injected = $true; break }
    Start-Sleep -Millis 1500
}

if ($injected) {
    Say 'Spotify Ultimate Mod is active. Press Ctrl+Shift+U or use the Ultimate button to open it.'
}
else {
    Say 'The mod could not be injected. Open Spotify, start a track and run the shortcut again.'
    exit 1
}

if (-not $Watch) { exit 0 }

Say 'Watching Spotify for reloads...'
while ($true) {
    try {
        if (-not (Get-Process -Name 'Spotify' -ErrorAction SilentlyContinue)) {
            Say 'Spotify was closed. The watcher has stopped.'
            break
        }
        if (-not (Test-DevToolsPort -Port $Port)) {
            Start-Sleep -Seconds 3
            continue
        }
        $target = Get-SpotifyPageTarget -Port $Port
        if ($target) {
            $present = Invoke-CdpExpression -WebSocketUrl $target.webSocketDebuggerUrl -Expression "Boolean(document.getElementById('sum-root'))" -TimeoutSeconds 10
            if ($present -ne $true -and $present -ne 'true') {
                if (Invoke-Injection) { Say 'Re-injected after a Spotify reload.' }
            }
        }
    }
    catch { }
    Start-Sleep -Seconds 2
}
