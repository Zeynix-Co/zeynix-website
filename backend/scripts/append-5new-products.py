import json

config_path = r'src/data/new-catalog-config.json'
with open(config_path, 'r', encoding='utf-8') as f:
    catalog = json.load(f)

new_products = [
  {
    "title": "Gothic 'Unholy Rage' Cemetery Grave Oversized Black T-Shirt",
    "slug": "unholy-rage-cemetery-tee",
    "brand": "Zeynix",
    "description": "Raw gothic rebellion meets heavyweight streetwear luxury. Crafted from premium 240 GSM pre-shrunk combed cotton in deep midnight black with an architectural drop-shoulder cut. The front chest features the piercing minimalist statement 'THE UNHOLY AMOUNT OF RAGE I'VE SWALLOWED TO REMAIN KIND COULD'VE BURIED YOU'. The reverse commands attention with a striking worm's-eye perspective looking out from a subterranean grave at towering silhouettes looking down, crowned by a defiant raised middle-finger typography monument reading 'FUCK YOU'. Finished with reinforced ribbed neckline and double-needle hem.",
    "images": [
      "/images/products/new/unholy-rage-cemetery-tee/front.png",
      "/images/products/new/unholy-rage-cemetery-tee/back.png",
      "/images/products/new/unholy-rage-cemetery-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1899,
    "discountPrice": 549,
    "rating": 5.0,
    "totalRatings": 188,
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
    "title": "'You're Going To Die Anyway' Doberman Red & White Oversized T-Shirt",
    "slug": "marlboro-doberman-die-anyway-tee",
    "brand": "Zeynix",
    "description": "Avant-garde streetwear bootleg paying homage to classic counterculture aesthetics. Built from heavyweight 240 GSM organic combed cotton with a striking split color-block construction in vibrant scarlet red and optic white. Front showcases iconic blackletter serif lettering, the existential motto 'You're Going To Die Anyway', and Michelangelo's 'Creation of Adam' fingers passing a lit cigarette with delicate smoke swirls. The back features a formidable guardian Doberman with glowing red eyes, heavy chrome link collar, and a protective red talisman tag set against a red chevron silhouette.",
    "images": [
      "/images/products/new/marlboro-doberman-die-anyway-tee/front.png",
      "/images/products/new/marlboro-doberman-die-anyway-tee/back.png",
      "/images/products/new/marlboro-doberman-die-anyway-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1799,
    "discountPrice": 529,
    "rating": 4.9,
    "totalRatings": 165,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": [
      { "size": "XS", "stock": 40, "inStock": True },
      { "size": "S", "stock": 85, "inStock": True },
      { "size": "M", "stock": 150, "inStock": True },
      { "size": "L", "stock": 170, "inStock": True },
      { "size": "XL", "stock": 115, "inStock": True },
      { "size": "XXL", "stock": 60, "inStock": True }
    ]
  },
  {
    "title": "'Mera Yaar Khuda Hai' The Art Of Not Explaining Oversized Black T-Shirt",
    "slug": "mera-yaar-khuda-hai-tee",
    "brand": "Zeynix",
    "description": "Poetic devotion meets contemporary dark romanticism. Tailored from premium 240 GSM midnight black jersey cotton with an oversized boxy silhouette. The front showcases atmospheric gothic script 'THE ART OF NOT EXPLAINING' above a dreamy high-contrast monochrome chalk silhouette of two lovers embracing. The back features timeless devotional poetry 'Mai Mandir Kyu jawaan? Mera Yaar Khuda Hai' in sunset saffron and pure white, paired with a classical renaissance-style oil artwork capturing timeless romance and devotion. A profound tribute to transcendent love and art.",
    "images": [
      "/images/products/new/mera-yaar-khuda-hai-tee/front.png",
      "/images/products/new/mera-yaar-khuda-hai-tee/back.png",
      "/images/products/new/mera-yaar-khuda-hai-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1899,
    "discountPrice": 549,
    "rating": 5.0,
    "totalRatings": 204,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": [
      { "size": "XS", "stock": 50, "inStock": True },
      { "size": "S", "stock": 95, "inStock": True },
      { "size": "M", "stock": 165, "inStock": True },
      { "size": "L", "stock": 185, "inStock": True },
      { "size": "XL", "stock": 125, "inStock": True },
      { "size": "XXL", "stock": 70, "inStock": True }
    ]
  },
  {
    "title": "Desi Pop 'Cutie Patola' Lotus Buttercream Yellow Oversized T-Shirt",
    "slug": "cutie-patola-lotus-tee",
    "brand": "Zeynix",
    "description": "Vibrant Desi pop culture and summer aesthetics combined. Made from 230 GSM ultra-soft combed cotton in a warm pastel buttercream yellow. Front features energetic dual-tone typography with neon pink bubble lettering 'CUTIE' alongside deep maroon Devanagari Hindi 'पटोला' (Patola), anchored by lush watercolor lotus blossoms blooming along the hem. The reverse features a retro-modern cartoon illustration of an empowered Desi fashion icon framed by an arch of floating red hearts. Light, breathable, and effortlessly stylish.",
    "images": [
      "/images/products/new/cutie-patola-lotus-tee/front.png",
      "/images/products/new/cutie-patola-lotus-tee/back.png",
      "/images/products/new/cutie-patola-lotus-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1599,
    "discountPrice": 479,
    "rating": 4.8,
    "totalRatings": 142,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": [
      { "size": "XS", "stock": 45, "inStock": True },
      { "size": "S", "stock": 80, "inStock": True },
      { "size": "M", "stock": 140, "inStock": True },
      { "size": "L", "stock": 155, "inStock": True },
      { "size": "XL", "stock": 100, "inStock": True },
      { "size": "XXL", "stock": 50, "inStock": True }
    ]
  },
  {
    "title": "Liquid Chrome 'Kid Buu' Y2K Metallic Oversized Black T-Shirt",
    "slug": "liquid-chrome-kid-buu-tee",
    "brand": "Zeynix",
    "description": "Futuristic Y2K cyber-anime aesthetics pushed to the highest standard. Crafted from heavyweight 250 GSM deep obsidian combed cotton with an exaggerated drop-shoulder drape. Kept purely minimalist on the front for understated luxury wear. The back erupts with a hyper-detailed 3D liquid chrome sculpture of iconic villain Kid Buu, rendered in reflective molten mercury with high-gloss specularity and sinister glowing crimson eyes. Built to stand out on the street with unmatched visual impact.",
    "images": [
      "/images/products/new/liquid-chrome-kid-buu-tee/front.png",
      "/images/products/new/liquid-chrome-kid-buu-tee/back.png",
      "/images/products/new/liquid-chrome-kid-buu-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1999,
    "discountPrice": 599,
    "rating": 5.0,
    "totalRatings": 225,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": [
      { "size": "XS", "stock": 50, "inStock": True },
      { "size": "S", "stock": 100, "inStock": True },
      { "size": "M", "stock": 175, "inStock": True },
      { "size": "L", "stock": 190, "inStock": True },
      { "size": "XL", "stock": 130, "inStock": True },
      { "size": "XXL", "stock": 75, "inStock": True }
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
