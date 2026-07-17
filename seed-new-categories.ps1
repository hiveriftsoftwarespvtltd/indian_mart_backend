$token = $null

Write-Host "Connecting to login API..."
try {
    $loginRes = Invoke-RestMethod `
        -Uri "http://localhost:9003/api/v1/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"email":"vineetvineet8006@gmail.com","password":"123456"}' `
        -ErrorAction Stop
    $token = $loginRes.access_token
    Write-Host "Login OK"
} catch {
    Write-Host "Login failed: $($_.Exception.Message)"
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type"  = "application/json"
}

# Clear any old categories directly from MongoDB
Write-Host "Clearing existing categories..."
$mongoUri = "mongodb://rs5045280:xbpneTRReMJD9LAc@ac-qpd9k1n-shard-00-00.sbbouj5.mongodb.net:27017,ac-qpd9k1n-shard-00-01.sbbouj5.mongodb.net:27017,ac-qpd9k1n-shard-00-02.sbbouj5.mongodb.net:27017/indian_mart_backend?ssl=true&replicaSet=atlas-45jbz5-shard-0&authSource=admin&retryWrites=true&w=majority"
node -e "const mongoose = require('mongoose'); mongoose.connect('$mongoUri').then(async () => { await mongoose.connection.db.collection('categories').deleteMany({}); mongoose.disconnect(); }).catch(e => console.error(e));"
Start-Sleep -Seconds 2

# List of 16 categories requested by user
$cats = @(
    "Fiber Buddha Statue",
    "Fiber Animal Statue",
    "Artificial Tree For Event",
    "Artificial Trees",
    "FRP Sculpture Art",
    "Fiber Glowing Statue",
    "Artificial Flowers Tree",
    "Fiber God Statue",
    "Fiber Ashoka Pillar",
    "FRP Cartoon Statue",
    "Fiber Bird Statue",
    "Bhim Rao Ambedkar Statue",
    "FRP Artificial Stone",
    "FRP Statue",
    "FRP Glowing Tree",
    "Animal Statues"
)

foreach ($cat in $cats) {
    try {
        $body = '{"name":"' + $cat + '"}'
        $result = Invoke-RestMethod `
            -Uri "http://localhost:9003/api/v1/categories" `
            -Method POST `
            -Headers $headers `
            -Body $body `
            -ErrorAction Stop
        Write-Host "Added Category: $($result.name)"
    } catch {
        Write-Host "Failed '$cat': $($_.Exception.Message)"
    }
}

Write-Host "Done seeding new categories!"
