# PowerShell script to detect Windows timezone and convert to IANA format
# This creates a .env file with the TZ variable

# Get Windows timezone
$windowsTimeZone = [System.TimeZoneInfo]::Local.Id

# Map Windows timezone to IANA timezone
$timezoneMap = @{
    "South Africa Standard Time" = "Africa/Johannesburg"
    "GMT Standard Time" = "Europe/London"
    "GMT" = "Etc/GMT"
    "UTC" = "UTC"
    "Central European Standard Time" = "Europe/Paris"
    "Eastern Standard Time" = "America/New_York"
    "Pacific Standard Time" = "America/Los_Angeles"
    "Central Standard Time" = "America/Chicago"
    "Mountain Standard Time" = "America/Denver"
    "China Standard Time" = "Asia/Shanghai"
    "Tokyo Standard Time" = "Asia/Tokyo"
    "India Standard Time" = "Asia/Kolkata"
    "AUS Eastern Standard Time" = "Australia/Sydney"
    "E. Australia Standard Time" = "Australia/Brisbane"
    "W. Europe Standard Time" = "Europe/Berlin"
    "Romance Standard Time" = "Europe/Paris"
    "Central Europe Standard Time" = "Europe/Warsaw"
}

# Get IANA timezone or default to UTC
$ianaTimezone = $timezoneMap[$windowsTimeZone]
if (-not $ianaTimezone) {
    Write-Host "Warning: Could not map Windows timezone '$windowsTimeZone' to IANA format. Using UTC as default."
    Write-Host "You can manually set the TZ variable in the .env file."
    $ianaTimezone = "UTC"
} else {
    Write-Host "Detected timezone: $windowsTimeZone -> $ianaTimezone"
}

# Create .env file
$envContent = "TZ=$ianaTimezone"
Set-Content -Path ".env" -Value $envContent

Write-Host ".env file created with TZ=$ianaTimezone"
