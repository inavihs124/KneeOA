$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    $env:Path += ";C:\Program Files\nodejs"
}

cd c:\pirojectsssss\roamie\tripmind
Copy-Item .env.example .env -Force
Copy-Item .env.example apps/api/.env -Force

Write-Host "Setting up Database..."
cd apps/api
npx prisma migrate dev --name init
npm run seed

Write-Host "Starting application..."
cd ../..
npm run dev
