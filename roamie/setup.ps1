Write-Host "Installing Node.js..."
winget install OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements --silent

Write-Host "Refreshing PATH..."
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    $env:Path += ";C:\Program Files\nodejs"
}

cd c:\pirojectsssss\roamie\tripmind
Write-Host "Installing Root Dependencies..."
npm install

Write-Host "Installing API Dependencies..."
cd apps/api
npm install

Write-Host "Installing Web Dependencies..."
cd ../web
npm install

Write-Host "Setting up Database..."
cd ../api
npx prisma migrate dev --name init
npm run seed

Write-Host "Starting application..."
cd ../..
npm run dev
