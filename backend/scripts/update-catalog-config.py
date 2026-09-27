import json
import os

path = r'src/data/new-catalog-config.json'
with open(path, 'r', encoding='utf-8') as f:
    catalog = json.load(f)

existing_slugs = {p['slug'] for p in catalog}

new_products = [
  {
    "title": "Zeynix 'Make Money Not Hoes' Oversized Streetwear T-Shirt",
    "slug": "make-money-not-hoes-tee",
    "brand": "Zeynix",
    "description": "Heavyweight 240 GSM drop-shoulder oversized streetwear t-shirt in washed jet black. Features the signature gothic outlined ZEYNIX metal chest logo on the front, complemented on the reverse by bold psychedelic liquid typography reading 'Make Money not hoes' anchored by the high-density 'CHASE YOUR DREAMS' statement print. Tailored from 100% premium combed cotton with a structured boxy drape.",
    "images": [
      "/images/products/new/make-money-not-hoes-tee/front.png",
      "/images/products/new/make-money-not-hoes-tee/back.png",
      "/images/products/new/make-money-not-hoes-tee/detail.png",
      "/images/products/new/make-money-not-hoes-tee/angle.png",
      "/images/products/new/make-money-not-hoes-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1699,
    "discountPrice": 499,
    "rating": 4.9,
    "totalRatings": 142,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": [
      { "size": "XS", "stock": 40, "inStock": True },
      { "size": "S", "stock": 85, "inStock": True },
      { "size": "M", "stock": 145, "inStock": True },
      { "size": "L", "stock": 165, "inStock": True },
      { "size": "XL", "stock": 110, "inStock": True },
      { "size": "XXL", "stock": 60, "inStock": True }
    ]
  },
  {
    "title": "Venomous Viper 'Snakes Don't Hiss' Calligraphy Oversized Black T-Shirt",
    "slug": "snakes-dont-hiss-viper-tee",
    "brand": "Zeynix",
    "description": "Intricate dark luxury streetwear t-shirt crafted in heavyweight 240 GSM pre-shrunk combed cotton. Front features a coiled serpent wrapping along the torso, dual crimson lipstick kiss marks at the collar, and the cursive statement 'Snakes Don't Hiss Anymore... They Kiss 💋'. The back showcases an imposing photorealistic viper head flanked by elaborate iridescent gothic and neo-tribal calligraphy banners.",
    "images": [
      "/images/products/new/snakes-dont-hiss-viper-tee/front.png",
      "/images/products/new/snakes-dont-hiss-viper-tee/back.png",
      "/images/products/new/snakes-dont-hiss-viper-tee/detail.png",
      "/images/products/new/snakes-dont-hiss-viper-tee/angle.png",
      "/images/products/new/snakes-dont-hiss-viper-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1799,
    "discountPrice": 549,
    "rating": 5.0,
    "totalRatings": 165,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": [
      { "size": "XS", "stock": 35, "inStock": True },
      { "size": "S", "stock": 80, "inStock": True },
      { "size": "M", "stock": 150, "inStock": True },
      { "size": "L", "stock": 170, "inStock": True },
      { "size": "XL", "stock": 115, "inStock": True },
      { "size": "XXL", "stock": 65, "inStock": True }
    ]
  },
  {
    "title": "'Snakes Don't Hiss' Crimson Kiss & Graffiti Heart Oversized T-Shirt",
    "slug": "snakes-kiss-crimson-heart-tee",
    "brand": "Zeynix",
    "description": "Edgy romantic minimalist streetwear tee in deep pitch black. Highlights vibrant scarlet lipstick kiss imprints on the neckline paired with the handwritten script 'Snakes Don't Hiss Anymore... They Kiss 💋', accented by a bold hand-brushed crimson graffiti heart on the lower torso. Tailored with relaxed drop shoulders and heavyweight 240 GSM organic cotton.",
    "images": [
      "/images/products/new/snakes-kiss-crimson-heart-tee/front.png",
      "/images/products/new/snakes-kiss-crimson-heart-tee/back.png",
      "/images/products/new/snakes-kiss-crimson-heart-tee/detail.png",
      "/images/products/new/snakes-kiss-crimson-heart-tee/angle.png",
      "/images/products/new/snakes-kiss-crimson-heart-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1499,
    "discountPrice": 449,
    "rating": 4.8,
    "totalRatings": 119,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": [
      { "size": "XS", "stock": 50, "inStock": True },
      { "size": "S", "stock": 90, "inStock": True },
      { "size": "M", "stock": 140, "inStock": True },
      { "size": "L", "stock": 155, "inStock": True },
      { "size": "XL", "stock": 100, "inStock": True },
      { "size": "XXL", "stock": 55, "inStock": True }
    ]
  },
  {
    "title": "Squirtle & Great Wave of Kanagawa Cyan Oversized T-Shirt",
    "slug": "squirtle-kanto-wave-tee",
    "brand": "Zeynix",
    "description": "Striking aquatic cyan 240 GSM drop-shoulder streetwear t-shirt fusing Japanese ukiyo-e art with anime pop culture. Front chest displays a vintage Japanese postage stamp featuring Squirtle ('JAPAN 007') with the 8 iconic Kanto Gym Badges rendered in rich vibrant color along the bottom hem. The reverse features Hokusai's legendary 'The Great Wave off Kanagawa' surging across the lower back in deep indigo and seafoam white.",
    "images": [
      "/images/products/new/squirtle-kanto-wave-tee/front.png",
      "/images/products/new/squirtle-kanto-wave-tee/back.png",
      "/images/products/new/squirtle-kanto-wave-tee/detail.png",
      "/images/products/new/squirtle-kanto-wave-tee/angle.png",
      "/images/products/new/squirtle-kanto-wave-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1699,
    "discountPrice": 499,
    "rating": 5.0,
    "totalRatings": 198,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": [
      { "size": "XS", "stock": 45, "inStock": True },
      { "size": "S", "stock": 95, "inStock": True },
      { "size": "M", "stock": 155, "inStock": True },
      { "size": "L", "stock": 175, "inStock": True },
      { "size": "XL", "stock": 120, "inStock": True },
      { "size": "XXL", "stock": 70, "inStock": True }
    ]
  },
  {
    "title": "Umair 'Come Through' Spotify Tracklist Oversized Black T-Shirt",
    "slug": "umair-come-through-music-tee",
    "brand": "Zeynix",
    "description": "Cinematic underground hip-hop tribute tee inspired by Umair's acclaimed track 'Come Through'. The front features a moody red smoke silhouette framed within an authentic Spotify audio player interface with live visualizer bars. The back commands attention with bold curved 'COME THROUGH' crimson typography, soul-stirring lyrics 'Sab ke ghum mere ghum, mera ghum kiska hai?', vintage sofa studio photography, and Parental Advisory badge. Heavyweight 240 GSM cotton.",
    "images": [
      "/images/products/new/umair-come-through-music-tee/front.png",
      "/images/products/new/umair-come-through-music-tee/back.png",
      "/images/products/new/umair-come-through-music-tee/detail.png",
      "/images/products/new/umair-come-through-music-tee/angle.png",
      "/images/products/new/umair-come-through-music-tee/showcase.png"
    ],
    "category": "casual",
    "actualPrice": 1799,
    "discountPrice": 549,
    "rating": 4.9,
    "totalRatings": 184,
    "productFit": "OVERSIZED FIT",
    "featured": True,
    "sizes": [
      { "size": "XS", "stock": 40, "inStock": True },
      { "size": "S", "stock": 90, "inStock": True },
      { "size": "M", "stock": 150, "inStock": True },
      { "size": "L", "stock": 170, "inStock": True },
      { "size": "XL", "stock": 115, "inStock": True },
      { "size": "XXL", "stock": 65, "inStock": True }
    ]
  }
]

for np in new_products:
    slug = np['slug']
    if slug not in existing_slugs:
        catalog.append(np)
        print("Added product:", slug)
    else:
        for idx, item in enumerate(catalog):
            if item.get('slug') == slug:
                catalog[idx] = np
                print("Updated product:", slug)

with open(path, 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

print(f"Total products now in catalog: {len(catalog)}")
