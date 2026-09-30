import os
import shutil
from PIL import Image, ImageFilter, ImageEnhance

src = r"C:\Users\Muskan\.gemini\antigravity-ide\brain\27aef768-b4d2-475e-a113-8985179b05ba\.user_uploaded\media_1790793878399.png"
dest_dir = r"c:\Users\Muskan\OneDrive\Documents\zeynix\zeynix-website\public\images\products\new\yin-yang-koi-dead-fish-tee"
os.makedirs(dest_dir, exist_ok=True)

bg_color = (53, 137, 161)
front_box = (0, 42, 512, 540)
back_box = (512, 42, 1024, 540)

def enhance_and_square(crop_img, bg_color, target_size=(1080, 1080), pad_factor=0.88):
    if crop_img.mode != 'RGB':
        crop_img = crop_img.convert('RGB')

    w, h = crop_img.size
    max_dim = int(target_size[0] * pad_factor)
    ratio = min(max_dim / w, max_dim / h)
    new_w, new_h = int(w * ratio), int(h * ratio)

    resized = crop_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    sharpened = resized.filter(ImageFilter.UnsharpMask(radius=1.2, percent=120, threshold=1))
    enhancer = ImageEnhance.Contrast(sharpened)
    enhanced = enhancer.enhance(1.02)

    canvas = Image.new('RGB', target_size, bg_color[:3])
    offset_x = (target_size[0] - new_w) // 2
    offset_y = (target_size[1] - new_h) // 2
    canvas.paste(enhanced, (offset_x, offset_y))
    return canvas

def main():
    im = Image.open(src)

    # 1. Untouched Whole image showcase.png
    showcase_path = os.path.join(dest_dir, "showcase.png")
    shutil.copy2(src, showcase_path)
    print("Saved showcase.png")

    # 2. Front View 1080x1080
    front_cropped = im.crop(front_box)
    front_hd = enhance_and_square(front_cropped, bg_color, target_size=(1080, 1080), pad_factor=0.88)
    front_path = os.path.join(dest_dir, "front.png")
    front_hd.save(front_path, format="PNG", optimize=True)
    print("Saved front.png")

    # 3. Back View 1080x1080
    back_cropped = im.crop(back_box)
    back_hd = enhance_and_square(back_cropped, bg_color, target_size=(1080, 1080), pad_factor=0.88)
    back_path = os.path.join(dest_dir, "back.png")
    back_hd.save(back_path, format="PNG", optimize=True)
    print("Saved back.png")

if __name__ == "__main__":
    main()
