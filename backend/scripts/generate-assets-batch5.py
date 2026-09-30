import os
import shutil
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np

src_dir = r"C:\Users\Muskan\.gemini\antigravity-ide\brain\27aef768-b4d2-475e-a113-8985179b05ba\.user_uploaded"
base_dest = r"c:\Users\Muskan\OneDrive\Documents\zeynix\zeynix-website\public\images\products\new"
os.makedirs(base_dest, exist_ok=True)

configs = [
    {
        "slug": "risk-rich-money-typography-tee",
        "file": "media_1790791510766.png",
        "bg": (124, 118, 118),
        "front_box": (0, 42, 512, 540),
        "back_box": (512, 42, 1024, 540),
    },
    {
        "slug": "japanese-dragon-samurai-red-sun-tee",
        "file": "media_1790791582677.png",
        "bg": (124, 118, 118),
        "front_box": (0, 42, 512, 540),
        "back_box": (512, 42, 1024, 540),
    },
    {
        "slug": "rayo-mcqueen-retro-racer-white-tee",
        "file": "media_1790791595288.png",
        "bg": (124, 118, 118),
        "front_box": (0, 40, 512, 530),
        "back_box": (512, 40, 1024, 530),
    },
    {
        "slug": "trust-no-one-it-is-me-tee",
        "file": "media_1790791619155.png",
        "bg": (124, 118, 118),
        "front_box": (0, 42, 512, 540),
        "back_box": (512, 42, 1024, 540),
    },
    {
        "slug": "goku-ssb-power-quote-tee",
        "file": "media_1790791633359.png",
        "bg": (120, 114, 114),
        "front_box": (0, 42, 512, 540),
        "back_box": (512, 42, 1024, 540),
    }
]

def enhance_and_square(crop_img, bg_color, target_size=(1080, 1080), pad_factor=0.88):
    if crop_img.mode != 'RGB':
        crop_img = crop_img.convert('RGB')

    w, h = crop_img.size
    max_dim = int(target_size[0] * pad_factor)
    ratio = min(max_dim / w, max_dim / h)
    new_w, new_h = int(w * ratio), int(h * ratio)

    # High-quality Lanczos resampling
    resized = crop_img.resize((new_w, new_h), Image.Resampling.LANCZOS)

    # Subtle unsharp mask for crystal clear lines
    sharpened = resized.filter(ImageFilter.UnsharpMask(radius=1.2, percent=120, threshold=1))

    # Balanced slight contrast punch
    enhancer = ImageEnhance.Contrast(sharpened)
    enhanced = enhancer.enhance(1.02)

    canvas = Image.new('RGB', target_size, bg_color[:3])
    offset_x = (target_size[0] - new_w) // 2
    offset_y = (target_size[1] - new_h) // 2
    canvas.paste(enhanced, (offset_x, offset_y))
    return canvas

def main():
    for item in configs:
        slug = item["slug"]
        src_path = os.path.join(src_dir, item["file"])
        dest_dir = os.path.join(base_dest, slug)
        os.makedirs(dest_dir, exist_ok=True)

        im = Image.open(src_path)

        # 1. Untouched Whole image showcase.png
        showcase_path = os.path.join(dest_dir, "showcase.png")
        shutil.copy2(src_path, showcase_path)
        print(f"[{slug}] Saved showcase.png")

        # 2. Front View 1080x1080
        front_cropped = im.crop(item["front_box"])
        front_hd = enhance_and_square(front_cropped, item["bg"], target_size=(1080, 1080), pad_factor=0.88)
        front_path = os.path.join(dest_dir, "front.png")
        front_hd.save(front_path, format="PNG", optimize=True)
        print(f"[{slug}] Saved front.png")

        # 3. Back View 1080x1080
        back_cropped = im.crop(item["back_box"])
        back_hd = enhance_and_square(back_cropped, item["bg"], target_size=(1080, 1080), pad_factor=0.88)
        back_path = os.path.join(dest_dir, "back.png")
        back_hd.save(back_path, format="PNG", optimize=True)
        print(f"[{slug}] Saved back.png")

    print("\nAll 5 new products HD assets (3 images each: front, back, showcase) created successfully!")

if __name__ == "__main__":
    main()
