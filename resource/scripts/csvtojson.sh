#!/bin/bash

# 入力ファイルのパスをコマンドライン引数から取得
INPUT_FILE="$1"
echo "入力ファイル: $INPUT_FILE"

if [ -z "$INPUT_FILE" ]; then
  echo "入力ファイルのパスを指定してください。"
  exit 1
fi

# 出力ファイルのパスをコマンドライン引数から取得
OUTPUT_FILE="$2"
echo "出力ファイル: $OUTPUT_FILE"

if [ -z "$OUTPUT_FILE" ]; then
  echo "出力ファイルのパスを指定してください。"
  exit 1
fi

# カラム名を指定
COLUMNS='["scientificName","family","genus","species","familyJpn","genusJpn","characters"]'

# csvtojsonコマンドを実行して、一時的にJSONデータを取得
JSON_DATA=$(npx csvtojson --noheader=true --headers=$COLUMNS "$INPUT_FILE" 2>&1)
if [ $? -ne 0 ]; then
  echo "エラーが発生しました: $JSON_DATA"
  exit 1
fi

# JSONデータをパースしてcharactersを分割
PARSED_JSON=$(echo "$JSON_DATA" | jq --argjson columns "$COLUMNS" '
  map(
    with_entries(select(.key as $k | $columns | index($k))) |
    .characters |= split(",")
  )
')
if [ $? -ne 0 ]; then
  echo "JSONのパースエラー: $PARSED_JSON"
  exit 1
fi

# JSONデータをファイルに書き込む
echo "$PARSED_JSON" > "$OUTPUT_FILE"
if [ $? -ne 0 ]; then
  echo "ファイルへの書き込みエラー: $OUTPUT_FILE"
  exit 1
fi

echo "CSV to JSON conversion completed."