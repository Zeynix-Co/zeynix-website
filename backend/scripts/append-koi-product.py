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

new_product = {
    "title": "Yin-Yang Koi 'Only Dead Fish Go With The Flow' Oversized White T-Shirt",
    "slug": "yin-yang-koi-dead-fish-tee",
    "brand": "Zeynix",
    "description": "A serene yet rebellious philosophical statement crafted on 240 GSM organic white combed cotton. The front chest features the thought-provoking proverb 'Only DEAD fish go with the flow-' in medieval calligraphy with blood-red accent lettering, complemented by an ink-wash black koi swimming upward at the lower hem. The reverse reveals a breathless circular sumi-e artwork of twin black and white Koi fish swirling in perpetual balance as a living Yin-Yang water vortex.",
    "images": [
        "/images/products/new/yin-yang-koi-dead-fish-tee/front.png",
        "/images/products/new/yin-yang-koi-dead-fish-tee/back.png",
        "/images/products/new/yin-yang-koi-dead-fish-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1899,
    "discountPrice": 549,
    "rating": 5.0,
    "totalRatings": 275,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": sizes_template
}

existing_slugs = {item['slug'] for item in catalog}
if new_product['slug'] not in existing_slugs:
    catalog.append(new_product)
    print("Added new product:", new_product['slug'])
else:
    print("Product already exists!")

with open(config_path, 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

print(f"Total products in catalog now: {len(catalog)}")
