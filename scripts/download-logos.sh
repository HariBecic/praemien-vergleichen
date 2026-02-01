#!/bin/bash
# Run from project root: bash scripts/download-logos.sh

BF="1idc9vLyOz1J1qurgu6"
DIR="public/logos"
mkdir -p "$DIR"

declare -A INSURERS=(
  ["helsana"]="helsana.ch"
  ["css"]="css.ch"
  ["swica"]="swica.ch"
  ["concordia"]="concordia.ch"
  ["visana"]="visana.ch"
  ["kpt"]="kpt.ch"
  ["groupemutuel"]="groupemutuel.ch"
  ["sanitas"]="sanitas.com"
  ["assura"]="assura.ch"
  ["atupri"]="atupri.ch"
  ["sympany"]="sympany.ch"
  ["oekk"]="oekk.ch"
  ["egk"]="egk.ch"
)

echo "Downloading 13 logos..."
echo ""

for name in "${!INSURERS[@]}"; do
  domain="${INSURERS[$name]}"
  url="https://cdn.brandfetch.io/${domain}/logo?c=${BF}"
  file="${DIR}/${name}.png"
  
  echo -n "${name}... "
  
  # -L follows redirects, -o saves to file, -s silent
  HTTP_CODE=$(curl -L -s -o "$file" -w "%{http_code}" "$url")
  
  if [ "$HTTP_CODE" = "200" ]; then
    SIZE=$(wc -c < "$file" | tr -d ' ')
    # Check if file is actually an image (not HTML error page)
    FILE_TYPE=$(file -b "$file" | head -1)
    echo "✓ ${SIZE} bytes (${FILE_TYPE})"
  else
    echo "✗ HTTP ${HTTP_CODE}"
    rm -f "$file"
  fi
done

echo ""
echo "Done! Check: ls -la ${DIR}/"
