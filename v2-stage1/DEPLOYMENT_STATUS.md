# V2 第一階段驗收交付

更新：2026-11-11（臺北）。僅 V2.0 第一階段獲授權；第二階段未開始。

## 已可驗收

- 驗收頁：https://haohmazu.github.io/science-literacy/v2-stage1/
- 完整 ZIP：https://haohmazu.github.io/science-literacy/v2-stage1/downloads/science-literacy-v2-stage1.zip
- 單檔 HTML：https://haohmazu.github.io/science-literacy/v2-stage1/downloads/science-literacy-v2-stage1-standalone.html
- 完整報告：https://github.com/Haohmazu/science-literacy/blob/main/v2-stage1/TEST_REPORT.md
- 來源：https://github.com/Haohmazu/science-literacy/tree/v2-stage1

以既有 GitHub Pages 的獨立 /v2-stage1/ 提供驗收，正式 V1 根目錄與其下載包不覆蓋。最新 main 應用程式發布提交 354ba94481a8fe086686484b02d6d1b794c00854，GitHub Pages 回傳 built、error.message 為 null。後續僅更新報告與重新封裝下載包。

## 實際驗證

- V2 首頁、CSS、七份 JS、ZIP、單檔 HTML、TEST_REPORT.md，共 12 個 HTTP 端點均為 200，內容與部署來源逐位元組相同。
- 線上 ZIP 下載後 testzip 完整性通過。
- V1 正式首頁 HTTP 200，與原根目錄來源相同；沒有把 V2 套用到 V1。
- HTTP 內容驗證不是瀏覽器渲染或真實互動驗證。Windows、手機及系統剪貼簿仍未測。
- 發布只是交付第一階段驗收，不是使用者已確認通過；目前停止等待修改或驗收。
