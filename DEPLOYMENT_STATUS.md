# GitHub Pages 部署狀態

更新：2026-11-11（臺北）。

**部署已完成，HTTP 驗證通過。**

- 網站：https://haohmazu.github.io/science-literacy/
- 儲存庫：https://github.com/Haohmazu/science-literacy
- Pages 來源：main 分支、/(root)，build_type legacy。
- GitHub 回傳狀態 built，建置錯誤為 null。
- 本次驗證的應用程式提交：140d94a63849e681f957ee51c48b50e438ff4ab2。
- 首頁、styles.css、content.js、app.js、stage2.js、studio.js、learning.js、ZIP 與單檔 HTML 共九個 HTTP 端點皆為 200，內容與部署原始檔逐位元組一致。ZIP 亦通過完整性檢查。

## 取得成果

- 完整專案：https://haohmazu.github.io/science-literacy/downloads/science-literacy-v1.0-review.zip
- 單檔 HTML：https://haohmazu.github.io/science-literacy/downloads/science-literacy-standalone.html
- 網站頁尾亦提供兩個下載連結；下載 ZIP 解壓後開啟 science-literacy/index.html。

## 授權與驗證限制

使用者明確授權公開建立儲存庫及發布，並自行完成建庫、Pages 分支設定，先前 403 阻礙已解除。

五份 JS 語法與 315 項主要 DOM 斷言已重跑通過，另有單檔六項既有測試。本次新增驗證為 GitHub Pages 建置狀態及 HTTP 資源內容，不是實際瀏覽器互動、Windows 或手機渲染測試。那些限制仍保留。

網站已公開可供驗收；發布不代表使用者已正式接受 V1.0。未開始任何新版本擴充。
