import os
import shutil
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np

base_dest = r'public/images/products/new'
os.makedirs(base_dest, exist_ok=True)

src_dir = r'C:\Users\Muskan\.gemini\antigravity-ide\brain\f3d77fb4-4e09-4596-b878-f357b84e8f65\.user_uploaded'

products = [
    {
        'slug': 'kawaii-baoo-bear-ghost-pink-tee',
        'src': os.path.join(src_dir, 'media_1791454955549.png'),
        'title': "Kawaii 'BAOO! Bear & Peekaboo Ghost' Oversized Pink T-Shirt"
    },
    {
        'slug': 'f1-racing-lights-out-legacy-vinyl-tee',
        'src': os.path.join(src_dir, 'media_1791454964963.png'),
        'title': "F1 Racing 'Lights Out And Away - Legacy Vinyl' Oversized Buttercream T-Shirt"
    },
    {
        'slug': 'marvel-spider-gwen-multiverse-white-tee',
        'src': os.path.join(src_dir, 'media_1791454975559.png'),
        'title': "Marvel 'Spider-Gwen Into The Spider-Verse' Oversized Off-White T-Shirt"
    },
    {
        'slug': 'primitive-music-koi-fish-vinyl-tee',
        'src': os.path.join(src_dir, 'media_1791454991507.png'),
        'title': "Japanese Aesthetic 'Primitive Music - Koi Fish Vinyl' Oversized Beige T-Shirt"
    },
    {
        'slug': 'halloween-i-scream-spooky-season-black-tee',
        'src': os.path.join(src_dir, 'media_1791455000981.png'),
        'title': "Halloween 'I Scream & Spooky Season Ghost' Oversized Black T-Shirt"
    }
]

def enhance_and_square(crop_img, bg_color, target_size=(1080, 1080), pad_factor=0.90):
    if crop_img.mode != 'RGB':
        crop_img = crop_img.convert('RGB')

    w, h = crop_img.size
    max_dim = int(target_size[0] * pad_factor)
    ratio = min(max_dim / w, max_dim / h)
    new_w, new_h = int(w * ratio), int(h * ratio)

    # High quality Lanczos resampling
    resized = crop_img.resize((new_w, new_h), Image.Resampling.LANCZOS)

    # Intelligent subtle unsharp mask sharpening for crisp print & textile texture
    sharpened = resized.filter(ImageFilter.UnsharpMask(radius=1.2, percent=120, threshold=1))

    # Balanced slight contrast enhancement
    enhancer = ImageEnhance.Contrast(sharpened)
    enhanced = enhancer.enhance(1.02)

    canvas = Image.new('RGB', target_size, bg_color[:3])
    offset_x = (target_size[0] - new_w) // 2
    offset_y = (target_size[1] - new_h) // 2
    canvas.paste(enhanced, (offset_x, offset_y))
    return canvas

def process_product(item):
    slug = item['slug']
    src_path = item['src']
    dest_dir = os.path.join(base_dest, slug)
    os.makedirs(dest_dir, exist_ok=True)

    im = Image.open(src_path).convert('RGB')
    arr = np.array(im)
    bg_color = tuple(arr[5, 5])

    # 1. Save original whole image as whole.png and showcase.png
    showcase_path = os.path.join(dest_dir, 'showcase.png')
    whole_path = os.path.join(dest_dir, 'whole.png')
    shutil.copy2(src_path, showcase_path)
    shutil.copy2(src_path, whole_path)
    print(f"[{slug}] Saved whole.png & showcase.png ({im.size[0]}x{im.size[1]})")

    # Detect exact shirt bounds using difference threshold
    diff = np.abs(arr.astype(int) - np.array(bg_color).astype(int)).max(axis=2) > 10

    # Left half: front shirt
    y_l, x_l = np.where(diff[:, :512])
    # Right half: back shirt
    y_r, x_r = np.where(diff[:, 512:])
    x_r += 512

    margin = 8
    box_front = (
        max(0, int(x_l.min()) - margin),
        max(0, int(y_l.min()) - margin),
        min(512, int(x_l.max()) + margin),
        min(576, int(y_l.max()) + margin)
    )

    box_back = (
        max(512, int(x_r.min()) - margin),
        max(0, int(y_r.min()) - margin),
        min(1024, int(x_r.max()) + margin),
        min(576, int(y_r.max()) + margin)
    )

    # 2. Extract, enhance and square front
    crop_f = im.crop(box_front)
    hd_front = enhance_and_square(crop_f, bg_color, target_size=(1080, 1080), pad_factor=0.90)
    front_path = os.path.join(dest_dir, 'front.png')
    hd_front.save(front_path, format='PNG', optimize=True)
    print(f"[{slug}] Saved HD front.png (1080x1080) box={box_front}")

    # 3. Extract, enhance and square back
    crop_b = im.crop(box_back)
    hd_back = enhance_and_square(crop_b, bg_color, target_size=(1080, 1080), pad_factor=0.90)
    back_path = os.path.join(dest_dir, 'back.png')
    hd_back.save(back_path, format='PNG', optimize=True)
    print(f"[{slug}] Saved HD back.png (1080x1080) box={box_back}")

def main():
    print(f"Generating high quality HD assets for {len(products)} products...")
    for p in products:
        process_product(p)
    print("\nAll 5 products assets generated successfully with front.png, back.png, whole.png, and showcase.png!")

if __name__ == '__main__':
    main()
