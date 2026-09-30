import json

config_path = r'src/data/new-catalog-config.json'

with open(config_path, 'r', encoding='utf-8') as f:
    catalog = json.load(f)

sizes_template = [
    {"size": "XS", "stock": 45, "inStock": True},
    {"size": "S", "stock": 90, "inStock": True},
    {"size": "M", "stock": 155, "inStock": True},
    {"size": "L", "stock": 180, "inStock": True},
    {"size": "XL", "stock": 120, "inStock": True},
    {"size": "XXL", "stock": 65, "inStock": True}
]

new_products = [
    {
        "title": "'Faaaahhh! / Confidence' Motion Typo Oversized Cream T-Shirt",
        "slug": "faaaahhh-confidence-motion-typo-tee",
        "brand": "Zeynix",
        "description": "Avant-garde streetwear tailored in a warm off-white cream 240 GSM organic heavy cotton. The front chest features the raw kinetic expression 'FAAAAHHH!' in arched distressed typography. The reverse displays an elongated spine print spelling 'CONFIDENCE' treated with horizontal glitch and motion-blur distortion.",
        "images": [
            "/images/products/new/faaaahhh-confidence-motion-typo-tee/front.png",
            "/images/products/new/faaaahhh-confidence-motion-typo-tee/back.png",
            "/images/products/new/faaaahhh-confidence-motion-typo-tee/showcase.png"
        ],
        "category": "casual",
        "actualPrice": 1799,
        "discountPrice": 499,
        "rating": 4.9,
        "totalRatings": 182,
        "productFit": "OVERSIZED FIT",
        "featured": True,
        "sizes": sizes_template
    },
    {
        "title": "Desi Street Attitude 'Humse Jalte Hain' Oversized Black T-Shirt",
        "slug": "humse-jalte-hain-attitude-tee",
        "brand": "Zeynix",
        "description": "Bold desi street attitude engineered on 240 GSM dense combed obsidian black cotton. The front features iconic Hindi typography reading 'LOG AAG SE NAHI HUMSE JALTE HAIN' in a distressed retro sunset gradient spanning sunset coral, desert cream, and burnt orange. Finished with a clean, unblemished back.",
        "images": [
            "/images/products/new/humse-jalte-hain-attitude-tee/front.png",
            "/images/products/new/humse-jalte-hain-attitude-tee/back.png",
            "/images/products/new/humse-jalte-hain-attitude-tee/showcase.png"
        ],
        "category": "casual",
        "actualPrice": 1699,
        "discountPrice": 479,
        "rating": 5.0,
        "totalRatings": 230,
        "productFit": "OVERSIZED FIT",
        "featured": True,
        "sizes": sizes_template
    },
    {
        "title": "Marvel Spider-Man 'Miles Morales Web-Slinger' Oversized Off-White T-Shirt",
        "slug": "spiderman-miles-morales-webslinger-tee",
        "brand": "Zeynix",
        "description": "Multiverse-inspired Marvel luxury streetwear constructed on 240 GSM heavyweight off-white cotton. The front chest features a dynamic minimalist line-art of Miles Morales slinging across a diagonal web thread. The back erupts with the iconic comic jagged 'SPIDER-MAN' red-shadowed title logo over a massive leaping silhouette of the wall-crawler.",
        "images": [
            "/images/products/new/spiderman-miles-morales-webslinger-tee/front.png",
            "/images/products/new/spiderman-miles-morales-webslinger-tee/back.png",
            "/images/products/new/spiderman-miles-morales-webslinger-tee/showcase.png"
        ],
        "category": "casual",
        "actualPrice": 1899,
        "discountPrice": 549,
        "rating": 5.0,
        "totalRatings": 280,
        "productFit": "OVERSIZED FIT",
        "featured": True,
        "sizes": sizes_template
    },
    {
        "title": "Marvel Spider-Man 'Peter Parker Mask Typography' Oversized Black T-Shirt",
        "slug": "spiderman-peter-parker-typography-tee",
        "brand": "Zeynix",
        "description": "An architectural typographic masterpiece on 240 GSM deep black combed cotton. Front chest carries the razor-sharp crimson spider insignia with micro-engraved mantle motto. The back features a stunning Spider-Man mask silhouette constructed entirely out of negative space typography: 'PETER PARKER / GREAT POWER / SPIDER-MAN'.",
        "images": [
            "/images/products/new/spiderman-peter-parker-typography-tee/front.png",
            "/images/products/new/spiderman-peter-parker-typography-tee/back.png",
            "/images/products/new/spiderman-peter-parker-typography-tee/showcase.png"
        ],
        "category": "casual",
        "actualPrice": 1899,
        "discountPrice": 549,
        "rating": 4.9,
        "totalRatings": 250,
        "productFit": "OVERSIZED FIT",
        "featured": True,
        "sizes": sizes_template
    },
    {
        "title": "Romantic Streetwear 'I Love My Crazy Girlfriend' Oversized White T-Shirt",
        "slug": "i-love-my-crazy-girlfriend-tee",
        "brand": "Zeynix",
        "description": "Contemporary romantic streetwear cut from 240 GSM pristine white combed cotton. The chest features four monochrome analog photobooth film snapshot moments in a neat quad grid. The back makes an unapologetic statement in classic crimson serif lettering: 'I LOVE MY CRAZY GIRLFRIEND'.",
        "images": [
            "/images/products/new/i-love-my-crazy-girlfriend-tee/front.png",
            "/images/products/new/i-love-my-crazy-girlfriend-tee/back.png",
            "/images/products/new/i-love-my-crazy-girlfriend-tee/showcase.png"
        ],
        "category": "casual",
        "actualPrice": 1799,
        "discountPrice": 499,
        "rating": 4.9,
        "totalRatings": 190,
        "productFit": "OVERSIZED FIT",
        "featured": True,
        "sizes": sizes_template
    }
]

existing_slugs = {item['slug'] for item in catalog}
added = 0
for p in new_products:
    if p['slug'] not in existing_slugs:
        catalog.append(p)
        added += 1

with open(config_path, 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

print(f"Successfully added {added} new products. Total in catalog now: {len(catalog)}")
