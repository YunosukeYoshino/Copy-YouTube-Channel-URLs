# Copy YouTube Channel URLs

## 概要
このChrome拡張機能は、現在表示中のYouTubeチャンネルページから各動画のタイトルとURLを抽出し、ポップアップでチェックリストとして表示します。ユーザーが選んだ動画だけをクリップボードに書き込めるため、不要なURLを避けつつ、成功／失敗状態を即座に通知できます。

## インストール手順
1. `bun install` を実行して TypeScript、Vitest、Chrome API 型定義などの依存を導入します。
2. `bun run build` で `src/` 以下を `esbuild` でバンドルして `dist/` の単一ファイルに出力します（サービスワーカー/コンテントスクリプト向け）。
3. Chrome（または Chromium 系ブラウザ）で `chrome://extensions` に移動します。
4. **デベロッパーモード** を有効化し、**パッケージ化されていない拡張機能を読み込む** をクリックします。
5. プロジェクトルートを選択し、`manifest.json`、`dist/`、`popup/` といったファイルを読み込ませます。

## 使い方
1. 動画が一覧表示される YouTube チャンネルページ（グリッド/リスト問わず）を開きます。
2. 拡張機能アイコンをクリックし、ポップアップにタイトルとURLのチェックリストを確認します（すべて選択済み状態で表示されます）。
3. 選択を解除したい動画はチェックを外し、必要なURLだけを残した状態で **「Copy selected video URLs」** をクリックすると、選択中のURLだけが改行区切りでクリップボードに保存されます。
4. チェックリストの最上部にある「すべて選択」で全選択・全解除ができます。スクロールで追加動画が読み込まれたら再度ポップアップを開き、リストの新しい項目を調整してからコピーしてください。
5. 非チャンネルページや動画が読み込まれていない場合は、ポップアップに理由が表示され、コピー動作が無効化されます。

## 利用ライブラリ・ツール
- **TypeScript**：コード全体を型付きで記述し、`tsc`（ES2020 ターゲット）でビルドします。
- **Chrome Extensions API**：`tabs`/`scripting`/`clipboardWrite`/`runtime` を使ってポップアップ・バックグラウンド・コンテント間の通信/クリップボード操作を行います。
- **esbuild**：`src/` を単一ファイル（IIFE）にバンドルして、Service Worker やコンテントスクリプトが `import`/`export` を含まずに Chrome に読み込めるようにします。
- **Vitest**：`tests/unit/videoCollector.test.ts` で DOM 解析ロジックを Node 環境で検証するために利用。
- **happy-dom**：Vitest のテスト環境として DOM ツリーを擬似的に提供し、`document`/`window` を安全に使えるようにする。
- **@types/chrome**：TypeScript 上で Chrome API への型サポートを提供。

## テスト
- 単体テスト：`bun run test`（Vitest）
- ビルド：`bun run build`（esbuild でバンドル）
- リント：`bun run lint`（`tsc --noEmit`）

## アイコン
`src/logo.png` を拡張機能アイコンとアクションに使います。必要に応じて16/48/128ピクセルの PNG をこのパスへ上書きすると、manifest の `icons` と `action.default_icon` に反映されます。

## 注意事項
- クリップボード書き込みはユーザーの許可が必要です。Chrome によってブロックされた場合、ポップアップに権限を付与する方法が表示されます。
- すべてのコピー処理は `chrome.runtime.sendMessage` で軽量ログを送信するので、後続のテレメトリ拡張や分析に用意できます。
