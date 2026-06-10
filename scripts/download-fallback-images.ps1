$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$outputRoot = Join-Path $root "assets\images\motos"
$creditsPath = Join-Path $root "data\image-credits.json"

$sets = @(
  @{
    id = "cfmoto-800mt-sport"; author = "CFMOTO"; license = "Press image / see source"; source = "https://www.cfmoto.com.tr/urunler/800-mt-sport"
    urls = @(
      "https://www.cfmoto.com.tr/images/800-mt-sport/800MT-SP-G-1.jpg",
      "https://www.cfmoto.com.tr/images/800-mt-sport/800MT-SP-G-2.jpg",
      "https://www.cfmoto.com.tr/images/800-mt-sport/800MT-SP-G-3.jpg"
    )
  },
  @{
    id = "ktm-1390-super-adventure-s"; author = "KTM"; license = "Press image / see source"; source = "https://www.ktm.com/it-it/models/travel/2025-ktm-1390-superadventures.html"
    urls = @(
      "https://azwecdnepstoragewebsiteuploads.azureedge.net/PHO_STAGE_MY25-KTM-1390-SUPER-ADVENTURE-S-STAGE_%23SALL_%23AEPI_%23V1.jpg",
      "https://azwecdnepstoragewebsiteuploads.azureedge.net/PHO_BIKE_DET_MY25-KTM-1390-SUPER-ADVENTURE-S-ACTION-1_%23SALL_%23AEPI_%23V1.jpg",
      "https://azwecdnepstoragewebsiteuploads.azureedge.net/PHO_BIKE_DET_MY25-KTM-1390-SUPER-ADVENTURE-S-STATIC-2_%23SALL_%23AEPI_%23V1.jpg"
    )
  },
  @{
    id = "ktm-890-adventure-r"; author = "KTM"; license = "Press image / see source"; source = "https://www.ktm.com/it-it/models/travel/2025-ktm-890-adventurer.html"
    urls = @(
      "https://azwecdnepstoragewebsiteuploads.azureedge.net/PHO_STAGE_MY25-KTM-890-ADV-R-STAGE-1_%23SALL_%23AEPI_%23V1.jpg",
      "https://azwecdnepstoragewebsiteuploads.azureedge.net/PHO_BIKE_DET_MY25-KTM-890-ADV-R-ACTION-1_%23SALL_%23AEPI_%23V1.jpg",
      "https://azwecdnepstoragewebsiteuploads.azureedge.net/PHO_BIKE_DET_MY25-KTM-890-ADV-R-ACTION-4_%23SALL_%23AEPI_%23V1.jpg"
    )
  },
  @{
    id = "triumph-tiger-900-gt-pro"; author = "Wikimedia Commons contributors"; license = "See source"; source = "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=Triumph%20Tiger%20900%20GT%20Pro"
    urls = @(
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Triumph%20Tiger%20900%20GT%20Pro%20%281%29.jpg?width=1280",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/2021%20Triumph%20Tiger%20900%20GT%20LRH.jpg?width=1280",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Triumph%20Tiger%20900.jpg?width=1280"
    )
  },
  @{
    id = "triumph-tiger-sport-660"; author = "Wikimedia Commons contributors"; license = "See source"; source = "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=Triumph%20Tiger%20Sport%20660"
    urls = @(
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Triumph%20Tiger%20Sport%20660.jpg?width=1280",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tiger%20sport%20660%20Triumph.jpg?width=1280",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tiger%20sport%20660.jpg?width=1280"
    )
  },
  @{
    id = "triumph-tiger-sport-800"; author = "Wikimedia Commons contributors"; license = "See source"; source = "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=Triumph%20Tiger%20Sport%20800"
    urls = @(
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Triumph%20Tiger%20Sport%20800.jpg?width=1280",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Triumph%20Tiger%20Sport%20800%20Tour.jpg?width=1280",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Triumph%20Tiger%20Sport%20800.jpg?width=960"
    )
  },
  @{
    id = "voge-valico-900-dsx"; author = "Wikimedia Commons contributors"; license = "See source"; source = "https://commons.wikimedia.org/wiki/File:Voge_DS900X.jpg"
    urls = @(
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Voge%20DS900X.jpg?width=1280",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Voge%20DS900X.jpg?width=1024",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Voge%20DS900X.jpg?width=800"
    )
  },
  @{
    id = "yamaha-tracer-9-gt"; author = "Wikimedia Commons contributors"; license = "See source"; source = "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=Yamaha%20Tracer%209%20GT"
    urls = @(
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Yamaha%20Tracer%209%20GT%202024.jpg?width=1280",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Yamaha%20Tracer%209%20GT%2B%202025.jpg?width=1280",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Yamaha%20Tracer%209%20GT.jpg?width=1280"
    )
  },
  @{
    id = "yamaha-tracer-7-gt"; author = "Yamaha Motor"; license = "Press image / see source"; source = "https://www.yamaha-motor.eu/it/it/motorcycles/sport-touring/pdp/tracer-7-gt/"
    urls = @(
      "https://cdn2.yamaha-motor.eu/prod/product-assets/2025/MT07TRGT/2025-Yamaha-MT07TRGT-EU-Icon_Performance-Action-001-03.jpg",
      "https://cdn2.yamaha-motor.eu/prod/product-assets/2025/MT07TRGT/2025-Yamaha-MT07TRGT-EU-Icon_Performance-Action-001-03.jpg",
      "https://cdn2.yamaha-motor.eu/prod/product-assets/2025/MT07TRGT/2025-Yamaha-MT07TRGT-EU-Icon_Performance-Action-001-03.jpg"
    )
  },
  @{
    id = "zontes-703f"; author = "Wikimedia Commons contributors"; license = "See source"; source = "https://commons.wikimedia.org/wiki/File:2025_Zontes_703F.jpg"
    urls = @(
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/2025%20Zontes%20703F.jpg?width=1280",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/2025%20Zontes%20703F.jpg?width=1024",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/2025%20Zontes%20703F.jpg?width=800"
    )
  },
  @{
    id = "suzuki-gsx-s1000gx"; author = "Wikimedia Commons contributors"; license = "See source"; source = "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=Suzuki%20GSX-S1000GX"
    urls = @(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Suzuki_GSX-S1000GX_-_Side_View.jpg/1280px-Suzuki_GSX-S1000GX_-_Side_View.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Suzuki_GSX-S1000GX_-_Side_View_%28cropped%29.jpg/1280px-Suzuki_GSX-S1000GX_-_Side_View_%28cropped%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/2024_Suzuki_GSX-S_1000_GX.jpg/1280px-2024_Suzuki_GSX-S_1000_GX.jpg"
    )
  },
  @{
    id = "suzuki-v-strom-1050se"; author = "Wikimedia Commons contributors"; license = "See source"; source = "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=Suzuki%20V-Strom%201050"
    urls = @(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Suzuki_DL1050_V-Strom_XT.jpg/1280px-Suzuki_DL1050_V-Strom_XT.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Suzuki_V-Strom_1050.jpg/1280px-Suzuki_V-Strom_1050.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Suzuki_V-Strom_1050_resized.jpg/1280px-Suzuki_V-Strom_1050_resized.jpg"
    )
  },
  @{
    id = "suzuki-v-strom-800se"; author = "Wikimedia Commons contributors"; license = "See source"; source = "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=Suzuki%20V-Strom%20800"
    urls = @(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Suzuki_V-Storm_800_SE_2025.jpg/1280px-Suzuki_V-Storm_800_SE_2025.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Suzuki_V-Storm_800_SE_2025_%28cropped%29.jpg/1280px-Suzuki_V-Storm_800_SE_2025_%28cropped%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Suzuki_V-Strom_800DE_%283%29.jpg/1280px-Suzuki_V-Strom_800DE_%283%29.jpg"
    )
  },
  @{
    id = "kawasaki-versys-1100"; author = "Wikimedia Commons contributors"; license = "See source"; source = "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=Kawasaki%20Versys%201100"
    urls = @(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Kawasaki_Versys_1100_2026.jpg/1280px-Kawasaki_Versys_1100_2026.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Kawasaki_Versys_1100_2025.jpg/1280px-Kawasaki_Versys_1100_2025.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Kawasaki_Versys_1100_EICMA_2024.jpg/1280px-Kawasaki_Versys_1100_EICMA_2024.jpg"
    )
  },
  @{
    id = "kawasaki-versys-650"; author = "Wikimedia Commons contributors"; license = "See source"; source = "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=Kawasaki%20Versys%20650%202025"
    urls = @(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Kawasaki_Versys_650_2025.jpg/1280px-Kawasaki_Versys_650_2025.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Kawasaki_Versys_650_EICMA_2024.jpg/1280px-Kawasaki_Versys_650_EICMA_2024.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Clarkinternationalspeedway-californiasuperbikeschool-trackday-2025-Kawasaki-versys-7462.jpg/1280px-Clarkinternationalspeedway-californiasuperbikeschool-trackday-2025-Kawasaki-versys-7462.jpg"
    )
  }
)

