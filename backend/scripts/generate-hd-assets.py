import os
from PIL import Image, ImageFilter, ImageEnhance

base_dest = r'public/images/products/new'
os.makedirs(base_dest, exist_ok=True)

configs = [
    {
        'slug': 'pokemon-stamp-tee',
        'src': r'C:\Users\Muskan\.gemini\antigravity-ide\brain\438f657a-3aac-441b-81a7-689aa6fddc74\.user_uploaded\media_1788941972572.png',
        'bg': (244, 240, 230),
        'crops': {
            'front': (15, 30, 245, 268),
            'back': (275, 30, 500, 268),
            'angle': (15, 310, 245, 550),
            'detail': (765, 305, 1020, 550),
        }
    },
    {
        'slug': 'sunflower-collection-tee',
        'src': r'C:\Users\Muskan\.gemini\antigravity-ide\brain\438f657a-3aac-441b-81a7-689aa6fddc74\.user_uploaded\media_1788941979634.png',
        'bg': (220, 213, 207),
        'crops': {
            'front': (30, 78, 256, 298),
            'back': (278, 78, 506, 298),
            'angle': (30, 323, 256, 538),
            'detail': (778, 323, 1006, 538),
        }
    },
    {
        'slug': 'sins-and-virtue-tee',
        'src': r'C:\Users\Muskan\.gemini\antigravity-ide\brain\438f657a-3aac-441b-81a7-689aa6fddc74\.user_uploaded\media_1788941986258.png',
        'bg': (235, 235, 235),
        'crops': {
            'front': (18, 60, 305, 415),
            'back': (310, 60, 600, 415),
            'angle': (30, 520, 270, 910),
            'detail': (775, 485, 1015, 910),
        }
    },
    {
        'slug': 'not-today-satan-tee',
        'src': r'C:\Users\Muskan\.gemini\antigravity-ide\brain\438f657a-3aac-441b-81a7-689aa6fddc74\.user_uploaded\media_1788941993811.png',
        'bg': (238, 237, 232),
        'crops': {
            'front': (15, 50, 415, 460),
            'back': (415, 50, 645, 460),
            'angle': (10, 540, 245, 940),
            'detail': (735, 500, 1015, 960),
        }
    },
    {
        'slug': 'underdog-foundation-tee',
        'src': r'C:\Users\Muskan\.gemini\antigravity-ide\brain\438f657a-3aac-441b-81a7-689aa6fddc74\.user_uploaded\media_1788942002728.png',
        'bg': (235, 235, 237),
        'crops': {
            'front': (16, 32, 244, 268),
            'back': (266, 32, 504, 268),
            'angle': (16, 310, 244, 548),
            'detail': (756, 305, 1014, 550),
        }
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

    # Intelligent sharpening: subtle unsharp mask to restore fabric edge and graphic print crispness
    sharpened = resized.filter(ImageFilter.UnsharpMask(radius=1.3, percent=125, threshold=1))

    # Subtle contrast enhancement to maintain depth
    enhancer = ImageEnhance.Contrast(sharpened)
    enhanced = enhancer.enhance(1.03)

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
        im = Image.open(cfg['src'])

        # Save full original showcase sheet
        im.save(os.path.join(dest_dir, 'showcase.png'))
        print(f"[{slug}] Saved full showcase.png ({im.size[0]}x{im.size[1]})")

        # Crop, enhance and save high-res 1080x1080 versions for each view
        for view_name, box in cfg['crops'].items():
            cropped = im.crop(box)
            pad = 0.94 if view_name == 'detail' else 0.88
            hd = enhance_and_square(cropped, cfg['bg'], target_size=(1080, 1080), pad_factor=pad)
            out_path = os.path.join(dest_dir, f'{view_name}.png')
            hd.save(out_path, format='PNG', optimize=True)
            print(f"[{slug}] Saved HD 1080x1080 {view_name}.png")

    print("\nAll product HD assets successfully generated!")

if __name__ == '__main__':
    main()
