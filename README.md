<!-- prettier-ignore -->
<div align="center">

<img src="src/logo.png" alt="Copy YouTube Channel URLs logo" height="80" />

# Copy YouTube Channel URLs

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat-square&logo=googlechrome&logoColor=white)](https://chrome.google.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-FF6F00?style=flat-square)](https://developer.chrome.com/docs/extensions/mv3)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**YouTubeチャンネルの動画URLをワンクリックでクリップボードへ**

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Development](#development)

</div>

---

YouTubeチャンネルページに表示されている動画のURLを、選択して一括コピーできるChrome拡張機能です。動画リストの整理やシェア、外部ツールへのエクスポートに最適です。

## Features

- 🎯 **選択コピー** — チェックボックスで必要な動画だけを選んでコピー
- ⚡ **ワンクリック操作** — ポップアップから即座にクリップボードへ
- 📋 **重複排除** — 同じURLが複数回コピーされることを防止
- 🔄 **無限スクロール対応** — スクロール後も再取得して最新の動画リストを反映
- 🛡️ **Manifest V3** — 最新のChrome拡張機能仕様に準拠

## Installation

### Chrome Web Storeから

> [!NOTE]
> [リンクはこちら](https://chromewebstore.google.com/detail/copy-youtube-channel-urls/ignonockihifnaniloogifchommgijbb?hl=ja)

### 開発版をインストール

```bash
# リポジトリをクローン
git clone https://github.com/YunosukeYoshino/Copy-YouTube-Channel-URLs.git
cd Copy-YouTube-Channel-URLs

# 依存関係をインストール
bun install

# ビルド
bun run build
```

1. Chromeで `chrome://extensions` を開く
2. **デベロッパーモード** を有効化
3. **パッケージ化されていない拡張機能を読み込む** をクリック
4. クローンしたプロジェクトフォルダを選択

## Usage

1. YouTubeチャンネルの動画一覧ページを開く
2. ツールバーの拡張機能アイコンをクリック
3. コピーしたい動画をチェック（デフォルトは全選択）
4. **「Copy selected video URLs」** をクリック

> [!TIP]
> 無限スクロールで追加読み込みされた動画を取得するには、スクロール後にポップアップを再度開いてください。

### 対応ページ

- チャンネルの「動画」タブ
- チャンネルホーム（動画グリッド表示）

> [!WARNING]
> 再生リストページや検索結果など、チャンネル以外のページでは動作しません。

## Development

### Prerequisites

- [Bun](https://bun.sh/) (推奨) または Node.js 20+
- Chrome / Chromium系ブラウザ

### Commands

| Command | Description |
|---------|-------------|
| `bun install` | 依存関係のインストール |
| `bun run build` | プロダクションビルド |
| `bun run lint` | TypeScript型チェック |
| `bun run test` | ユニットテスト実行 |

### Project Structure

```
src/
├── background/       # Service Worker
├── content/          # コンテンツスクリプト（DOM解析）
├── popup/            # ポップアップUI
└── shared/           # 共通型定義・メッセージ
```

### Tech Stack

| Technology | Purpose |
|------------|---------|
| TypeScript | 型安全な開発 |
| esbuild | 高速バンドル |
| Vitest | ユニットテスト |
| Chrome Extensions API | ブラウザ連携 |

## Resources

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro)

---