$existingCredits = @()
if (Test-Path -LiteralPath $creditsPath) {
  $rawCredits = Get-Content -Raw -Encoding UTF8 -LiteralPath $creditsPath | ConvertFrom-Json
  $existingCredits = @(
    $rawCredits | ForEach-Object {
      if ($_.motorcycleId) { $_ }
      elseif ($_.value) { $_.value }
    }
  )
}

foreach ($set in $sets) {
  $folder = Join-Path $outputRoot $set.id
  New-Item -ItemType Directory -Force -Path $folder | Out-Null
  Write-Host "DOWNLOAD $($set.id)"
  $hasCompleteSet = (Get-ChildItem -LiteralPath $folder -File -ErrorAction SilentlyContinue).Count -ge 3

  for ($i = 0; $i -lt 3; $i++) {
    $destination = Join-Path $folder "$($i + 1).jpg"
    if (-not $hasCompleteSet) {
      $downloadUrl = $set.urls[$i] -replace '/1280px-', '/960px-'
      if ($downloadUrl -match '^https://(?:upload\.wikimedia\.org|commons\.wikimedia\.org)/') {
        $downloadUrl = "https://wsrv.nl/?url=$([uri]::EscapeDataString($downloadUrl))&w=960&output=jpg"
      }

      Invoke-WebRequest -UseBasicParsing -Uri $downloadUrl -OutFile $destination -MaximumRedirection 8 -Headers @{
        "User-Agent" = "Mozilla/5.0 MotoTime/1.0"
        "Referer" = $set.source
      }
      Start-Sleep -Milliseconds 1000
    }
  }

  $existingCredits = @($existingCredits | Where-Object { $_.motorcycleId -ne $set.id })
  for ($i = 0; $i -lt 3; $i++) {
    $existingCredits += [pscustomobject]@{
      motorcycleId = $set.id
      file = "assets/images/motos/$($set.id)/$($i + 1).jpg"
      title = "$($set.id) photo $($i + 1)"
      author = $set.author
      license = $set.license
      source = $set.source
    }
  }
}

$allIds = Get-ChildItem -LiteralPath $outputRoot -Directory | Select-Object -ExpandProperty Name
foreach ($id in $allIds) {
  if (-not ($existingCredits | Where-Object { $_.motorcycleId -eq $id })) {
    for ($i = 0; $i -lt 3; $i++) {
      $existingCredits += [pscustomobject]@{
        motorcycleId = $id
        file = "assets/images/motos/$id/$($i + 1).jpg"
        title = "$id photo $($i + 1)"
        author = "Wikimedia Commons contributors"
        license = "See source"
        source = "https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=$([uri]::EscapeDataString(($id -replace '-', ' ')))"
      }
    }
  }
}

@($existingCredits) | Sort-Object motorcycleId, file | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 -LiteralPath $creditsPath
Write-Host "Crediti aggiornati in $creditsPath"
