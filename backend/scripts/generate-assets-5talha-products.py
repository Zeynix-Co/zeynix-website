import os
import shutil
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np

base_dest = r'public/images/products/new'
os.makedirs(base_dest, exist_ok=True)

src_dir = r'C:\Users\Muskan\.gemini\antigravity-ide\brain\4ea0f3e5-5973-4fae-84bd-af18964efbf8\.user_uploaded'

configs = [
    {
        'slug': 'downers-at-dusk-talha-anjum-tee',
        'src': os.path.join(src_dir, 'media_1790499000478.png'),
        'front_crop': (0, 25, 512, 550),
        'back_crop': (512, 25, 1024, 550),
        'detail_crop': (525, 45, 995, 545),
        'detail_pad': 0.90,
        'angle_crop': (120, 140, 430, 520),
        'angle_pad': 0.88,
    },
    {
        'slug': 'young-stunners-gumaan-tee',
        'src': os.path.join(src_dir, 'media_1790499006851.png'),
        'front_crop': (0, 25, 512, 550),
        'back_crop': (512, 25, 1024, 550),
        'detail_crop': (515, 50, 1005, 540),
        'detail_pad': 0.92,
        'angle_crop': (160, 150, 440, 520),
        'angle_pad': 0.88,
    },
    {
        'slug': 'kaun-talha-acid-wash-tee',
        'src': os.path.join(src_dir, 'media_1790499013686.png'),
        'front_crop': (0, 25, 512, 550),
        'back_crop': (512, 25, 1024, 550),
        'detail_crop': (560, 60, 960, 540),
        'detail_pad': 0.90,
        'angle_crop': (110, 150, 450, 520),
        'angle_pad': 0.88,
    },
    {
        'slug': 'cigarettes-after-regrets-tee',
        'src': os.path.join(src_dir, 'media_1790499019747.png'),
        'front_crop': (0, 25, 512, 550),
        'back_crop': (512, 25, 1024, 550),
        'detail_crop': (575, 100, 935, 540),
        'detail_pad': 0.90,
        'angle_crop': (120, 110, 440, 520),
        'angle_pad': 0.88,
    },
    {
        'slug': 'veni-vidi-vici-gothic-monarch-tee',
        'src': os.path.join(src_dir, 'media_1790499032419.png'),
        'front_crop': (0, 25, 512, 550),
        'back_crop': (512, 25, 1024, 550),
        'detail_crop': (580, 45, 930, 540),
        'detail_pad': 0.90,
        'angle_crop': (80, 70, 450, 535),
        'angle_pad': 0.88,
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

def make_clean_macro_detail(crop_img, target_size=(1080, 1080), pad_factor=0.90):
    w, h = crop_img.size
    max_dim = int(target_size[0] * pad_factor)
    ratio = min(max_dim / w, max_dim / h)
    new_w, new_h = int(w * ratio), int(h * ratio)

    resized = crop_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    sharpened = resized.filter(ImageFilter.UnsharpMask(radius=1.3, percent=125, threshold=1))
    enhancer = ImageEnhance.Contrast(sharpened)
    enhanced = enhancer.enhance(1.03)

    arr = np.array(enhanced)
    # Ambient edge tone from outer perimeter
    edge_pixels = np.concatenate([arr[0, :], arr[-1, :], arr[:, 0], arr[:, -1]], axis=0)
    bg_color = np.median(edge_pixels, axis=0).astype(np.uint8)

    canvas = np.full((target_size[1], target_size[0], 3), bg_color, dtype=np.uint8)
    ox = (target_size[0] - new_w) // 2
    oy = (target_size[1] - new_h) // 2

    canvas[oy:oy+new_h, ox:ox+new_w] = arr

    # Replicate horizontal borders
    if ox > 0:
        for x in range(ox):
            canvas[oy:oy+new_h, x] = arr[:, 0]
        for x in range(ox + new_w, target_size[0]):
            canvas[oy:oy+new_h, x] = arr[:, -1]

    # Replicate vertical borders
    if oy > 0:
        for y in range(oy):
            canvas[y, :] = canvas[oy, :]
        for y in range(oy + new_h, target_size[1]):
            canvas[y, :] = canvas[oy + new_h - 1, :]

    return Image.fromarray(canvas)

def main():
    print("=== Generating High Definition Assets for 5 New T-Shirts ===")
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

        # 3. Macro Detail view (Back signature artwork & typography)
        d_crop = im.crop(cfg['detail_crop'])
        detail_img = make_clean_macro_detail(d_crop, target_size=(1080, 1080), pad_factor=cfg['detail_pad'])
        detail_img.save(os.path.join(dest_dir, 'detail.png'), format='PNG', quality=95)
        print(f"[{slug}] Saved HD detail.png")

        # 4. Feature Angle view (Front chest graphics & player cards)
        a_crop = im.crop(cfg['angle_crop'])
        angle_img = make_clean_macro_detail(a_crop, target_size=(1080, 1080), pad_factor=cfg['angle_pad'])
        angle_img.save(os.path.join(dest_dir, 'angle.png'), format='PNG', quality=95)
        print(f"[{slug}] Saved HD angle.png")

        # 5. Untouched Original Showcase Sheet
        showcase_path = os.path.join(dest_dir, 'showcase.png')
        shutil.copy2(cfg['src'], showcase_path)
        print(f"[{slug}] Saved untouched showcase.png")

    print("\n✅ All 5 products HD assets successfully created in public/images/products/new/!")

if __name__ == '__main__':
    main()
