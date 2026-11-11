"""V2 第一階段：產生獨立 ZIP 與單檔 HTML，不包含 V1 下載包或 Git 目錄。"""
from pathlib import Path
import re
import zipfile

project = Path(__file__).resolve().parent.parent
output = project.parent
html = (project / 'index.html').read_text(encoding='utf-8')
scripts = re.findall(r'<script defer src="([^"]+)"></script>', html)
html = re.sub(r'<script defer src="[^"]+"></script>', '', html)
html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>' + (project / 'styles.css').read_text(encoding='utf-8') + '</style>')
inline = '\n'.join('<script>\n' + (project / f).read_text(encoding='utf-8').replace('</script', '<\\/script') + '\n</script>' for f in scripts)
html = html.replace('</body>', inline + '</body>')
standalone = output / 'science-literacy-v2-stage1-standalone.html'
standalone.write_text(html, encoding='utf-8')
archive = output / 'science-literacy-v2-stage1.zip'
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as z:
    for f in sorted(project.rglob('*')):
        parts = f.relative_to(project).parts
        if f.is_file() and not set(parts) & {'node_modules', '.test-runtime', '__pycache__', '.git', 'downloads', 'v2-stage1'}:
            z.write(f, Path('science-literacy-v2-stage1') / f.relative_to(project))
    z.write(standalone, standalone.name)
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    print(f'ZIP 完整性通過，共 {len(z.namelist())} 個檔案。')
print('已產生 V2 第一階段 ZIP 與單檔 HTML；未部署。')
