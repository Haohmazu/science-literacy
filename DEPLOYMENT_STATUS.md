# GitHub Pages 部署狀態

更新：2026-11-11（臺北）。使用者已明確授權公開儲存庫及 GitHub Pages 發布。

## 已完成

- 使用者已建立公開儲存庫：https://github.com/Haohmazu/science-literacy 。
- 已確認 admin／push 權限，初始儲存庫為空；未覆蓋其他網站。
- 網站、文件、測試及 downloads/ 已推送 main；首筆提交 b6a5039。
- 可從 GitHub Code → Download ZIP 取得全部檔案，或直接下載 downloads/ 中的專案 ZIP 與單檔 HTML。

## 尚未完成：啟用 Pages

POST /repos/Haohmazu/science-literacy/pages 回傳 HTTP 403 Resource not accessible by integration。管理／推送權限不代表連線權杖具有 Pages 設定權限。沒有宣稱網站已上線；不是使用者未授權，也不是自動審核拒絕。

請使用者開啟 https://github.com/Haohmazu/science-literacy/settings/pages ，在 Build and deployment 選 Deploy from a branch，分支 main、資料夾 /(root)，按 Save。啟用後才會開始 Pages 建置，網址應以 GitHub 回傳及實際 HTTP 檢查結果確認。使用者完成後可繼續驗證，無須重新詢問發布同意。

## 驗證範圍

五份 JS 語法及 315 項主要 DOM 斷言已重新通過；另有單檔 6 項既有斷言。真實瀏覽器、Windows 與 GitHub Pages 線上驗證尚未完成。發布或可下載不等同產品正式驗收通過。
