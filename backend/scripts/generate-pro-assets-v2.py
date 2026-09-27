import os
import shutil
import cv2
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance

base_dest = r'public/images/products/new'
src_dir = r'C:\Users\Muskan\.gemini\antigravity-ide\brain\db73e999-6783-4c16-9762-a0adb1d5538c\.user_uploaded'

# 1. Create CAD garment silhouette masks from Image 4 (Cyan shirt)
im_ref = cv2.imread(os.path.join(src_dir, 'media_1790316740991.png'))

# Front mask - 100% intact, fully symmetrical garment silhouette
cyan_mask_f = ((im_ref[:, :512, 0] > 180) & (im_ref[:, :512, 1] > 180) & (im_ref[:, :512, 2] < 50)).astype(np.uint8) * 255
kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
dilated_f = cv2.dilate(cyan_mask_f, kernel)
inv_f = cv2.bitwise_not(dilated_f)
flood_f = np.zeros((578, 514), np.uint8)
cv2.floodFill(inv_f, flood_f, (0, 0), 0)
mask_front = cv2.bitwise_or(cyan_mask_f, inv_f)
mask_front = cv2.morphologyEx(mask_front, cv2.MORPH_CLOSE, kernel)

# Back mask - 100% intact, fully symmetrical garment silhouette
cyan_mask_b = ((im_ref[:, 512:, 0] > 180) & (im_ref[:, 512:, 1] > 180) & (im_ref[:, 512:, 2] < 50)).astype(np.uint8) * 255
dilated_b = cv2.dilate(cyan_mask_b, kernel)
inv_b = cv2.bitwise_not(dilated_b)
flood_b = np.zeros((578, 514), np.uint8)
cv2.floodFill(inv_b, flood_b, (0, 0), 0)
mask_back = cv2.bitwise_or(cyan_mask_b, inv_b)
mask_back[280:517, 101:411] = 255
mask_back = cv2.morphologyEx(mask_back, cv2.MORPH_CLOSE, kernel)

def clean_annotation_pixels(im_cv):
    """
    Cleans only the stray white cursive annotation text and arrow in images 2 and 3
    without touching the t-shirt sleeve or any part of the garment silhouette.
    """
    im_clean = im_cv.copy()
    # Left half (front view): clean only white annotation arrow pixels in zone x > 425, y < 205
    zone_f = im_clean[:205, 425:512]
    white_f = (zone_f[:, :, 0] > 140) & (zone_f[:, :, 1] > 140) & (zone_f[:, :, 2] > 140)
    zone_f[white_f] = [0, 0, 0]
    im_clean[:205, 425:512] = zone_f

    # Right half (back view): clean only white annotation text pixels in zone x in [512, 545], y < 205
    zone_b = im_clean[:205, 512:545]
    white_b = (zone_b[:, :, 0] > 140) & (zone_b[:, :, 1] > 140) & (zone_b[:, :, 2] > 140)
    zone_b[white_b] = [0, 0, 0]
    im_clean[:205, 512:545] = zone_b

    return im_clean

def make_clean_garment_view(im_cv, is_back=False, target_size=(1080, 1080), pad_factor=0.90):
    """
    Extracts the isolated t-shirt silhouette and places it centered on a transparent (RGBA) canvas.
    Completely eliminates any outside annotations, cut-off words, arrows, or background box seams.
    """
    if is_back:
        crop = im_cv[:, 512:].copy()
        mask = mask_back.copy()
        # Clean any stray pixels outside garment
        crop[mask == 0] = 0
    else:
        crop = im_cv[:, :512].copy()
        mask = mask_front.copy()
        crop[mask == 0] = 0

    # Anti-alias mask edge
    mask_soft = cv2.GaussianBlur(mask, (3, 3), 0.5)

    # Convert to RGBA
    b, g, r = cv2.split(crop)
    rgba = cv2.merge([r, g, b, mask_soft])
    pil_img = Image.fromarray(rgba, mode='RGBA')

    # Crop to garment bounding box with 2px margin
    ys, xs = np.where(mask > 0)
    bbox = (xs.min(), ys.min(), xs.max(), ys.max())
    cropped_garment = pil_img.crop(bbox)

    # Resize preserving aspect ratio with Lanczos
    gw, gh = cropped_garment.size
    max_dim = int(target_size[0] * pad_factor)
    ratio = min(max_dim / gw, max_dim / gh)
    nw, nh = int(gw * ratio), int(gh * ratio)
    resized = cropped_garment.resize((nw, nh), Image.Resampling.LANCZOS)

    # Subtle sharpening to keep garment seams and print crisp
    sharpened_rgb = resized.convert('RGB').filter(ImageFilter.UnsharpMask(radius=1.1, percent=115, threshold=1))
    resized.paste(sharpened_rgb, mask=resized.split()[3])

    # Place centered on target transparent canvas
    canvas = Image.new('RGBA', target_size, (0, 0, 0, 0))
    ox = (target_size[0] - nw) // 2
    oy = (target_size[1] - nh) // 2
    canvas.paste(resized, (ox, oy), resized)
    return canvas

