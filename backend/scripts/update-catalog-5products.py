import json
import os

config_path = r'src/data/new-catalog-config.json'
with open(config_path, 'r', encoding='utf-8') as f:
    catalog = json.load(f)

new_products = [
  {
    "title": "Talha Anjum x Umair 'Downers At Dusk' Oversized Black T-Shirt",
    "slug": "downers-at-dusk-talha-anjum-tee",
    "brand": "Zeynix",
    "description": "Heavyweight 240 GSM drop-shoulder oversized streetwear t-shirt in midnight onyx black, inspired by Talha Anjum's iconic hip-hop masterpiece 'Downers At Dusk' produced by Umair from the landmark 'Open Letter' album. The front features an Apple Music audio player interface with live playback controls, alongside poignant Urdu poetry: 'par hum thehere kalakaar, khoj me bhi gungunate rahe...' with 'kalakaar' rendered in vivid crimson red. The reverse showcases the monumental distressed curved typography 'DOWNERS AT DUSK', the philosophical hook 'Alag hi hain Agar manzile to kyu Na alag hi rakhe hum Raastein?', an atmospheric seaside twilight portrait of Talha Anjum seated in an antique leather armchair with a typewriter, and an official Parental Advisory Explicit Content badge.",
    "images": [
      "/images/products/new/downers-at-dusk-talha-anjum-tee/front.png",
      "/images/products/new/downers-at-dusk-talha-anjum-tee/back.png",
      "/images/products/new/downers-at-dusk-talha-anjum-tee/detail.png",
      "/images/products/new/downers-at-dusk-talha-anjum-tee/angle.png",
      "/images/products/new/downers-at-dusk-talha-anjum-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1899,
    "discountPrice": 549,
    "rating": 5.0,
    "totalRatings": 214,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": [
      { "size": "XS", "stock": 45, "inStock": True },
      { "size": "S", "stock": 95, "inStock": True },
      { "size": "M", "stock": 160, "inStock": True },
      { "size": "L", "stock": 180, "inStock": True },
      { "size": "XL", "stock": 125, "inStock": True },
      { "size": "XXL", "stock": 70, "inStock": True }
    ]
  },
  {
    "title": "Young Stunners 'Gumaan' Slate Blue Oversized T-Shirt",
    "slug": "young-stunners-gumaan-tee",
    "brand": "Zeynix",
    "description": "Oversized streetwear masterpiece commemorating the timeless emotional rap anthem 'Gumaan' by Young Stunners (Talha Anjum & Talhah Yunus). Crafted from premium 240 GSM pre-shrunk combed cotton in a custom dusty slate-denim blue. The front features a sleek Spotify audio player card at the chest with the soulful verse 'Bewajah hi Bewafa se Bepanaah Umeed jo lagayi thi' gracefully descending down the lower body. The back makes an unforgettable statement with curved grunge lettering 'WOH PADHTI THI KITAABEIN MAI PADHTA HU INSAAN', the coastline album art with a high-gloss vinyl LP record emerging from the sleeve, live Spotify floating lyrics ('Tu hi aag, tu he uspe padti baarish...'), and a striking monochrome cutout of Talha Anjum with his guardian Doberman.",
    "images": [
      "/images/products/new/young-stunners-gumaan-tee/front.png",
      "/images/products/new/young-stunners-gumaan-tee/back.png",
      "/images/products/new/young-stunners-gumaan-tee/detail.png",
      "/images/products/new/young-stunners-gumaan-tee/angle.png",
      "/images/products/new/young-stunners-gumaan-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1799,
    "discountPrice": 529,
    "rating": 4.9,
    "totalRatings": 192,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": [
      { "size": "XS", "stock": 40, "inStock": True },
      { "size": "S", "stock": 85, "inStock": True },
      { "size": "M", "stock": 145, "inStock": True },
      { "size": "L", "stock": 165, "inStock": True },
      { "size": "XL", "stock": 110, "inStock": True },
      { "size": "XXL", "stock": 65, "inStock": True }
    ]
  },
  {
    "title": "Talha Anjum 'Kaun Talha?' Acid Wash Oversized Streetwear T-Shirt",
    "slug": "kaun-talha-acid-wash-tee",
    "brand": "Zeynix",
    "description": "Raw underground energy meets heavyweight streetwear luxury. Inspired by the immortal DHH anthem 'Kaun Talha?' by Talha Anjum, this drop-shoulder oversized t-shirt is dyed in vintage mineral acid-wash charcoal grey on 250 GSM heavy terry cotton. Front chest features raw handwritten multi-lingual scribble calligraphy in English ('kaun talha?'), Urdu Nastaliq ('کون طلحہ'), and Devanagari Hindi ('कौन तलहा'), anchored by a quadruple crimson red stencil stack. The back boasts triple bold scarlet Hindi typography 'कौन तलहा / कौन तलहा / कौन तलहा', Talha Anjum in dark shades with his Doberman on a chain leash, iconic lyrical bars calling out the underground rap pantheon, and an explosive massive crimson 'KAUN TALHA?' wrap across the lower hem.",
    "images": [
      "/images/products/new/kaun-talha-acid-wash-tee/front.png",
      "/images/products/new/kaun-talha-acid-wash-tee/back.png",
      "/images/products/new/kaun-talha-acid-wash-tee/detail.png",
      "/images/products/new/kaun-talha-acid-wash-tee/angle.png",
      "/images/products/new/kaun-talha-acid-wash-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1899,
    "discountPrice": 599,
    "rating": 5.0,
    "totalRatings": 248,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": [
      { "size": "XS", "stock": 50, "inStock": True },
      { "size": "S", "stock": 100, "inStock": True },
      { "size": "M", "stock": 170, "inStock": True },
      { "size": "L", "stock": 190, "inStock": True },
      { "size": "XL", "stock": 130, "inStock": True },
      { "size": "XXL", "stock": 75, "inStock": True }
    ]
  },
  {
    "title": "Jevin Gill x Talha Anjum 'Cigarettes After Regrets' Oversized Black T-Shirt",
    "slug": "cigarettes-after-regrets-tee",
    "brand": "Zeynix",
    "description": "Cinematic noir oversized streetwear tee honoring the evocative collaboration 'Regrets' (Pachtaway) by Jevin Gill and Talha Anjum. Tailored from 240 GSM deep midnight black combed cotton with a relaxed drop-shoulder cut. Front chest displays the iconic crossed-out 'Ciggerates After REGRETS' typography with the reflective lyrics 'Mere yaar badal gaye the ya main badal gaya / Main gir-gir ke gir-gir ke fir sambhal gaya' rising above atmospheric fog and shimmering bronze Urdu calligraphy 'پچھتاوے'. The reverse commands the room with royal serif gold lettering 'REGRETS', the legendary six-line stanza 'TERA APNA THA JAANAM / KOI GHAIR TO NAHI / PITAA HUN SHARAABEIN / KOI ZEHER TO NAHI / NAAM NA CHALE / KOI AISA SHEHER TO NAHI', and a cinematic silhouette of Talha Anjum hooded in volumetric smoke and headlight flares.",
    "images": [
      "/images/products/new/cigarettes-after-regrets-tee/front.png",
      "/images/products/new/cigarettes-after-regrets-tee/back.png",
      "/images/products/new/cigarettes-after-regrets-tee/detail.png",
      "/images/products/new/cigarettes-after-regrets-tee/angle.png",
      "/images/products/new/cigarettes-after-regrets-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1799,
    "discountPrice": 549,
    "rating": 4.9,
    "totalRatings": 176,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": [
      { "size": "XS", "stock": 35, "inStock": True },
      { "size": "S", "stock": 80, "inStock": True },
      { "size": "M", "stock": 140, "inStock": True },
      { "size": "L", "stock": 160, "inStock": True },
      { "size": "XL", "stock": 105, "inStock": True },
      { "size": "XXL", "stock": 60, "inStock": True }
    ]
  },
  {
    "title": "Gothic Dark Monarch 'Veni Vidi Vici' Oversized White T-Shirt",
    "slug": "veni-vidi-vici-gothic-monarch-tee",
    "brand": "Zeynix",
    "description": "Dramatic monochrome dark-fantasy streetwear statement t-shirt immortalizing the legendary Latin triumph 'Veni Vidi Vici' ('I came, I saw, I conquered'). Built from 240 GSM optic pure white heavyweight cotton with a structured boxy drape. The front erupts with intricate deep-black fluid ink smoke flames swirling majestically from the bottom hem up across the torso. The reverse features an arched triple-layered gothic blackletter calligraphy halo reading 'VENI VIDI VICI' with shadowy echo gradients, crowning a faceless hooded king cloaked in dark flowing vestments, clasping an ancient broadsword hilt as shadows diffuse seamlessly into the fabric.",
    "images": [
      "/images/products/new/veni-vidi-vici-gothic-monarch-tee/front.png",
      "/images/products/new/veni-vidi-vici-gothic-monarch-tee/back.png",
      "/images/products/new/veni-vidi-vici-gothic-monarch-tee/detail.png",
      "/images/products/new/veni-vidi-vici-gothic-monarch-tee/angle.png",
      "/images/products/new/veni-vidi-vici-gothic-monarch-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1899,
    "discountPrice": 549,
    "rating": 5.0,
    "totalRatings": 162,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": [
      { "size": "XS", "stock": 45, "inStock": True },
      { "size": "S", "stock": 90, "inStock": True },
      { "size": "M", "stock": 150, "inStock": True },
      { "size": "L", "stock": 175, "inStock": True },
      { "size": "XL", "stock": 120, "inStock": True },
      { "size": "XXL", "stock": 70, "inStock": True }
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
