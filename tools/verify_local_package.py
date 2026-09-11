from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
source = (root / "client/src/pages/Home.tsx").read_text()
assets = root / "client/public/assets"
refs = sorted(set(re.findall(r'storage \+ "([^"]+)"', source)))
missing = [name for name in refs if not (assets / name).exists()]
if missing:
    raise SystemExit("Missing local assets:\n" + "\n".join(missing))
required = [
    root / "client/public/gtm-loader.js",
    root / "client/public/_headers",
    root / "client/index.html",
    root / "LOCAL_SETUP.md",
    root / ".env.example",
]
missing_files = [str(path) for path in required if not path.exists()]
if missing_files:
    raise SystemExit("Missing required files:\n" + "\n".join(missing_files))
print(f"Verified {len(refs)} referenced assets and {len(required)} security/setup files.")