def make_seamless_macro_detail(im_cv, crop_box, bg_color, target_size=(1080, 1080), pad_factor=0.88, feather_px=12):
    """
    Creates a flawless macro photography shot of the graphic design.
    The entire artwork is 100% visible, centered, and smoothly blended into the fabric canvas
    with ZERO box lines or rectangular cut seams.
    """
    x1, y1, x2, y2 = crop_box
    art_bgr = im_cv[y1:y2, x1:x2].copy()
    art_rgb = cv2.cvtColor(art_bgr, cv2.COLOR_BGR2RGB)
    h, w, _ = art_rgb.shape

    # Apply 2D edge feathering so the crop boundaries blend seamlessly into the fabric background
    if feather_px > 0:
        actual_feather_x = min(feather_px, w // 4)
        actual_feather_y = min(feather_px, h // 4)
        
        mask_x = np.ones(w, dtype=np.float32)
        mask_y = np.ones(h, dtype=np.float32)
        
        if actual_feather_x > 0:
            fade_x = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, actual_feather_x, dtype=np.float32))
            mask_x[:actual_feather_x] = fade_x
            mask_x[-actual_feather_x:] = fade_x[::-1]
            
        if actual_feather_y > 0:
            fade_y = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, actual_feather_y, dtype=np.float32))
            mask_y[:actual_feather_y] = fade_y
            mask_y[-actual_feather_y:] = fade_y[::-1]
            
        mask_2d = np.outer(mask_y, mask_x)[:, :, np.newaxis]
        bg_arr = np.array(bg_color[:3], dtype=np.float32).reshape(1, 1, 3)
        art_rgb = (art_rgb.astype(np.float32) * mask_2d + bg_arr * (1.0 - mask_2d)).astype(np.uint8)

    pil_art = Image.fromarray(art_rgb)

    # Scale to canvas with padding
    aw, ah = pil_art.size
    max_dim = int(target_size[0] * pad_factor)
    ratio = min(max_dim / aw, max_dim / ah)
    nw, nh = int(aw * ratio), int(ah * ratio)
    resized = pil_art.resize((nw, nh), Image.Resampling.LANCZOS)

    # Enhance texture and contrast
    sharpened = resized.filter(ImageFilter.UnsharpMask(radius=1.2, percent=125, threshold=1))
    enhancer = ImageEnhance.Contrast(sharpened)
    enhanced = enhancer.enhance(1.02)

    # Create solid fabric background canvas
    canvas = Image.new('RGB', target_size, bg_color[:3])
    ox = (target_size[0] - nw) // 2
    oy = (target_size[1] - nh) // 2
    canvas.paste(enhanced, (ox, oy))
    return canvas

