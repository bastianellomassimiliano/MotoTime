param(
  [switch]$Force
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$dataPath = Join-Path $root "data\motorcycles.js"
$outputRoot = Join-Path $root "assets\images\motos"
$credits = [System.Collections.Generic.List[object]]::new()
$fallbackQueries = @{
  "cfmoto-800mt-sport" = "CFMoto 800MT"
  "ducati-multistrada-v2" = "Ducati Multistrada V2"
  "honda-nt1100" = "Honda NT 1100"
  "honda-africa-twin" = "Honda Africa Twin CRF1100L"
  "ktm-1390-super-adventure-s" = "KTM 1390 Super Adventure"
  "moto-guzzi-stelvio" = "Moto Guzzi Stelvio 2024"
  "triumph-tiger-sport-660" = "Triumph Tiger Sport 660"
  "voge-valico-900-dsx" = "Voge DS900X"
  "yamaha-tracer-9-gt" = "Yamaha Tracer 9"
  "yamaha-tracer-7-gt" = "Yamaha Tracer 7"
  "suzuki-v-strom-1050se" = "Suzuki V-Strom 1050"
  "suzuki-v-strom-800se" = "Suzuki V-Strom 800"
  "kawasaki-versys-1100" = "Kawasaki Versys 1100"
}

$content = Get-Content -Raw -Encoding UTF8 -LiteralPath $dataPath
$matches = [regex]::Matches(
  $content,
  'id:\s*"(?<id>[^"]+)"[\s\S]*?searchQuery:\s*"(?<query>[^"]+)"',
  [System.Text.RegularExpressions.RegexOptions]::Multiline
)

if ($matches.Count -eq 0) {
  throw "Nessuna moto trovata in data/motorcycles.js"
}

foreach ($match in $matches) {
  $id = $match.Groups["id"].Value
  $query = $match.Groups["query"].Value
  $folder = Join-Path $outputRoot $id
  New-Item -ItemType Directory -Force -Path $folder | Out-Null
  $hasCompleteSet = (Get-ChildItem -LiteralPath $folder -File -ErrorAction SilentlyContinue).Count -ge 3

  Write-Host "SEARCH $query"
  $queries = @($query)
  if ($fallbackQueries.ContainsKey($id)) {
    $queries += $fallbackQueries[$id]
  }

  $pages = @()
  foreach ($search in $queries) {
    $api = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=$([uri]::EscapeDataString($search))&gsrnamespace=6&gsrlimit=15&prop=imageinfo&iiprop=url%7Cextmetadata&iiurlwidth=1280&format=json&origin=*"
    try {
      $response = Invoke-RestMethod -Uri $api -Headers @{ "User-Agent" = "MotoTime/1.0 (family catalog; local project)" }
    } catch {
      Write-Warning "Ricerca temporaneamente non disponibile per $search"
      continue
    }
    if ($response.query.pages) {
      $pages += @($response.query.pages.PSObject.Properties.Value | Sort-Object index)
    }
    if ($pages.Count -ge 3) { break }
    Start-Sleep -Seconds 1
  }

  $selected = @(
    $pages | Where-Object {
      $_.title -match '\.jpe?g$' -and
      $_.title -notmatch '(logo|badge|engine|motor|poster|map|drawing|diagram|helmet|scooter|police)'
    } | Select-Object -First 3
  )

  if ($selected.Count -lt 3) {
    $extra = @(
      $pages | Where-Object {
        $_.title -match '\.jpe?g$' -and
        $selected.pageid -notcontains $_.pageid
      } | Select-Object -First (3 - $selected.Count)
    )
    $selected += $extra
  }

  if ($selected.Count -eq 0) {
    Write-Warning "Nessuna immagine trovata per $query"
    continue
  }

  for ($i = 0; $i -lt 3; $i++) {
    $page = $selected[$i % $selected.Count]
    $info = $page.imageinfo[0]
    $url = if ($info.thumburl) { $info.thumburl } else { $info.url }
    $destination = Join-Path $folder "$($i + 1).jpg"

    if ($Force -or -not $hasCompleteSet) {
      $downloaded = $false
      for ($attempt = 1; $attempt -le 4 -and -not $downloaded; $attempt++) {
        try {
          Invoke-WebRequest -Uri $url -OutFile $destination -Headers @{
            "User-Agent" = "MotoTime/1.0 (family catalog; local project)"
            "Referer" = "https://commons.wikimedia.org/"
          }
          $downloaded = $true
        } catch {
          if ($attempt -eq 4) {
            Write-Warning "Download fallito per $id immagine $($i + 1)"
            break
          }
          Start-Sleep -Seconds (10 * $attempt)
        }
      }
      if (-not $downloaded) { continue }
      Start-Sleep -Milliseconds 1200
    }

    $meta = $info.extmetadata
    $credits.Add([pscustomobject]@{
      motorcycleId = $id
      file = "assets/images/motos/$id/$($i + 1).jpg"
      title = ($page.title -replace '^File:', '')
      author = if ($meta.Artist.value) { ($meta.Artist.value -replace '<[^>]+>', '') } else { "Wikimedia Commons contributor" }
      license = if ($meta.LicenseShortName.value) { $meta.LicenseShortName.value } else { "See source" }
      source = $info.descriptionurl
    })
  }

  $creditsPath = Join-Path $root "data\image-credits.json"
  $credits | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 -LiteralPath $creditsPath
}

$creditsPath = Join-Path $root "data\image-credits.json"
$credits | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 -LiteralPath $creditsPath
Write-Host "Crediti salvati in $creditsPath"
