param(
  [switch]$Install,
  [switch]$NoInstall
)

$ErrorActionPreference = "Continue"

$RequiredNodeVersion = [version]"22.11.0"
$RequiredJdkMajor = 17
$MinimumGitVersion = [version]"2.40.0"

$Checks = New-Object System.Collections.Generic.List[object]
$InstallQueue = New-Object System.Collections.Generic.List[object]

function Write-Section($Title) {
  Write-Host ""
  Write-Host "== $Title ==" -ForegroundColor Cyan
}

function Add-Check($Name, $Status, $Details, $Fix = $null) {
  $Checks.Add([pscustomobject]@{
    Name = $Name
    Status = $Status
    Details = $Details
    Fix = $Fix
  }) | Out-Null
}

function Add-Install($Name, $WingetId) {
  $alreadyQueued = $InstallQueue | Where-Object { $_.WingetId -eq $WingetId }
  if (-not $alreadyQueued) {
    $InstallQueue.Add([pscustomobject]@{
      Name = $Name
      WingetId = $WingetId
    }) | Out-Null
  }
}

function Get-CommandPath($CommandName) {
  $cmd = Get-Command $CommandName -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  return $null
}

function Parse-Version($Text) {
  if ($Text -match '(\d+)\.(\d+)\.(\d+)') {
    return [version]$Matches[0]
  }
  if ($Text -match '(\d+)\.(\d+)') {
    return [version]("$($Matches[1]).$($Matches[2]).0")
  }
  return $null
}

