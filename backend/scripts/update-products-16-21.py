import json

path = r'src/data/new-catalog-config.json'
with open(path, 'r', encoding='utf-8') as f:
    catalog = json.load(f)

target_slugs = [
    'veni-vidi-vici-gothic-monarch-tee',
    'cigarettes-after-regrets-tee',
    'kaun-talha-acid-wash-tee',
    'young-stunners-gumaan-tee',
    'downers-at-dusk-talha-anjum-tee',
    'umair-come-through-music-tee'
]

for p in catalog:
    if p['slug'] in target_slugs:
        slug = p['slug']
        print(slug, 'before:', len(p['images']))
        p['images'] = [
            f'/images/products/new/{slug}/front.png',
            f'/images/products/new/{slug}/back.png',
            f'/images/products/new/{slug}/showcase.png'
        ]
        print(slug, 'after:', len(p['images']), p['images'])

with open(path, 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

print('Updated catalog config successfully!')
