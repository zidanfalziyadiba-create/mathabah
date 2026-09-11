from pathlib import Path
import shutil

root = Path(__file__).resolve().parents[1]
source = root / "local-assets"
target = root / "client" / "public" / "assets"
target.mkdir(parents=True, exist_ok=True)

mapping = {
    "mathabah-logo-transparent.png": "mathabah-logo-transparent_2365ed67.png",
    "mathabah-architectural-texture_423c537d.webp": "mathabah-architectural-texture_423c537d_e9b373de.webp",
    "glass-facade_1281cb63.jpg": "glass-facade_1281cb63_3c523186.jpg",
    "glass-office_ff88266f.jpg": "glass-office_ff88266f_aac6aeb9.jpg",
    "staircase-detail_36a86d04.jpg": "staircase-detail_36a86d04_67116930.jpg",
    "reception_32a5bffe.jpg": "reception_32a5bffe_05c6fa3b.jpg",
    "built-in-lounge_7d8805b0.jpg": "built-in-lounge_7d8805b0_f1ed0f5e.jpg",
}
for short, hashed in mapping.items():
    src = source / short
    if not src.exists():
        raise FileNotFoundError(f"Missing local asset: {src}")
    shutil.copy2(src, target / hashed)
print(f"Prepared {len(mapping)} local assets in {target}")
