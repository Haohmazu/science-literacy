"""以 content.json 為唯一編輯來源，同步 file:// 可讀取的 content.js。"""
from pathlib import Path
import json
p = Path(__file__).resolve().parent.parent
content = json.loads((p / 'content.json').read_text(encoding='utf-8'))
(p / 'content.js').write_text('window.SCIENCE_CONTENT = ' + json.dumps(content, ensure_ascii=False) + ';', encoding='utf-8')
print('content.js 已依 content.json 同步；網站不需要執行期讀取 JSON。')
