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
    "title": "Gothic Demon 'INSANITY' Crimson Oversized T-Shirt",
    "slug": "insanity-demon-crimson-tee",
    "brand": "Zeynix",
    "description": "An audacious masterpiece of dark luxury streetwear cut from heavyweight 240 GSM organic crimson red combed cotton. The front commands attention with arched distressed 'INSANITY' flame typography above an intricate, hyper-detailed demonic entity bust and baroque tribal filigree flourishes. Features an unembellished, clean plain back for refined minimalist streetwear balance.",
    "images": [
        "/images/products/new/insanity-demon-crimson-tee/front.png",
        "/images/products/new/insanity-demon-crimson-tee/back.png",
        "/images/products/new/insanity-demon-crimson-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1899,
    "discountPrice": 549,
    "rating": 5.0,
    "totalRatings": 215,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": sizes_template
}

p2 = {
    "title": "Acid Wash 'Her New Guy' Coiled Viper Oversized Black T-Shirt",
    "slug": "her-new-guy-viper-acid-wash-tee",
    "brand": "Zeynix",
    "description": "Heavyweight vintage streetwear cut from 240 GSM dense mineral-washed charcoal black cotton jersey. The front features the unapologetic statement 'Her New Guy WAS Never New, You Just never KNEW...' interwoven with a lifelike albino coiled pit viper with crimson red eyes and the signature Zeynix emblem. Finished with a clean, unblemished plain back and relaxed drop-shoulder silhouette.",
    "images": [
        "/images/products/new/her-new-guy-viper-acid-wash-tee/front.png",
        "/images/products/new/her-new-guy-viper-acid-wash-tee/back.png",
        "/images/products/new/her-new-guy-viper-acid-wash-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1899,
    "discountPrice": 549,
    "rating": 5.0,
    "totalRatings": 240,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": sizes_template
}

# Filter out if already present
catalog = [p for p in catalog if p.get('slug') not in ['insanity-demon-crimson-tee', 'her-new-guy-viper-acid-wash-tee']]
print(f"Catalog length without them: {len(catalog)}")

# Insert right in the middle (index 20 out of 40)
insert_index = 20
catalog.insert(insert_index, p1)
catalog.insert(insert_index + 1, p2)

with open(config_path, 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

print(f"Catalog length after: {len(catalog)}")
print(f"Item 20: {catalog[20]['slug']} ({catalog[20]['title']})")
print(f"Item 21: {catalog[21]['slug']} ({catalog[21]['title']})")
