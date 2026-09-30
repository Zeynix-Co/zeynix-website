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
        "title": "Risk & Wealth 'Money Money' Oversized Black T-Shirt",
        "slug": "risk-rich-money-typography-tee",
        "brand": "Zeynix",
        "description": "A hard-hitting financial streetwear drop constructed on premium 240 GSM dense combed cotton in obsidian black. The front left chest features geometric cube key badges reading 'RISK / RICH'. The back is dominated by a vertical Swiss brutalist typography layout reading 'MONEY / MONEY' bisected by an authentic US $100 dollar bill slice featuring Benjamin Franklin's portrait.",
        "images": [
            "/images/products/new/risk-rich-money-typography-tee/front.png",
            "/images/products/new/risk-rich-money-typography-tee/back.png",
            "/images/products/new/risk-rich-money-typography-tee/showcase.png"
        ],
        "category": "casual",
        "actualPrice": 1899,
        "discountPrice": 549,
        "rating": 4.9,
        "totalRatings": 178,
        "productFit": "OVERSIZED FIT",
        "featured": True,
        "sizes": sizes_template
    },
    {
        "title": "Japanese Dragon & Samurai 'Red Sun Anime' Oversized Black T-Shirt",
        "slug": "japanese-dragon-samurai-red-sun-tee",
        "brand": "Zeynix",
        "description": "An epic fusion of Japanese ukiyo-e mythology and modern manga aesthetic crafted from 240 GSM ultra-heavyweight combed black cotton. The front chest is struck with a cinematic red-eyed anime ninja gaze peering through shadows. The back unfolds a panoramic traditional white Ryu dragon ascending around a blazing crimson Rising Sun above a stoic solitary samurai warrior holding his drawn katana.",
        "images": [
            "/images/products/new/japanese-dragon-samurai-red-sun-tee/front.png",
            "/images/products/new/japanese-dragon-samurai-red-sun-tee/back.png",
            "/images/products/new/japanese-dragon-samurai-red-sun-tee/showcase.png"
        ],
        "category": "casual",
        "actualPrice": 1899,
        "discountPrice": 549,
        "rating": 5.0,
        "totalRatings": 240,
        "productFit": "OVERSIZED FIT",
        "featured": True,
        "sizes": sizes_template
    },
    {
        "title": "Disney Pixar 'Rayo McQueen 95' Retro Racer Oversized White T-Shirt",
        "slug": "rayo-mcqueen-retro-racer-white-tee",
        "brand": "Zeynix",
        "description": "Nostalgic retro racing energy crafted on pure white 240 GSM organic heavyweight cotton. The front chest features the signature #95 lightning bolt emblem. The back showcases vibrant pop-art puffy lettering 'RAYO MCQUEEN' in flame orange with crossing checkered flags, Lightning McQueen's classic grin, Route 66 badge, and the gold Piston Cup trophy.",
        "images": [
            "/images/products/new/rayo-mcqueen-retro-racer-white-tee/front.png",
            "/images/products/new/rayo-mcqueen-retro-racer-white-tee/back.png",
            "/images/products/new/rayo-mcqueen-retro-racer-white-tee/showcase.png"
        ],
        "category": "casual",
        "actualPrice": 1799,
        "discountPrice": 499,
        "rating": 4.9,
        "totalRatings": 195,
        "productFit": "OVERSIZED FIT",
        "featured": True,
        "sizes": sizes_template
    },
    {
        "title": "'Trust No One - It Is Me' Geometric Red Line Oversized Black T-Shirt",
        "slug": "trust-no-one-it-is-me-tee",
        "brand": "Zeynix",
        "description": "A minimalist avant-garde silhouette built on dense 240 GSM heavyweight black cotton. The front torso displays a vertical technical bar in crisp white and crimson accent blocks reading 'IT IS ME'. The reverse reveals an interlocking geometric dagger cross formation spelling 'TRUST NO ONE' with stylized crimson angles and razor-sharp typographic symmetry.",
        "images": [
            "/images/products/new/trust-no-one-it-is-me-tee/front.png",
            "/images/products/new/trust-no-one-it-is-me-tee/back.png",
            "/images/products/new/trust-no-one-it-is-me-tee/showcase.png"
        ],
        "category": "casual",
        "actualPrice": 1799,
        "discountPrice": 499,
        "rating": 4.8,
        "totalRatings": 162,
        "productFit": "OVERSIZED FIT",
        "featured": True,
        "sizes": sizes_template
    },
    {
        "title": "Dragon Ball Super 'Son Goku SSB' Power Quote Oversized Black T-Shirt",
        "slug": "goku-ssb-power-quote-tee",
        "brand": "Zeynix",
        "description": "Unleash godly ki with this Dragon Ball Super collector's piece rendered on 240 GSM heavyweight combed cotton in deep black. The chest pocket zone displays an intricate monochrome sketch of Goku charging Super Saiyan. The back features a split graphic showing the iconic Goku quote 'Power comes in response to a need, not a desire' superimposed against his half-face in Super Saiyan Blue form with cyan azure hair and orange battle gi.",
        "images": [
            "/images/products/new/goku-ssb-power-quote-tee/front.png",
            "/images/products/new/goku-ssb-power-quote-tee/back.png",
            "/images/products/new/goku-ssb-power-quote-tee/showcase.png"
        ],
        "category": "casual",
        "actualPrice": 1899,
        "discountPrice": 549,
        "rating": 5.0,
        "totalRatings": 265,
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
