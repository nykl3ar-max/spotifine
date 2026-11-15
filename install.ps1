#Requires -Version 5.1
<#
.SYNOPSIS
    Installs Spotifine into the Spotify desktop client.

.DESCRIPTION
    Downloads the mod files, creates Desktop and Start Menu launchers, starts
    Spotify with the Chromium DevTools port enabled and injects the interface.
    No Spotify files are modified and nothing else needs to be installed.

.EXAMPLE
    irm https://raw.githubusercontent.com/nykl3ar-max/spotifine/main/install.ps1 | iex
#>

$ErrorActionPreference = 'Stop'
$Version = '3.9.2'
$Repo = 'nykl3ar-max/spotifine'
$Branch = 'main'
$BaseUrl = "https://raw.githubusercontent.com/$Repo/$Branch"
$CacheBust = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
$InstallDir = Join-Path $env:LOCALAPPDATA 'Spotifine'
$SrcDir = Join-Path $InstallDir 'src'
$Files = @('src/common.ps1', 'src/injector.ps1', 'src/payload.js', 'src/theme.css', 'uninstall.ps1')

function Write-Step {
    param([string]$Text)
    Write-Host "  ==> $Text" -ForegroundColor Cyan
}

function Find-SpotifyExe {
    $candidates = @(
        (Join-Path $env:APPDATA 'Spotify\Spotify.exe'),
        (Join-Path $env:PROGRAMFILES 'Spotify\Spotify.exe'),
        (Join-Path ${env:ProgramFiles(x86)} 'Spotify\Spotify.exe')
    )
    foreach ($candidate in $candidates) {
        if ($candidate -and (Test-Path -LiteralPath $candidate)) { return $candidate }
    }
    $store = Join-Path $env:LOCALAPPDATA 'Microsoft\WindowsApps\Spotify.exe'
    if (Test-Path -LiteralPath $store) { return $store }
    return $null
}

Write-Host ''
Write-Host '  Spotifine' -ForegroundColor White
Write-Host '  Lyrics, translation, artist information and themes inside Spotify' -ForegroundColor DarkGray
Write-Host ''

if ([System.Environment]::OSVersion.Platform -ne [System.PlatformID]::Win32NT) {
    Write-Host '  This installer supports Windows only.' -ForegroundColor Red
    return
}

$spotify = Find-SpotifyExe
if (-not $spotify) {
    Write-Host '  Spotify was not found on this PC.' -ForegroundColor Red
    Write-Host '  Install the Spotify desktop app from spotify.com, then run this command again.' -ForegroundColor DarkGray
    return
}
Write-Host "  Found Spotify: $spotify" -ForegroundColor DarkGray

Write-Step 'Downloading the mod files'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
if (-not (Test-Path -LiteralPath $SrcDir)) {
    New-Item -ItemType Directory -Path $SrcDir -Force | Out-Null
}

foreach ($file in $Files) {
    $target = Join-Path $InstallDir $file
    $parent = Split-Path -Parent $target
    if (-not (Test-Path -LiteralPath $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }
    $url = "$BaseUrl/$file`?t=$CacheBust"
    $downloaded = $false
    for ($attempt = 0; $attempt -lt 3 -and -not $downloaded; $attempt++) {
        try {
            Invoke-WebRequest -Uri $url -OutFile $target -UseBasicParsing -TimeoutSec 30
            $downloaded = $true
        }
        catch {
            Start-Sleep -Seconds 1
        }
    }
    if (-not $downloaded) {
        Write-Host "  Could not download $file. Check your internet connection and try again." -ForegroundColor Red
        return
    }
}
Set-Content -LiteralPath (Join-Path $InstallDir 'version.txt') -Value $Version -Encoding UTF8
Write-Host "  Files installed to $InstallDir" -ForegroundColor DarkGray

Write-Step 'Stopping an older watcher'
$legacyDir = Join-Path $env:LOCALAPPDATA 'SpotifyUltimateMod'
foreach ($dir in @($InstallDir, $legacyDir)) {
    $pidFile = Join-Path $dir 'injector.pid'
    if (Test-Path -LiteralPath $pidFile) {
        $recorded = Get-Content -LiteralPath $pidFile -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($recorded) {
            Stop-Process -Id ([int]$recorded) -Force -ErrorAction SilentlyContinue
        }
        Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue
    }
    Get-CimInstance Win32_Process -Filter "Name = 'powershell.exe'" -ErrorAction SilentlyContinue |
        Where-Object { $_.CommandLine -and $_.CommandLine -like "*$dir*" -and $_.CommandLine -like '*injector.ps1*' } |
        ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
}

Write-Step 'Removing the previous installation name'
$legacyShortcuts = @(
    [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Spotify Ultimate Mod.lnk'),
    [System.IO.Path]::Combine($env:APPDATA, 'Microsoft\Windows\Start Menu\Programs', 'Spotify Ultimate Mod.lnk')
)
foreach ($legacyShortcut in $legacyShortcuts) {
    if (Test-Path -LiteralPath $legacyShortcut) {
        Remove-Item -LiteralPath $legacyShortcut -Force -ErrorAction SilentlyContinue
    }
}
if (Test-Path -LiteralPath $legacyDir) {
    Remove-Item -LiteralPath $legacyDir -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Step 'Creating launchers'
$injector = Join-Path $SrcDir 'injector.ps1'
$arguments = '-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File "' + $injector + '" -Watch'
$powershell = (Get-Command 'powershell.exe').Source
$shortcuts = @(
    [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Spotifine.lnk'),
    [System.IO.Path]::Combine($env:APPDATA, 'Microsoft\Windows\Start Menu\Programs', 'Spotifine.lnk')
)
$shell = New-Object -ComObject WScript.Shell
foreach ($shortcutPath in $shortcuts) {
    $shortcut = $shell.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = $powershell
    $shortcut.Arguments = $arguments
    $shortcut.WorkingDirectory = $InstallDir
    $shortcut.IconLocation = "$spotify,0"
    $shortcut.Description = 'Spotifine - lyrics, artist information and themes'
    $shortcut.WindowStyle = 1
    $shortcut.Save()
}
Write-Host '  Desktop and Start Menu launchers created.' -ForegroundColor DarkGray

Write-Step 'Starting Spotify and injecting the mod'
& $powershell -NoProfile -ExecutionPolicy Bypass -File $injector

Write-Step 'Starting the background watcher'
Start-Process -FilePath $powershell -ArgumentList @(
    '-NoProfile', '-WindowStyle', 'Hidden', '-ExecutionPolicy', 'Bypass', '-File', "`"$injector`"", '-Watch'
) -WindowStyle Hidden
Write-Host '  The mod stays active while Spotify is running.' -ForegroundColor DarkGray

Write-Host ''
Write-Host '  Spotifine is ready.' -ForegroundColor Green
Write-Host ''
Write-Host '  Open the panel with Ctrl+Shift+U or the "Spotifine" button.' -ForegroundColor White
Write-Host '  Use the Desktop shortcut next time so Spotify always starts with the mod.' -ForegroundColor DarkGray
Write-Host ('  Uninstall with: irm ' + "$BaseUrl/uninstall.ps1" + ' | iex') -ForegroundColor DarkGray
Write-Host ''
Write-Host '  Spotify is not modified on disk. This project is not affiliated with Spotify.' -ForegroundColor DarkGray
Write-Host ''
