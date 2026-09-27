import os
import shutil
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np

base_dest = r'public/images/products/new'
os.makedirs(base_dest, exist_ok=True)

src_dir = r'C:\Users\Muskan\.gemini\antigravity-ide\brain\db73e999-6783-4c16-9762-a0adb1d5538c\.user_uploaded'

configs = [
    {
        'slug': 'make-money-not-hoes-tee',
        'src': os.path.join(src_dir, 'media_1790316700442.png'),
        'bg': (48, 45, 45),
        'crops': {
            'front': ((4, 38, 508, 522), 0.88),
            'back': ((514, 38, 1018, 522), 0.88),
            'angle': ((170, 160, 350, 240), 0.86),  # Gothic ZEYNIX chest logo close-up
            'detail': ((620, 160, 910, 440), 0.92), # "Make Money not hoes / CHASE YOUR DREAMS" artwork
        }
    },
    {
        'slug': 'snakes-dont-hiss-viper-tee',
        'src': os.path.join(src_dir, 'media_1790316712745.png'),
        'bg': (57, 57, 57),
        'crops': {
            'front': ((4, 38, 508, 522), 0.88),
            'back': ((514, 38, 1018, 522), 0.88),
            'angle': ((60, 80, 440, 520), 0.90),    # Coiled snake + kiss marks + cursive script
            'detail': ((580, 120, 950, 520), 0.92),  # Viper head with vertical calligraphy banners
        }
    },
    {
        'slug': 'snakes-kiss-crimson-heart-tee',
        'src': os.path.join(src_dir, 'media_1790316724656.png'),
        'bg': (57, 57, 57),
        'crops': {
            'front': ((4, 38, 508, 522), 0.88),
            'back': ((514, 38, 1018, 522), 0.88),
            'angle': ((120, 90, 420, 260), 0.86),   # Crimson kiss marks + script close-up
            'detail': ((120, 100, 430, 520), 0.92),  # Full chest + graffiti red heart combo
        }
    },
    {
        'slug': 'squirtle-kanto-wave-tee',
        'src': os.path.join(src_dir, 'media_1790316740991.png'),
        'bg': (35, 89, 105),
        'crops': {
            'front': ((4, 38, 508, 522), 0.88),
            'back': ((514, 38, 1018, 522), 0.88),
            'angle': ((270, 140, 395, 290), 0.86),  # Squirtle postage stamp
            'detail': ((580, 240, 950, 522), 0.92),  # The Great Wave off Kanagawa crashing wave
        }
    },
    {
        'slug': 'umair-come-through-music-tee',
        'src': os.path.join(src_dir, 'media_1790316751547.png'),
        'bg': (48, 45, 45),
        'crops': {
            'front': ((4, 38, 508, 522), 0.88),
            'back': ((514, 38, 1018, 522), 0.88),
            'angle': ((80, 80, 430, 520), 0.90),    # Spotify player interface & red smoke
            'detail': ((520, 80, 980, 522), 0.92),   # COME THROUGH typography + sofa photo + lyrics
        }
    }
]

def clean_annotation_from_front(im, crop_box, bg_color):
    """If the crop is front and contains the floating arrow outside the sleeve, clean it seamlessly."""
    cropped = im.crop(crop_box).convert('RGB')
    arr = np.array(cropped)
    h, w, _ = arr.shape
    arrow_zone_x = int(w * 0.75)
    arrow_zone_y = int(h * 0.40)
    zone = arr[:arrow_zone_y, arrow_zone_x:]
    
    # White mask for arrow text
    white_mask = (zone[:, :, 0] > 130) & (zone[:, :, 1] > 130) & (zone[:, :, 2] > 130)
    # Also dilate slightly with numpy roll
    dilated = white_mask.copy()
    for dx in [-2, -1, 0, 1, 2]:
        for dy in [-2, -1, 0, 1, 2]:
            dilated |= np.roll(np.roll(white_mask, dx, axis=1), dy, axis=0)
            
    zone[dilated] = bg_color[:3]
    arr[:arrow_zone_y, arrow_zone_x:] = zone
    return Image.fromarray(arr)

def enhance_and_square(crop_img, bg_color, target_size=(1080, 1080), pad_factor=0.88):
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

    # Intelligent sharpening: subtle unsharp mask
    sharpened = resized.filter(ImageFilter.UnsharpMask(radius=1.2, percent=120, threshold=1))

    # Balanced contrast
    enhancer = ImageEnhance.Contrast(sharpened)
    enhanced = enhancer.enhance(1.02)

    canvas = Image.new('RGB', target_size, bg_color[:3])
    offset_x = (target_size[0] - new_w) // 2
    offset_y = (target_size[1] - new_h) // 2
    canvas.paste(enhanced, (offset_x, offset_y))
    return canvas

def main():
    for cfg in configs:
        slug = cfg['slug']
        dest_dir = os.path.join(base_dest, slug)
        os.makedirs(dest_dir, exist_ok=True)

        # 1. Save original untouched source image as showcase.png
        im = Image.open(cfg['src'])
        showcase_path = os.path.join(dest_dir, 'showcase.png')
        if cfg['src'].lower().endswith('.png'):
            shutil.copy2(cfg['src'], showcase_path)
        else:
            im.save(showcase_path, format='PNG')
        print(f"[{slug}] Saved untouched showcase.png ({im.size[0]}x{im.size[1]})")

        # 2. Extract, enhance and save high-resolution 1080x1080 position images
        for view_name, (box, pad) in cfg['crops'].items():
            if view_name == 'front' and ('viper' in slug or 'heart' in slug):
                cropped = clean_annotation_from_front(im, box, cfg['bg'])
            else:
                cropped = im.crop(box)

            hd = enhance_and_square(cropped, cfg['bg'], target_size=(1080, 1080), pad_factor=pad)
            out_path = os.path.join(dest_dir, f'{view_name}.png')
            hd.save(out_path, format='PNG', optimize=True)
            print(f"[{slug}] Saved HD 1080x1080 {view_name}.png")

    print("\nAll 5 new product HD assets successfully generated!")

if __name__ == '__main__':
    main()
