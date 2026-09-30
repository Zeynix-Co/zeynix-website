import json

config_path = r'src/data/new-catalog-config.json'
with open(config_path, 'r', encoding='utf-8') as f:
    catalog = json.load(f)

new_products = [
  {
    "title": "Gothic Cathedral 'Chained Wanderer' Oversized Black T-Shirt",
    "slug": "gothic-cathedral-chained-wanderer-tee",
    "brand": "Zeynix",
    "description": "Haunting architectural gothic streetwear woven from 240 GSM pre-shrunk combed cotton in obsidian black. The front depicts an intricate cathedral trefoil stained-glass arch overlooking barren winter canopies, framed by shadowy hooded skull figures and delicate calligraphic cursive script. The back reveals a monumental dark cathedral spire facade enveloped in historical gothic manuscripts, as a hooded wanderer grasps heavy wrought-iron chains extending forward into the viewer's dimension. Relaxed drop-shoulder drape.",
    "images": [
      "/images/products/new/gothic-cathedral-chained-wanderer-tee/front.png",
      "/images/products/new/gothic-cathedral-chained-wanderer-tee/back.png",
      "/images/products/new/gothic-cathedral-chained-wanderer-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1899,
    "discountPrice": 549,
    "rating": 5.0,
    "totalRatings": 172,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": [
      { "size": "XS", "stock": 45, "inStock": True },
      { "size": "S", "stock": 90, "inStock": True },
      { "size": "M", "stock": 160, "inStock": True },
      { "size": "L", "stock": 180, "inStock": True },
      { "size": "XL", "stock": 120, "inStock": True },
      { "size": "XXL", "stock": 65, "inStock": True }
    ]
  },
  {
    "title": "Lightning McQueen 'Piston Cup 95' Racer Oversized Black T-Shirt",
    "slug": "lightning-mcqueen-piston-cup-tee",
    "brand": "Zeynix",
    "description": "High-octane motorsport pop culture tee commemorating the legendary #95. Crafted on 240 GSM premium heavy jersey cotton in pure midnight black. The front features a vibrant metallic chrome '95' encased in an electric lightning bolt with bold 'PISTON CUP' typography across the lower hem. The reverse erupts with a high-definition vintage racing poster of Lightning McQueen smiling in vibrant red, detailed CAD blueprints of the race silhouette, and the immortal motto: 'I'm more than fast, more than fast / I'M LIGHTNING!'.",
    "images": [
      "/images/products/new/lightning-mcqueen-piston-cup-tee/front.png",
      "/images/products/new/lightning-mcqueen-piston-cup-tee/back.png",
      "/images/products/new/lightning-mcqueen-piston-cup-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1799,
    "discountPrice": 499,
    "rating": 4.9,
    "totalRatings": 230,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": [
      { "size": "XS", "stock": 50, "inStock": True },
      { "size": "S", "stock": 95, "inStock": True },
      { "size": "M", "stock": 170, "inStock": True },
      { "size": "L", "stock": 190, "inStock": True },
      { "size": "XL", "stock": 125, "inStock": True },
      { "size": "XXL", "stock": 70, "inStock": True }
    ]
  },
  {
    "title": "Porsche 911 'Sally Carrera' Cyan Drift Oversized Black T-Shirt",
    "slug": "porsche-911-sally-carrera-tee",
    "brand": "Zeynix",
    "description": "Sleek automotive streetwear celebrating the timeless Radiator Springs icon. Cut from 240 GSM organic combed cotton in midnight black. The front chest is branded with a clean, understated white '911 PORSCHE' logo. The back showcases a bold electric cyan tribute: 'I'm SALLY', a 3D rendered baby-blue Porsche 911 Carrera, technical line-drawn top and profile schematics, and the classic quote: 'Don't you big city runners ever just go for a walk?'.",
    "images": [
      "/images/products/new/porsche-911-sally-carrera-tee/front.png",
      "/images/products/new/porsche-911-sally-carrera-tee/back.png",
      "/images/products/new/porsche-911-sally-carrera-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1799,
    "discountPrice": 529,
    "rating": 4.9,
    "totalRatings": 198,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": [
      { "size": "XS", "stock": 40, "inStock": True },
      { "size": "S", "stock": 85, "inStock": True },
      { "size": "M", "stock": 150, "inStock": True },
      { "size": "L", "stock": 175, "inStock": True },
      { "size": "XL", "stock": 110, "inStock": True },
      { "size": "XXL", "stock": 60, "inStock": True }
    ]
  },
  {
    "title": "GTA VI 'Vice City Outlaws' Neon Graphic Oversized Black T-Shirt",
    "slug": "gta-vi-vice-city-tee",
    "brand": "Zeynix",
    "description": "Next-gen neon streetwear honoring the most anticipated gaming cultural phenomenon. Constructed from 250 GSM deep black heavy cotton with a relaxed streetwear silhouette. The front features the iconic Rockstar Games 'R*' logo badge glowing in neon magenta. The reverse is dominated by a panoramic synthwave GTA VI title graphic framing Lucia and Jason in street bandanas beneath Florida palm silhouettes and neon sunset hues, signed off with retro 'ROCKSTAR GAMES presents' script.",
    "images": [
      "/images/products/new/gta-vi-vice-city-tee/front.png",
      "/images/products/new/gta-vi-vice-city-tee/back.png",
      "/images/products/new/gta-vi-vice-city-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1899,
    "discountPrice": 549,
    "rating": 5.0,
    "totalRatings": 310,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": [
      { "size": "XS", "stock": 55, "inStock": True },
      { "size": "S", "stock": 110, "inStock": True },
      { "size": "M", "stock": 185, "inStock": True },
      { "size": "L", "stock": 200, "inStock": True },
      { "size": "XL", "stock": 140, "inStock": True },
      { "size": "XXL", "stock": 80, "inStock": True }
    ]
  },
  {
    "title": "Transformers 'Optimus Prime' Cybertron Oversized Black T-Shirt",
    "slug": "transformers-optimus-prime-tee",
    "brand": "Zeynix",
    "description": "Cybernetic luxury streetwear paying homage to the heroic Autobot Commander. Tailored on 240 GSM heavyweight combed cotton in solid black. Front chest showcases the cobalt Autobot shield insignia and bold 'TRANSFORMERS' typography. The reverse commands respect with a monumental architectural vector portrait of Optimus Prime's battle helm in electric cobalt blue and technical steel-grey line hatching, illuminated by piercing cyan optics.",
    "images": [
      "/images/products/new/transformers-optimus-prime-tee/front.png",
      "/images/products/new/transformers-optimus-prime-tee/back.png",
      "/images/products/new/transformers-optimus-prime-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1899,
    "discountPrice": 549,
    "rating": 5.0,
    "totalRatings": 215,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": [
      { "size": "XS", "stock": 45, "inStock": True },
      { "size": "S", "stock": 90, "inStock": True },
      { "size": "M", "stock": 155, "inStock": True },
      { "size": "L", "stock": 180, "inStock": True },
      { "size": "XL", "stock": 120, "inStock": True },
      { "size": "XXL", "stock": 65, "inStock": True }
    ]
  }
]

existing_slugs = {p.get('slug'): idx for idx, p in enumerate(catalog)}
for np in new_products:
    s = np['slug']
    if s in existing_slugs:
        catalog[existing_slugs[s]] = np
        print(f"Updated existing product: {s}")
    else:
        catalog.append(np)
        print(f"Appended new product: {s}")

with open(config_path, 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

print(f"Total catalog products now: {len(catalog)}")
