# Copy YouTube Channel URLs

## 概要
このChrome拡張機能は、いま表示中のYouTubeチャンネルページにある動画サムネイルのURLを1クリックでクリップボードへコピーします。重複を除いたリストをユーザー起点で書き込み、成功・失敗の状態をポップアップで即時に通知します。

## インストール手順
1. `bun install` を実行して TypeScript、Vitest、Chrome API 型定義などの依存を導入します。
2. `bun run build` で `src/` 以下を TypeScript コンパイラ（`tsc`）で `dist/` に変換します。
3. Chrome（または Chromium 系ブラウザ）で `chrome://extensions` に移動します。
4. **デベロッパーモード** を有効化し、**パッケージ化されていない拡張機能を読み込む** をクリックします。
5. プロジェクトルートを選択し、`manifest.json`、`dist/`、`popup/` といったファイルを読み込ませます。

## 使い方
1. 動画が一覧表示される YouTube チャンネルページ（グリッド/リスト問わず）を開きます。
2. 拡張機能アイコンをクリックしてポップアップを表示します。
3. **「表示中の動画URLをコピー」** をクリックすると、ポップアップが以下を順に実行します：
   - ページがチャンネルかどうかの判定を行う。
   - 表示中の動画タイルから `watch` URL を抽出・重複削除する。
   - 改行区切りでクリップボードに書き込む（Clipboard API 経由）。
4. スクロールしてさらに動画が読み込まれたら、再度ポップアップを開いて同じアクションを実行すると追加分もコピーされます。
5. 非チャンネルページで実行すると、なぜコピーできないかを説明し、クリップボードには何も書き込みません。

## 利用ライブラリ・ツール
- **TypeScript**：コード全体を型付きで記述し、`tsc`（ES2020 ターゲット）でビルドします。
- **Chrome Extensions API**：`tabs`/`scripting`/`clipboardWrite`/`runtime` を使ってポップアップ・バックグラウンド・コンテント間の通信/クリップボード操作を行います。
- **Vitest**：`tests/unit/videoCollector.test.ts` で DOM 解析ロジックを Node 環境で検証するために利用。
- **happy-dom**：Vitest のテスト環境として DOM ツリーを擬似的に提供し、`document`/`window` を安全に使えるようにする。
- **@types/chrome**：TypeScript 上で Chrome API への型サポートを提供。

## テスト
- 単体テスト：`bun run test`（Vitest）
- ビルド：`bun run build`（TypeScript）
- リント：`bun run lint`（`tsc --noEmit`）

## 注意事項
- クリップボード書き込みはユーザーの許可が必要です。Chrome によってブロックされた場合、ポップアップに権限を付与する方法が表示されます。
- すべてのコピー処理は `chrome.runtime.sendMessage` で軽量ログを送信するので、後続のテレメトリ拡張や分析に用意できます。
