# hinome-app

アルバムアプリ「日の目」のクライアントサイド

# Installation

## expo

https://docs.expo.io/get-started/installation/

## simulator

### iOS

https://docs.expo.io/workflow/ios-simulator/

### Android

https://docs.expo.io/workflow/android-studio-emulator/

# Development

## Start Expo

```bash
git clone git@github.com:koyama-pbl-2021/hinome-app.git
npm install
expo start
```

## Linter

ESLint + TypeScript Plugin を利用

```bash
# scriptsでの実行
npm run lint # src以下のTSファイルの静的解析を行う
# 手動実行
./node_modules/.bin/eslint 任意のパス
```

## Code Formatter

Prettier を利用

### VSCode での Prettier の自動整形の設定

※ Auto Save は外しておくこと。

1. Extensions で「Prettier - Code formatter」をインストール

2. 「command + ,」で Setting へ

3. 「format」で検索

4. 「Format On Save」にチェックを入れる

# Author

- Yokose Terumi
- Hikimochi Rikiya