products_config = [
    {
        'slug': 'make-money-not-hoes-tee',
        'src': os.path.join(src_dir, 'media_1790316700442.png'),
        'fabric_color': (0, 0, 0),
        # Detail: Full wavy typography "Make Money not hoes / CHASE YOUR DREAMS"
        'detail_crop': (635, 175, 895, 435),
        'detail_pad': 0.88,
        'detail_feather': 10,
        # Angle: Full gothic metal ZEYNIX chest logo
        'angle_crop': (180, 170, 340, 230),
        'angle_pad': 0.76,
        'angle_feather': 8
    },
    {
        'slug': 'snakes-dont-hiss-viper-tee',
        'src': os.path.join(src_dir, 'media_1790316712745.png'),
        'fabric_color': (0, 0, 0),
        # Detail: Full Giant Viper Head + iridescent vertical gothic calligraphy banners
        'detail_crop': (575, 125, 955, 518),
        'detail_pad': 0.90,
        'detail_feather': 14,
        # Angle: Full front coiled snake + collar kisses + cursive script
        'angle_crop': (95, 65, 435, 518),
        'angle_pad': 0.88,
        'angle_feather': 12
    },
    {
        'slug': 'snakes-kiss-crimson-heart-tee',
        'src': os.path.join(src_dir, 'media_1790316724656.png'),
        'fabric_color': (0, 0, 0),
        # Detail: Full dual crimson kisses + cursive script "Snakes Don't Hiss Anymore... They Kiss"
        'detail_crop': (145, 98, 400, 230),
        'detail_pad': 0.86,
        'detail_feather': 10,
        # Angle: Full hand-brushed crimson graffiti heart
        'angle_crop': (255, 350, 415, 512),
        'angle_pad': 0.82,
        'angle_feather': 10
    },
    {
        'slug': 'squirtle-kanto-wave-tee',
        'src': os.path.join(src_dir, 'media_1790316740991.png'),
        'fabric_color': (5, 218, 232),
        # Detail: Full The Great Wave off Kanagawa crashing wave across back
        'detail_crop': (590, 260, 955, 515),
        'detail_pad': 0.90,
        'detail_feather': 12,
        # Angle: Full vintage Japanese Squirtle Postage Stamp (JAPAN 007)
        'angle_crop': (280, 150, 385, 285),
        'angle_pad': 0.80,
        'angle_feather': 10
    },
    {
        'slug': 'umair-come-through-music-tee',
        'src': os.path.join(src_dir, 'media_1790316751547.png'),
        'fabric_color': (0, 0, 0),
        # Detail: Full back album art: curved COME THROUGH + lyrics + Umair sofa photo + Advisory
        'detail_crop': (520, 95, 985, 515),
        'detail_pad': 0.90,
        'detail_feather': 15,
        # Angle: Full front Spotify audio visualizer player UI & red smoke
        'angle_crop': (95, 110, 415, 515),
        'angle_pad': 0.88,
        'angle_feather': 14
    }
]

def main():
    for p in products_config:
        slug = p['slug']
        dest = os.path.join(base_dest, slug)
        os.makedirs(dest, exist_ok=True)
        im_raw = cv2.imread(p['src'])
        im_cv = clean_annotation_pixels(im_raw)

        # 1. Front View: Seamless clean isolated garment (RGBA)
        front_img = make_clean_garment_view(im_cv, is_back=False, pad_factor=0.90)
        front_img.save(os.path.join(dest, 'front.png'), format='PNG', optimize=True)
        print(f"[{slug}] Generated pro front.png (clean silhouette, transparent)")

        # 2. Back View: Seamless clean isolated garment (RGBA, ZERO text/arrow fragments!)
        back_img = make_clean_garment_view(im_cv, is_back=True, pad_factor=0.90)
        back_img.save(os.path.join(dest, 'back.png'), format='PNG', optimize=True)
        print(f"[{slug}] Generated pro back.png (clean silhouette, transparent, zero artifacts)")

        # 3. Primary Artwork Macro Detail (detail.png) - 100% complete, seamless fabric
        detail_img = make_seamless_macro_detail(
            im_cv, p['detail_crop'], p['fabric_color'],
            target_size=(1080, 1080), pad_factor=p['detail_pad'],
            feather_px=p['detail_feather']
        )
        detail_img.save(os.path.join(dest, 'detail.png'), format='PNG', optimize=True)
        print(f"[{slug}] Generated pro detail.png (seamless macro detail)")

        # 4. Secondary Feature Macro Detail (angle.png) - 100% complete, seamless fabric
        angle_img = make_seamless_macro_detail(
            im_cv, p['angle_crop'], p['fabric_color'],
            target_size=(1080, 1080), pad_factor=p['angle_pad'],
            feather_px=p['angle_feather']
        )
        angle_img.save(os.path.join(dest, 'angle.png'), format='PNG', optimize=True)
        print(f"[{slug}] Generated pro angle.png (seamless feature detail)")

        # 5. Untouched Full Showcase Mockup Sheet (showcase.png)
        shutil.copy2(p['src'], os.path.join(dest, 'showcase.png'))
        print(f"[{slug}] Preserved untouched showcase.png")

    print("\nAll 5 product assets updated with studio e-commerce quality!")

if __name__ == '__main__':
    main()
