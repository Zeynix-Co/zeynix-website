import json

config_path = r'src/data/new-catalog-config.json'

with open(config_path, 'r', encoding='utf-8') as f:
    catalog = json.load(f)

print(f"Catalog length before: {len(catalog)}")

sizes_template = [
    {"size": "XS", "stock": 45, "inStock": True},
    {"size": "S", "stock": 90, "inStock": True},
    {"size": "M", "stock": 155, "inStock": True},
    {"size": "L", "stock": 180, "inStock": True},
    {"size": "XL", "stock": 120, "inStock": True},
    {"size": "XXL", "stock": 65, "inStock": True}
]

p1 = {
    "title": "Kawaii Gothic 'Spookie' Peeking Cat & Skeletons Buttercream Oversized T-Shirt",
    "slug": "spookie-peeking-cat-skeletons-tee",
    "brand": "Zeynix",
    "description": "Playful gothic aesthetics merge with Y2K streetwear in this vintage-inspired drop crafted on heavyweight 240 GSM organic cotton in subtle buttercream yellow with ornate damask jacquard swirls. The front features bubble-lettering typography reading 'SPOOKIE' in pink with deep crimson trim, a kiss mark on the shoulder, and an adorable black cat peeking from the bottom hem with vivid pink eyes. The back commands attention with a blazing flaming heart skull crest, an oversized neon pink skeletal finger-heart gesture, and joyous dancing skeletons.",
    "images": [
        "/images/products/new/spookie-peeking-cat-skeletons-tee/front.png",
        "/images/products/new/spookie-peeking-cat-skeletons-tee/back.png",
        "/images/products/new/spookie-peeking-cat-skeletons-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1799,
    "discountPrice": 499,
    "rating": 5.0,
    "totalRatings": 230,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": sizes_template
}

p2 = {
    "title": "Gothic Anatomy 'Only Live Once' Ribcage & Spine Oversized Black T-Shirt",
    "slug": "only-live-once-skeleton-ribcage-tee",
    "brand": "Zeynix",
    "description": "Raw existential dread meets architectural dark streetwear. Tailored from dense 240 GSM organic combed black cotton jersey in an oversized boxy drop-shoulder cut. The front showcases an intricately detailed medical-grade anatomical ribcage, clavicle, and spine illustration beside the unapologetic gothic text 'I'M GLAD WE ONLY LIVE ONCE I'M NOT DOING THIS SHIT AGAIN'. The reverse boasts a full monumental spine, scapula, and posterior ribcage sketch stretching across the back and arm bones across the sleeves.",
    "images": [
        "/images/products/new/only-live-once-skeleton-ribcage-tee/front.png",
        "/images/products/new/only-live-once-skeleton-ribcage-tee/back.png",
        "/images/products/new/only-live-once-skeleton-ribcage-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1899,
    "discountPrice": 549,
    "rating": 5.0,
    "totalRatings": 255,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": sizes_template
}

p3 = {
    "title": "Cyber Techwear 'Cosmic Horizon Alien' Oversized Black T-Shirt",
    "slug": "cosmic-alien-mountain-cyber-tee",
    "brand": "Zeynix",
    "description": "Futuristic dystopian streetwear cut from ultra-heavyweight 240 GSM drop-shoulder black cotton jersey. The front features a hypnotic warped liquid-marble celestial sphere, cybernetic neon-green technical spec HUDs on the sleeves with cross-stitch lacing, and a moonlit stark alpine ridge where an alien silhouette watches over the horizon. Finished with an unembellished, clean plain back for authentic minimalist streetwear poise.",
    "images": [
        "/images/products/new/cosmic-alien-mountain-cyber-tee/front.png",
        "/images/products/new/cosmic-alien-mountain-cyber-tee/back.png",
        "/images/products/new/cosmic-alien-mountain-cyber-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1899,
    "discountPrice": 549,
    "rating": 5.0,
    "totalRatings": 210,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": sizes_template
}

new_slugs = [p['slug'] for p in [p1, p2, p3]]
catalog = [p for p in catalog if p.get('slug') not in new_slugs]

# Insert prominently near the top of the catalog
# Right after halloween product at index 0
catalog.insert(1, p1)
catalog.insert(2, p2)
catalog.insert(3, p3)

with open(config_path, 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

print(f"Catalog length after: {len(catalog)}")
for idx in [0, 1, 2, 3]:
    print(f"Index {idx}: {catalog[idx]['slug']} - {catalog[idx]['title']}")
