$token = $null
$maxTries = 12

Write-Host "Waiting for backend to start..."
for ($i = 1; $i -le $maxTries; $i++) {
    try {
        $r = Invoke-RestMethod `
            -Uri "http://localhost:9003/api/v1/auth/login" `
            -Method POST `
            -ContentType "application/json" `
            -Body '{"email":"vineetvineet8006@gmail.com","password":"123456"}' `
            -ErrorAction Stop
        $token = $r.access_token
        Write-Host "Login OK on attempt $i"
        break
    } catch {
        Write-Host "Attempt $i failed, retrying in 5s..."
        Start-Sleep -Seconds 5
    }
}

if (-not $token) {
    Write-Host "Backend not reachable after $maxTries attempts. Exiting."
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type"  = "application/json"
}

$categories = @(
    "Fiber Buddha Statue",
    "Fiber Animal Statue",
    "Artificial Tree",
    "Wooden Art",
    "Modern Decor",
    "Corporate Gift"
)

foreach ($cat in $categories) {
    try {
        $body = '{"name":"' + $cat + '"}'
        $result = Invoke-RestMethod `
            -Uri "http://localhost:9003/api/v1/categories" `
            -Method POST `
            -Headers $headers `
            -Body $body `
            -ErrorAction Stop
        Write-Host "Added: $($result.name)"
    } catch {
        Write-Host "Failed '$cat': $($_.Exception.Message)"
    }
}

Write-Host "Done seeding categories!"
