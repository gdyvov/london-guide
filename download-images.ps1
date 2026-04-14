# Downloads Commons thumbnails (1280px JPEG, 960px SVG raster PNG) into images/shared, images/sights, images/eats, images/transport
# Per https://w.wiki/GHai — only standard widths (e.g. 960, 1280) avoid HTTP 429.
# Run: powershell -ExecutionPolicy Bypass -File .\download-images.ps1
# Re-download all (e.g. after upgrading from 960px files): .\download-images.ps1 -Force

param([switch]$Force)

$ErrorActionPreference = "Stop"
$root = Join-Path $PSScriptRoot "images"
foreach ($sub in "shared", "sights", "eats", "transport") {
  $p = Join-Path $root $sub
  if (-not (Test-Path $p)) { New-Item -ItemType Directory -Path $p -Force | Out-Null }
}

$delaySec = 2
if ($env:WIKI_DELAY_SEC) { $delaySec = [int]$env:WIKI_DELAY_SEC }
$ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"

$items = @(
  @{ Out = "shared\thames.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/London_Thames_Sunset_panorama_-_Feb_2008.jpg/1280px-London_Thames_Sunset_panorama_-_Feb_2008.jpg" },
  @{ Out = "shared\phonebox.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Red_telephone_box%2C_St_Paul%27s_Cathedral%2C_London%2C_England%2C_GB%2C_IMG_5182_edit.jpg/1280px-Red_telephone_box%2C_St_Paul%27s_Cathedral%2C_London%2C_England%2C_GB%2C_IMG_5182_edit.jpg" },
  @{ Out = "sights\british-facade.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/British_Museum_Facade.JPG/1280px-British_Museum_Facade.JPG" },
  @{ Out = "sights\national-gallery-front.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Galer%C3%ADa_Nacional%2C_Londres%2C_Inglaterra%2C_2014-08-07%2C_DD_036.JPG/1280px-Galer%C3%ADa_Nacional%2C_Londres%2C_Inglaterra%2C_2014-08-07%2C_DD_036.JPG" },
  @{ Out = "sights\sky-garden.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/The_Sky_Garden.jpg/1280px-The_Sky_Garden.jpg" },
  @{ Out = "sights\great-court.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/British_Museum_Great_Court%2C_London%2C_UK_-_Diliff.jpg/1280px-British_Museum_Great_Court%2C_London%2C_UK_-_Diliff.jpg" },
  @{ Out = "sights\rosetta.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Rosetta_Stone.JPG/1280px-Rosetta_Stone.JPG" },
  @{ Out = "sights\wilkins.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/William_Wilkins%27s_building.JPG/1280px-William_Wilkins%27s_building.JPG" },
  @{ Out = "sights\sunflowers.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflowers_National_Gallery.jpg/1280px-Sunflowers_National_Gallery.jpg" },
  @{ Out = "sights\walkie-talkie.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Walkie-Talkie_-_Sept_2015.jpg/1280px-Walkie-Talkie_-_Sept_2015.jpg" },
  @{ Out = "sights\fenchurch-sunset.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Cmglee_London_20_Fenchurch_Street_sunset.jpg/1280px-Cmglee_London_20_Fenchurch_Street_sunset.jpg" },
  @{ Out = "sights\tate-modern.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Tate_modern.jpg/1280px-Tate_modern.jpg" },
  @{ Out = "sights\tate-turbine.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/The_Turbine_Hall%2C_Tate_Modern_-_geograph.org.uk_-_2524607.jpg/1280px-The_Turbine_Hall%2C_Tate_Modern_-_geograph.org.uk_-_2524607.jpg" },
  @{ Out = "sights\nh-facade.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Natural_History_Museum_London_South_Facade_2020_01.jpg/1280px-Natural_History_Museum_London_South_Facade_2020_01.jpg" },
  @{ Out = "sights\nh-dippy.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Dippy_the_diplodocus_in_the_HIntze_Hall_at_the_Natural_HIstory_Museum.jpg/1280px-Dippy_the_diplodocus_in_the_HIntze_Hall_at_the_Natural_HIstory_Museum.jpg" },
  @{ Out = "sights\nh-hintze.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Hintze_Hall_ceiling_and_arches_from_east_alcove.jpg/1280px-Hintze_Hall_ceiling_and_arches_from_east_alcove.jpg" },
  @{ Out = "eats\borough-market.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/London_2018_March_IMG_0663.jpg/1280px-London_2018_March_IMG_0663.jpg" },
  @{ Out = "eats\borough-cake.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Borough_Market_cake_stall%2C_London%2C_England_-_Oct_2008.jpg/1280px-Borough_Market_cake_stall%2C_London%2C_England_-_Oct_2008.jpg" },
  @{ Out = "eats\borough-veg.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/BoroughMarketVegetableStall.jpg/1280px-BoroughMarketVegetableStall.jpg" },
  @{ Out = "eats\pizza-plate.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Pizza-3007395.jpg/1280px-Pizza-3007395.jpg" },
  @{ Out = "eats\pizza-toss.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Pizza_being_tossed.jpg/1280px-Pizza_being_tossed.jpg" },
  @{ Out = "eats\latte.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Latte_and_dark_coffee.jpg/1280px-Latte_and_dark_coffee.jpg" },
  @{ Out = "eats\coffee-beans.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Coffee_beans_unroasted.jpg/1280px-Coffee_beans_unroasted.jpg" },
  @{ Out = "eats\english-breakfast.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/English_breakfast_2.jpg/1280px-English_breakfast_2.jpg" },
  @{ Out = "eats\full-english.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Full_English_Breakfast.JPG/1280px-Full_English_Breakfast.JPG" },
  @{ Out = "eats\fish-chips.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Fish_and_chips.jpg/1280px-Fish_and_chips.jpg" },
  @{ Out = "eats\falafel.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Falafel.jpg/1280px-Falafel.jpg" },
  @{ Out = "eats\chicken-curry.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Chicken_curry.jpg/1280px-Chicken_curry.jpg" },
  @{ Out = "transport\bus-hopper.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Arriva_London_bus_LT6_%28LT12_FHT%29%2C_route_38%2C_16_April_2013_%282%29.jpg/1280px-Arriva_London_bus_LT6_%28LT12_FHT%29%2C_route_38%2C_16_April_2013_%282%29.jpg" },
  @{ Out = "transport\tube-zones.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Why_London_Underground_is_nicknamed_The_Tube.jpg/1280px-Why_London_Underground_is_nicknamed_The_Tube.jpg" },
  @{ Out = "transport\oyster-card.png"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Oyster_Card_front.svg/960px-Oyster_Card_front.svg.png" },
  @{ Out = "transport\contactless-reader.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Oyster-Reader.jpg/1280px-Oyster-Reader.jpg" },
  @{ Out = "transport\river-thames-bridge.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Tower_Bridge_from_Shad_Thames.jpg/1280px-Tower_Bridge_from_Shad_Thames.jpg" },
  @{ Out = "transport\cycling-london.jpg"; Url = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Cycling_in_London.jpg/1280px-Cycling_in_London.jpg" }
)

function Save-Url {
  param([string]$Url, [string]$Path, [int]$Attempt)
  $maxAttempts = 5
  $wait = [Math]::Min(90, 15 * $Attempt)
  try {
    Invoke-WebRequest -Uri $Url -OutFile $Path -UserAgent $ua -UseBasicParsing -TimeoutSec 120
    $len = (Get-Item $Path).Length
    $head = Get-Content -Path $Path -Encoding Byte -TotalCount 4 -ErrorAction SilentlyContinue
    $isJpeg = ($head.Length -ge 3 -and $head[0] -eq 0xFF -and $head[1] -eq 0xD8)
    $isPng = ($head.Length -ge 4 -and $head[0] -eq 0x89 -and $head[1] -eq 0x50)
    if ($len -lt 2048 -or (-not $isJpeg -and -not $isPng)) {
      $raw = [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
      Remove-Item $Path -Force -ErrorAction SilentlyContinue
      if ($raw -match "429|Too many requests") {
        if ($Attempt -ge $maxAttempts) { throw "429 after $maxAttempts attempts" }
        Write-Warning "429, waiting ${wait}s..."
        Start-Sleep -Seconds $wait
        return Save-Url -Url $Url -Path $Path -Attempt ($Attempt + 1)
      }
      throw "Invalid image ($len bytes)"
    }
    Write-Host "OK $Path ($len bytes)"
    return $true
  } catch {
    $msg = $_.Exception.Message
    if ($msg -match "429" -or $msg -match "Too Many" -or $msg -match "Too many") {
      if ($Attempt -ge $maxAttempts) { throw }
      Write-Warning "429, waiting ${wait}s..."
      Start-Sleep -Seconds $wait
      return Save-Url -Url $Url -Path $Path -Attempt ($Attempt + 1)
    }
    throw
  }
}

$i = 0
foreach ($item in $items) {
  $i++
  $outPath = Join-Path $root $item.Out
  $outDir = Split-Path $outPath -Parent
  if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }
  if (-not $Force -and (Test-Path $outPath) -and (Get-Item $outPath).Length -gt 8192) {
    Write-Host "[$i/$($items.Count)] Skip (ok): $($item.Out)"
    if ($i -lt $items.Count) { Start-Sleep -Seconds $delaySec }
    continue
  }
  Write-Host "[$i/$($items.Count)] GET $($item.Out) ..."
  Save-Url -Url $item.Url -Path $outPath -Attempt 1
  if ($i -lt $items.Count) { Start-Sleep -Seconds $delaySec }
}

Write-Host "Done."
