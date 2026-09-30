import os
import shutil
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np

base_dest = r'public/images/products/new'
os.makedirs(base_dest, exist_ok=True)

src_dir = r'C:\Users\Muskan\.gemini\antigravity-ide\brain\27aef768-b4d2-475e-a113-8985179b05ba\.user_uploaded'

configs = [
    {
        'slug': 'unholy-rage-cemetery-tee',
        'src': os.path.join(src_dir, 'media_1790785427781.png'),
        'front_crop': (0, 25, 512, 550),
        'back_crop': (512, 25, 1024, 550),
    },
    {
        'slug': 'marlboro-doberman-die-anyway-tee',
        'src': os.path.join(src_dir, 'media_1790785443660.png'),
        'front_crop': (0, 25, 512, 550),
        'back_crop': (512, 25, 1024, 550),
    },
    {
        'slug': 'mera-yaar-khuda-hai-tee',
        'src': os.path.join(src_dir, 'media_1790785464068.png'),
        'front_crop': (0, 25, 512, 550),
        'back_crop': (512, 25, 1024, 550),
    },
    {
        'slug': 'cutie-patola-lotus-tee',
        'src': os.path.join(src_dir, 'media_1790785502739.png'),
        'front_crop': (0, 25, 512, 550),
        'back_crop': (512, 25, 1024, 550),
    },
    {
        'slug': 'liquid-chrome-kid-buu-tee',
        'src': os.path.join(src_dir, 'media_1790785521304.png'),
        'front_crop': (0, 25, 512, 550),
        'back_crop': (512, 25, 1024, 550),
    }
]

def make_seamless_full_view(crop_img, target_size=(1080, 1080), pad_factor=0.96):
    w, h = crop_img.size
    max_dim = int(target_size[0] * pad_factor)
    ratio = min(max_dim / w, max_dim / h)
    new_w, new_h = int(w * ratio), int(h * ratio)

    resized = crop_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    sharpened = resized.filter(ImageFilter.UnsharpMask(radius=1.2, percent=120, threshold=1))
    enhancer = ImageEnhance.Contrast(sharpened)
    enhanced = enhancer.enhance(1.02)

    arr = np.array(enhanced)
    canvas = np.zeros((target_size[1], target_size[0], 3), dtype=np.uint8)
    ox = (target_size[0] - new_w) // 2
    oy = (target_size[1] - new_h) // 2

    canvas[oy:oy+new_h, ox:ox+new_w] = arr

    # Replicate horizontal borders if margin exists
    if ox > 0:
        for x in range(ox):
            canvas[oy:oy+new_h, x] = arr[:, 0]
        for x in range(ox + new_w, target_size[0]):
            canvas[oy:oy+new_h, x] = arr[:, -1]

    # Replicate vertical borders if margin exists
    if oy > 0:
        for y in range(oy):
            canvas[y, :] = canvas[oy, :]
        for y in range(oy + new_h, target_size[1]):
            canvas[y, :] = canvas[oy + new_h - 1, :]

    return Image.fromarray(canvas)

def main():
    print("=== Generating HD Assets (Front, Back, Showcase ONLY) for 5 New Products ===")
    for cfg in configs:
        slug = cfg['slug']
        dest_dir = os.path.join(base_dest, slug)
        os.makedirs(dest_dir, exist_ok=True)

        im = Image.open(cfg['src']).convert('RGB')

        # 1. Front view
        f_crop = im.crop(cfg['front_crop'])
        front_img = make_seamless_full_view(f_crop, target_size=(1080, 1080), pad_factor=0.96)
        front_img.save(os.path.join(dest_dir, 'front.png'), format='PNG', quality=95)
        print(f"[{slug}] Saved HD front.png")

        # 2. Back view
        b_crop = im.crop(cfg['back_crop'])
        back_img = make_seamless_full_view(b_crop, target_size=(1080, 1080), pad_factor=0.96)
        back_img.save(os.path.join(dest_dir, 'back.png'), format='PNG', quality=95)
        print(f"[{slug}] Saved HD back.png")

        # 3. Untouched Original Showcase Sheet (whole image)
        showcase_path = os.path.join(dest_dir, 'showcase.png')
        shutil.copy2(cfg['src'], showcase_path)
        print(f"[{slug}] Saved untouched showcase.png")

    print("\n✅ All 5 new products successfully generated with exactly 3 images each (front, back, showcase)!")

if __name__ == '__main__':
    main()