function Test-UserPathContains($PathToCheck) {
  $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
  if (-not $userPath) { return $false }

  $parts = $userPath -split ';' | ForEach-Object { $_.Trim().TrimEnd('\') }
  return $parts -contains $PathToCheck.Trim().TrimEnd('\')
}

function Add-ToUserPath($PathToAdd) {
  if (-not (Test-Path $PathToAdd)) {
    return $false
  }

  if (Test-UserPathContains $PathToAdd) {
    return $true
  }

  $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
  if ([string]::IsNullOrWhiteSpace($userPath)) {
    [Environment]::SetEnvironmentVariable("Path", $PathToAdd, "User")
  } else {
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$PathToAdd", "User")
  }

  return $true
}

function Test-IsWindows() {
  return $IsWindows -or $env:OS -eq "Windows_NT"
}

function Install-WingetPackage($Package) {
  Write-Host ""
  Write-Host "Installing $($Package.Name) [$($Package.WingetId)]..." -ForegroundColor Yellow

  & winget install -e --id $Package.WingetId --accept-source-agreements --accept-package-agreements

  if ($LASTEXITCODE -eq 0) {
    Write-Host "Installed $($Package.Name)." -ForegroundColor Green
  } else {
    Write-Host "winget returned exit code $LASTEXITCODE while installing $($Package.Name)." -ForegroundColor Red
  }
}

Write-Section "NiteLight dev environment check"

if (-not (Test-IsWindows)) {
  Write-Host "This checker is currently Windows-only because the Android team setup uses Android Studio + winget." -ForegroundColor Red
  exit 1
}

$wingetPath = Get-CommandPath "winget"
if ($wingetPath) {
  Add-Check "winget" "PASS" "Found winget at $wingetPath"
} else {
  Add-Check "winget" "FAIL" "winget was not found. Install App Installer from the Microsoft Store, then rerun this script."
}

$gitPath = Get-CommandPath "git"
if ($gitPath) {
  $gitVersionText = (& git --version) 2>$null
  $gitVersion = Parse-Version $gitVersionText

  if ($gitVersion -and $gitVersion -ge $MinimumGitVersion) {
    Add-Check "Git" "PASS" "$gitVersionText at $gitPath"
  } elseif ($gitVersion) {
    Add-Check "Git" "WARN" "Found $gitVersionText, recommended >= $MinimumGitVersion"
    Add-Install "Git" "Git.Git"
  } else {
    Add-Check "Git" "WARN" "Found Git, but could not parse version: $gitVersionText"
  }
} else {
  Add-Check "Git" "FAIL" "Git was not found."
  Add-Install "Git" "Git.Git"
}


$codePath = Get-CommandPath "code"
$codeExeCandidates = @(
  "$env:LOCALAPPDATA\Programs\Microsoft VS Code\Code.exe",
  "$env:ProgramFiles\Microsoft VS Code\Code.exe",
  "${env:ProgramFiles(x86)}\Microsoft VS Code\Code.exe"
) | Where-Object { $_ -and (Test-Path $_) }

if ($codePath) {
  Add-Check "VS Code" "PASS" "Found code command at $codePath"
} elseif ($codeExeCandidates.Count -gt 0) {
  Add-Check "VS Code" "WARN" "VS Code exists, but the 'code' command is not on PATH. Open VS Code, run 'Shell Command: Install code command in PATH', or reinstall with PATH enabled."
} else {
  Add-Check "VS Code" "FAIL" "VS Code was not found."
  Add-Install "VS Code" "Microsoft.VisualStudioCode"
}

$nodePath = Get-CommandPath "node"
if ($nodePath) {
  $nodeVersionText = (& node --version) 2>$null
  $nodeVersion = Parse-Version $nodeVersionText

  if ($nodeVersion -and $nodeVersion -ge $RequiredNodeVersion) {
    Add-Check "Node.js" "PASS" "Found $nodeVersionText at $nodePath"
  } elseif ($nodeVersion) {
    Add-Check "Node.js" "FAIL" "Found $nodeVersionText, but this project needs >= v$RequiredNodeVersion"
    Add-Install "Node.js 22" "OpenJS.NodeJS.22"
  } else {
    Add-Check "Node.js" "FAIL" "Found Node, but could not parse version: $nodeVersionText"
    Add-Install "Node.js 22" "OpenJS.NodeJS.22"
  }
} else {
  Add-Check "Node.js" "FAIL" "Node.js was not found."
  Add-Install "Node.js 22" "OpenJS.NodeJS.22"
}

$npmPath = Get-CommandPath "npm"
if ($npmPath) {
  $npmVersion = (& npm --version) 2>$null
  Add-Check "npm" "PASS" "Found npm $npmVersion at $npmPath"
} else {
  Add-Check "npm" "FAIL" "npm was not found. It should be installed with Node.js."
  Add-Install "Node.js 22" "OpenJS.NodeJS.22"
}

$javaPath = Get-CommandPath "java"
if ($javaPath) {
  $javaOutput = (& java -version) 2>&1 | Out-String
  $javaVersion = Parse-Version $javaOutput

  if ($javaVersion -and $javaVersion.Major -eq $RequiredJdkMajor) {
    Add-Check "JDK" "PASS" "Found Java $javaVersion at $javaPath"
  } elseif ($javaVersion) {
    Add-Check "JDK" "FAIL" "Found Java $javaVersion, but React Native Android setup for this project expects JDK $RequiredJdkMajor."
    Add-Install "JDK 17" "EclipseAdoptium.Temurin.17.JDK"
  } else {
    Add-Check "JDK" "FAIL" "Java exists, but version could not be parsed."
    Add-Install "JDK 17" "EclipseAdoptium.Temurin.17.JDK"
  }
} else {
  Add-Check "JDK" "FAIL" "Java/JDK was not found."
  Add-Install "JDK 17" "EclipseAdoptium.Temurin.17.JDK"
}

$androidStudioCandidates = @(
  "$env:ProgramFiles\Android\Android Studio\bin\studio64.exe",
  "${env:ProgramFiles(x86)}\Android\Android Studio\bin\studio64.exe",
  "$env:LOCALAPPDATA\Programs\Android Studio\bin\studio64.exe"
) | Where-Object { $_ -and (Test-Path $_) }

if ($androidStudioCandidates.Count -gt 0) {
  Add-Check "Android Studio" "PASS" "Found Android Studio at $($androidStudioCandidates[0])"
} else {
  Add-Check "Android Studio" "FAIL" "Android Studio was not found in the usual locations."
  Add-Install "Android Studio" "Google.AndroidStudio"
}

$sdkCandidates = @()
if ($env:ANDROID_HOME) { $sdkCandidates += $env:ANDROID_HOME }
if ($env:ANDROID_SDK_ROOT) { $sdkCandidates += $env:ANDROID_SDK_ROOT }
if ($env:LOCALAPPDATA) { $sdkCandidates += "$env:LOCALAPPDATA\Android\Sdk" }

$androidSdkPath = $sdkCandidates | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1

if ($androidSdkPath) {
  Add-Check "Android SDK" "PASS" "Found Android SDK at $androidSdkPath"

  if ($env:ANDROID_HOME -ne $androidSdkPath) {
    [Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidSdkPath, "User")
    Add-Check "ANDROID_HOME" "WARN" "Set user ANDROID_HOME to $androidSdkPath. Restart terminal/VS Code for it to take effect."
  } else {
    Add-Check "ANDROID_HOME" "PASS" "ANDROID_HOME is set to $env:ANDROID_HOME"
  }

  $sdkPathItems = @(
    "$androidSdkPath\platform-tools",
    "$androidSdkPath\emulator",
    "$androidSdkPath\cmdline-tools\latest\bin"
  )

  foreach ($item in $sdkPathItems) {
    if (Test-Path $item) {
      $added = Add-ToUserPath $item
      if ($added) {
        Add-Check "PATH" "PASS" "Ensured PATH contains $item"
      }
    } else {
      Add-Check "Android SDK component" "WARN" "Missing folder: $item. Open Android Studio > SDK Manager and install the matching component."
    }
  }
} else {
  Add-Check "Android SDK" "WARN" "Android SDK folder was not found. Open Android Studio once and complete SDK setup."
}

$adbPath = Get-CommandPath "adb"
if ($adbPath) {
  Add-Check "adb" "PASS" "Found adb at $adbPath"
} else {
  Add-Check "adb" "WARN" "adb was not found on PATH. It usually appears after Android SDK Platform-Tools is installed and PATH is updated."
}

$emulatorPath = Get-CommandPath "emulator"
if ($emulatorPath) {
  Add-Check "Android emulator" "PASS" "Found emulator command at $emulatorPath"
} else {
  Add-Check "Android emulator" "WARN" "emulator command was not found on PATH. Install Android Emulator in Android Studio SDK Manager and restart terminal."
}

$repoRoot = $null
$current = Get-Location
for ($i = 0; $i -lt 5; $i++) {
  $candidate = Join-Path $current "package.json"
  if (Test-Path $candidate) {
    $repoRoot = $current
    break
  }
  $parent = Split-Path $current -Parent
  if ($parent -eq $current) { break }
  $current = $parent
}

if ($repoRoot) {
  $packageJson = Get-Content (Join-Path $repoRoot "package.json") -Raw | ConvertFrom-Json

  if ($packageJson.scripts.'setup:env') {
    Add-Check "Project setup:env" "PASS" "Found npm script setup:env."
  } else {
    Add-Check "Project setup:env" "WARN" "Missing npm script setup:env."
  }

  if (Test-Path (Join-Path $repoRoot "package-lock.json")) {
    Add-Check "Package manager" "PASS" "Found package-lock.json. Use npm install."
  } else {
    Add-Check "Package manager" "WARN" "package-lock.json was not found."
  }
} else {
  Add-Check "Project" "WARN" "No package.json found nearby. Project-specific npm checks were skipped."
}

Write-Section "Report"

foreach ($check in $Checks) {
  switch ($check.Status) {
    "PASS" { $color = "Green" }
    "WARN" { $color = "Yellow" }
    "FAIL" { $color = "Red" }
    default { $color = "White" }
  }

  Write-Host ("[{0}] {1}: {2}" -f $check.Status, $check.Name, $check.Details) -ForegroundColor $color
}

$failCount = ($Checks | Where-Object { $_.Status -eq "FAIL" }).Count
$warnCount = ($Checks | Where-Object { $_.Status -eq "WARN" }).Count

Write-Section "Summary"
Write-Host "Failures: $failCount"
Write-Host "Warnings: $warnCount"

if ($InstallQueue.Count -gt 0) {
  Write-Host ""
  Write-Host "Can install or fix these with winget:" -ForegroundColor Cyan
  foreach ($package in $InstallQueue) {
    Write-Host "- $($package.Name) [$($package.WingetId)]"
  }

  if (-not $wingetPath) {
    Write-Host ""
    Write-Host "winget is missing, so automatic install cannot continue. Install App Installer from the Microsoft Store first." -ForegroundColor Red
    exit 1
  }

  $shouldInstall = $false

  if ($Install) {
    $shouldInstall = $true
  } elseif ($NoInstall) {
    $shouldInstall = $false
  } else {
    Write-Host ""
    $answer = Read-Host "Install missing/wrong-version tools now? This may show installer/UAC prompts. Type Y to continue"
    $shouldInstall = $answer -match '^(y|yes)$'
  }

  if ($shouldInstall) {
    foreach ($package in $InstallQueue) {
      Install-WingetPackage $package
    }

    Write-Host ""
    Write-Host "Installs finished. Close and reopen PowerShell/VS Code, then run this script again." -ForegroundColor Yellow
    exit 0
  }
}

Write-Host ""
if ($failCount -eq 0) {
  Write-Host "Machine check finished. If Android Studio was just installed, open it once and complete SDK/emulator setup." -ForegroundColor Green
  if ($repoRoot) {
    Write-Host "Next project commands:" -ForegroundColor Cyan
    Write-Host "  npm install"
    Write-Host "  npm run setup:env"
    Write-Host "  npm run android"
  }
} else {
  Write-Host "Fix the failures above, then rerun this script." -ForegroundColor Red
}
