import os
import shutil
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np

base_dest = r'public/images/products/new'
os.makedirs(base_dest, exist_ok=True)

src_dir = r'C:\Users\Muskan\.gemini\antigravity-ide\brain\6f175527-f79d-4ccd-85ac-6c65f53ece79\.user_uploaded'

products = [
    {
        'slug': 'spooky-boo-graveyard-ghost-cream-tee',
        'src': os.path.join(src_dir, 'media_1791265960564.png'),
        'title': "Halloween 'BOO! Graveyard Phantom' Oversized Buttercream T-Shirt"
    },
    {
        'slug': 'kawaii-pink-bow-ghost-halloween-white-tee',
        'src': os.path.join(src_dir, 'media_1791265977649.png'),
        'title': "Kawaii 'Pink Bow Ghost & Leopard Pumpkins' Halloween Oversized White T-Shirt"
    },
    {
        'slug': 'mystic-haunted-mansion-harvest-moon-purple-tee',
        'src': os.path.join(src_dir, 'media_1791265996687.png'),
        'title': "Gothic 'Haunted Manor & Harvest Moon' Halloween Oversized Purple T-Shirt"
    },
    {
        'slug': 'slashers-dream-play-scream-repeat-black-tee',
        'src': os.path.join(src_dir, 'media_1791266013107.png'),
        'title': "Horror Legends 'Dream Play Scream Repeat' Oversized Black T-Shirt"
    }
]

def enhance_and_square(crop_img, bg_color, target_size=(1080, 1080), pad_factor=0.90):
    if crop_img.mode == 'RGBA':
        canvas_temp = Image.new('RGB', crop_img.size, bg_color[:3])
        canvas_temp.paste(crop_img, mask=crop_img.split()[3])
        crop_img = canvas_temp
    elif crop_img.mode != 'RGB':
        crop_img = crop_img.convert('RGB')

    w, h = crop_img.size
    max_dim = int(target_size[0] * pad_factor)
    ratio = min(max_dim / w, max_dim / h)
    new_w, new_h = int(w * ratio), int(h * ratio)

    # High-quality Lanczos resampling
    resized = crop_img.resize((new_w, new_h), Image.Resampling.LANCZOS)

    # Intelligent subtle sharpening to keep fabric weave & lettering crisp
    sharpened = resized.filter(ImageFilter.UnsharpMask(radius=1.2, percent=120, threshold=1))

    # Balanced contrast
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

    im = Image.open(src_path)
    im_rgb = im.convert('RGB')
    arr = np.array(im_rgb)
    bg_color = tuple(arr[5, 5])

    # 1. Save original untouched whole image as whole.png AND showcase.png
    showcase_path = os.path.join(dest_dir, 'showcase.png')
    whole_path = os.path.join(dest_dir, 'whole.png')
    shutil.copy2(src_path, showcase_path)
    shutil.copy2(src_path, whole_path)
    print(f"[{slug}] Saved whole.png & showcase.png ({im.size[0]}x{im.size[1]})")

    # Detect exact shirt bounds
    diff = np.abs(arr.astype(int) - np.array(bg_color).astype(int)).max(axis=2) > 15

    # Left (front)
    y_l, x_l = np.where(diff[:, :512])
    # Right (back)
    y_r, x_r = np.where(diff[:, 512:])
    x_r += 512

    # Add 8px margin
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
    crop_f = im_rgb.crop(box_front)
    hd_front = enhance_and_square(crop_f, bg_color, target_size=(1080, 1080), pad_factor=0.90)
    front_path = os.path.join(dest_dir, 'front.png')
    hd_front.save(front_path, format='PNG', optimize=True)
    print(f"[{slug}] Saved HD front.png (1080x1080) box={box_front}")

    # 3. Extract, enhance and square back
    crop_b = im_rgb.crop(box_back)
    hd_back = enhance_and_square(crop_b, bg_color, target_size=(1080, 1080), pad_factor=0.90)
    back_path = os.path.join(dest_dir, 'back.png')
    hd_back.save(back_path, format='PNG', optimize=True)
    print(f"[{slug}] Saved HD back.png (1080x1080) box={box_back}")

def main():
    print(f"Processing {len(products)} Halloween products...")
    for p in products:
        process_product(p)
    print("\nAll 4 Halloween product assets generated successfully with front.png, back.png, whole.png, and showcase.png!")

if __name__ == '__main__':
    main()
