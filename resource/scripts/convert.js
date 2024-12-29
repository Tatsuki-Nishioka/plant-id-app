// prerequisite: npm install -g csvtojson
// HOW TO USE: node convert.js input.csv

const { exec } = require('child_process');
const fs = require('fs');
// const path = require('path');

// コマンドライン引数から入力ファイルのパスを取得
const inputFilePath = process.argv[2];

if (!inputFilePath) {
  console.error('入力ファイルのパスを指定してください。');
  process.exit(1);
}

// 出力ファイルのパスを決定（入力ファイル名に基づいて）
const outputFilePath = 'master.json';
// const outputFilePath = path.basename(inputFilePath, path.extname(inputFilePath)) + '.json';

// csvtojsonコマンドを実行して、一時的にJSONデータを取得
exec(`csvtojson ${inputFilePath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`エラーが発生しました: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`標準エラー出力: ${stderr}`);
    return;
  }

  // JSONデータをパース
  let jsonObj;
  try {
    jsonObj = JSON.parse(stdout);
  } catch (parseError) {
    console.error(`JSONのパースエラー: ${parseError.message}`);
    return;
  }

  // 文字列として扱うためにcharactersを分割
  jsonObj.forEach((item) => {
    if (item.characters) {
      item.characters = item.characters.split(',').map((char) => char.trim());
    }
  });

  // 変換後のJSONデータを書き込み
  fs.writeFileSync(outputFilePath, JSON.stringify(jsonObj, null, 2));
  console.log(`CSVファイルをJSON形式に変換しました: ${outputFilePath}`);
});