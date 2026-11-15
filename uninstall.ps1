#Requires -Version 5.1
<#
.SYNOPSIS
    Removes Spotify Ultimate Mod from this PC.

.DESCRIPTION
    Stops the background watcher, removes the launchers and deletes the mod
    files. Spotify itself is not modified and your Spotify data is untouched.

.EXAMPLE
    irm https://raw.githubusercontent.com/nykl3ar-max/spotify-ultimate-mod-injector/main/uninstall.ps1 | iex
#>

$ErrorActionPreference = 'Stop'
$InstallDir = Join-Path $env:LOCALAPPDATA 'SpotifyUltimateMod'

Write-Host ''
Write-Host '  Spotify Ultimate Mod uninstaller' -ForegroundColor White
Write-Host ''

$pidFile = Join-Path $InstallDir 'injector.pid'
if (Test-Path -LiteralPath $pidFile) {
    $recorded = Get-Content -LiteralPath $pidFile -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($recorded) {
        Stop-Process -Id ([int]$recorded) -Force -ErrorAction SilentlyContinue
    }
}

Get-CimInstance Win32_Process -Filter "Name = 'powershell.exe'" -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -and $_.CommandLine -like "*$InstallDir*" -and $_.CommandLine -like '*injector.ps1*' } |
    ForEach-Object {
        Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
        Write-Host "  Stopped watcher $($_.ProcessId)" -ForegroundColor DarkGray
    }

$shortcuts = @(
    [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Spotify Ultimate Mod.lnk'),
    [System.IO.Path]::Combine($env:APPDATA, 'Microsoft\Windows\Start Menu\Programs', 'Spotify Ultimate Mod.lnk')
)
foreach ($shortcut in $shortcuts) {
    if (Test-Path -LiteralPath $shortcut) {
        Remove-Item -LiteralPath $shortcut -Force
        Write-Host "  Removed $shortcut" -ForegroundColor DarkGray
    }
}

if (Test-Path -LiteralPath $InstallDir) {
    Remove-Item -LiteralPath $InstallDir -Recurse -Force -ErrorAction SilentlyContinue
    if (Test-Path -LiteralPath $InstallDir) {
        Write-Host '  Some files could not be removed. Close Spotify and run this again.' -ForegroundColor Yellow
    }
    else {
        Write-Host "  Removed $InstallDir" -ForegroundColor DarkGray
    }
}

Write-Host ''
Write-Host '  Spotify Ultimate Mod was removed.' -ForegroundColor Green
Write-Host '  Spotify is unchanged. The mod disappears the next time Spotify starts normally.' -ForegroundColor DarkGray
Write-Host ''
