# ブランチ運用

## 通常フロー

![ブランチ運用（通常フロー）](https://user-images.githubusercontent.com/34410077/121796281-c4702300-cc52-11eb-969a-333f90d3eeea.jpg)

① develop ブランチから feature/◯◯ ブランチを切る。

② 開発を行う。手元で動作確認、静的解析、ユニットテストが通ることを確認。

③ Pull Request を作成し、レビュー依頼を行う。

③ 【CI】静的解析、ユニットテストを実行する。

③ コードレビュー完了後、レビュアーがマージを行う。

④ 【CD】ビルドを行い、TestFlight/DeployGate へアプリの配布を行う。

④ システムテストを行い、動作に問題がないことを確認する。

⑤ リリースする機能が集まった段階で release ブランチへの Pull Request を作成する。

⑤ リリースノートを記載し、リリースブランチへマージする

⑥ 【CD】ビルドを行い、AppStore Connect へのアップロード、Google Play Console へのアップロードを行う。

⑥ AppStore への申請、Google Play での公開を行う。

⑥ 受け入れテストを行い、動作に問題がないことを確認する。

⑦ main ブランチへ Pull Request を作成し、マージする。

## HotFix

![ブランチ運用（HotFix）](https://user-images.githubusercontent.com/34410077/121796293-d05be500-cc52-11eb-8a0f-9dc1b91141c6.jpg)

① main ブランチから hotfix/〇〇ブランチを切る

② 修正を行う。手元で動作確認、静的解析、ユニットテストが通ることを確認。

③ release ブランチに向けて Pull Request を作成し、レビュー依頼を行う。

③ 【CI】静的解析、ユニットテストを実行する。

③ コードレビュー完了後、レビュアーがマージを行う。

④ 【CD】ビルドを行い、AppStore Connect へのアップロード、Google Play Console へのアップロードを行う。

④ AppStore への申請、Google Play での公開を行う。

④ 受け入れテストを行い、動作に問題がないことを確認する。

⑤ main ブランチへ Pull Request を作成し、マージする。

⑥ develop ブランチへ Pull Request を作成し、マージする。コンフリクトが起きた場合は release ブランチ側を優先して取り込む。
