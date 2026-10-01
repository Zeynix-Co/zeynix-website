import json

config_path = r'src/data/new-catalog-config.json'

with open(config_path, 'r', encoding='utf-8') as f:
    catalog = json.load(f)

print(f"Catalog count before: {len(catalog)}")

sizes_template = [
    {"size": "XS", "stock": 45, "inStock": True},
    {"size": "S", "stock": 90, "inStock": True},
    {"size": "M", "stock": 155, "inStock": True},
    {"size": "L", "stock": 180, "inStock": True},
    {"size": "XL", "stock": 120, "inStock": True},
    {"size": "XXL", "stock": 65, "inStock": True}
]

p_halloween = {
    "title": "Halloween 'Still Dead - Thanks For Checking' Oversized Black T-Shirt",
    "slug": "halloween-rip-still-dead-tee",
    "brand": "Zeynix",
    "description": "Dark comedy meets spooky streetwear in this Halloween special edition drop crafted on dense 240 GSM organic combed black cotton. The front chest features spooky shoulder spiderwebs, retro purple typography reading 'HAPPY HALLOWEEN', and a playful hanging spider charm. The reverse commands attention with an iconic cracked tombstone declaring 'R.I.P. STILL DEAD THANKS FOR CHECKING' crowned with a kawaii skull and an irreverent skeletal hand rising with an OK gesture.",
    "images": [
        "/images/products/new/halloween-rip-still-dead-tee/front.png",
        "/images/products/new/halloween-rip-still-dead-tee/back.png",
        "/images/products/new/halloween-rip-still-dead-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1799,
    "discountPrice": 499,
    "rating": 5.0,
    "totalRatings": 245,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": sizes_template
}

# Remove if already exists
catalog = [p for p in catalog if p.get('slug') != 'halloween-rip-still-dead-tee']

# Insert at index 0 (the first section)
catalog.insert(0, p_halloween)

with open(config_path, 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

print(f"Catalog count after: {len(catalog)}")
print(f"Index 0: {catalog[0]['slug']} ({catalog[0]['title']})")
