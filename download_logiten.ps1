# Script tải toàn bộ trang của logiten.framer.website
# Chạy: powershell -ExecutionPolicy Bypass -File download_logiten.ps1

$base = "https://logiten.framer.website"

$pages = @(
    "/",
    "/about",
    "/blog",
    "/contact",
    "/services",
    "/team",
    "/404",
    "/blog/optimizing-your-supply-chain-for-maximum-efficiency-copy",
    "/blog/companies-can-achieve-this-by-optimizing-transportation-routes.",
    "/blog/using-smart-inventory-systems-and-adopting-advanced-logistics",
    "/services/freight-transportation",
    "/services/warehousing-distribution",
    "/services/air-freight-solutions",
    "/services/ocean-freight-services",
    "/services/supply-chain-management"
)

New-Item -ItemType Directory -Force -Path "pages" | Out-Null

foreach ($page in $pages) {
    $url = "$base$page"

    # Tạo tên file an toàn từ path
    if ($page -eq "/") {
        $filename = "index.html"
    } else {
        $clean = $page.Trim("/") -replace "/", "_"
        $filename = "$clean.html"
    }

    $outPath = Join-Path "pages" $filename
    Write-Host "Downloading: $url -> $outPath"

    curl.exe -s -o $outPath $url

    Start-Sleep -Milliseconds 300
}

Write-Host ""
Write-Host "Xong. Tat ca file nam trong thu muc .\pages\"
Write-Host "Tong so trang: $($pages.Count)"
