import os
import shutil
from PIL import Image, ImageFilter, ImageEnhance

base_dest = r'public/images/products/new'
os.makedirs(base_dest, exist_ok=True)

src_dir = r'C:\Users\Muskan\.gemini\antigravity-ide\brain\b365597d-2bab-4d15-bdfe-39bf615aa8e9\.user_uploaded'

configs = [
    {
        'slug': 'vans-heritage-graphic-tee',
        'src': os.path.join(src_dir, 'media_1790147624110.png'),
        'bg': (60, 56, 56), # Dark grey vignette tone matching border
        'crops': {
            'front': ((86, 85, 510, 488), 0.88),
            'back': ((514, 85, 938, 488), 0.88),
            'angle': ((210, 195, 365, 300), 0.85), # Front chest Vans logo
            'detail': ((575, 180, 865, 510), 0.92), # Back Kathakali mask & sofa collage
        }
    },
    {
        'slug': 'trust-no-one-gothic-tee',
        'src': os.path.join(src_dir, 'media_1790147638178.png'),
        'bg': (124, 118, 118), # Neutral studio grey
        'crops': {
            'front': ((86, 85, 510, 488), 0.88),
            'back': ((514, 85, 938, 488), 0.88),
            'angle': ((135, 130, 360, 300), 0.85), # "Trust No One" shoulder gothic script
            'detail': ((596, 295, 845, 485), 0.92), # Gothic eye & layered script close-up
        }
    },
    {
        'slug': 'ugach-katkat-parody-tee',
        'src': os.path.join(src_dir, 'media_1790147665383.png'),
        'bg': (124, 118, 118), # Neutral studio grey
        'crops': {
            'front': ((86, 85, 510, 488), 0.88),
            'back': ((514, 85, 938, 488), 0.88),
            'angle': ((210, 225, 375, 295), 0.85), # "HAVE A BREAK, HAVE A KITKAT.." chest typography
            'detail': ((615, 195, 845, 410), 0.90), # "उगाच KatKat करू नकोस." complete graphic
        }
    },
    {
        'slug': 'confidence-cherry-graphic-tee',
        'src': os.path.join(src_dir, 'media_1790147684724.jpg'),
        'bg': (155, 115, 185), # Subtle lilac purple matching background
        'crops': {
            'front': ((0, 15, 255, 315), 0.90), # Front white tee with Hg patch
            'back': ((260, 15, 515, 315), 0.90), # Back white tee with cherry graphic
            'angle': ((535, 0, 985, 576), 0.95), # Lifestyle model wearing the t-shirt
            'detail': ((245, 305, 510, 576), 0.92), # High-res cherry ribbon artwork with text
        }
    }
]

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

    # High-quality Lanczos resampling (lossless fidelity)
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
        print(f"[{slug}] Saved 100% untouched original showcase.png ({im.size[0]}x{im.size[1]})")

        # 2. Extract, enhance and save high-resolution 1080x1080 position images
        for view_name, (box, pad) in cfg['crops'].items():
            cropped = im.crop(box)
            hd = enhance_and_square(cropped, cfg['bg'], target_size=(1080, 1080), pad_factor=pad)
            out_path = os.path.join(dest_dir, f'{view_name}.png')
            hd.save(out_path, format='PNG', optimize=True)
            print(f"[{slug}] Saved HD 1080x1080 {view_name}.png")

    print("\nAll 4 product assets successfully updated with calibrated bounds!")

if __name__ == '__main__':
    main()
