# process-images.py — turn the reviewed fal renders into shippable, labelled site media.
#
#   python3 -I tools/process-images.py
#
# Reads private/gen-raw/ (raw renders, request ids, prompts; git-ignored) and writes:
#   src/assets/img/gen/<id>-<w>.webp     responsive WebP, IPTC DigitalSourceType = trainedAlgorithmicMedia in XMP
#   src/assets/img/gen/liberty.svg       the Recraft vector, its C2PA content-credentials manifest kept
#   src/assets/video/<id>.mp4 + poster   ffmpeg H.264, no audio, faststart (desktop-only loops)
#   src/content/images.json              id -> files, size, alt (describes the pixels, says "AI illustration"),
#                                        provenance (model, request id, prompt) for every generated asset
import json, os, shutil, subprocess, sys
from PIL import Image, ImageFilter
import math
import numpy as np
import cv2

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
RAW = os.path.join(ROOT, 'private/gen-raw')
OUT = os.path.join(ROOT, 'src/assets/img/gen'); os.makedirs(OUT, exist_ok=True)
VOUT = os.path.join(ROOT, 'src/assets/video'); os.makedirs(VOUT, exist_ok=True)
FF = os.environ.get('FFMPEG') or '/private/tmp/claude-501/-Users-carlcelino-OSOFT/b81bd7fa-5824-44fc-a518-2091ef9139ac/scratchpad/pylib/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v9.0'

def xmp(desc, src='trainedAlgorithmicMedia'):
    d = desc.replace('&', '&amp;').replace('<', '&lt;')
    return ('<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">'
            '<rdf:Description rdf:about="" xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" xmlns:dc="http://purl.org/dc/elements/1.1/">'
            f'<Iptc4xmpExt:DigitalSourceType>http://cv.iptc.org/newscodes/digitalsourcetype/{src}</Iptc4xmpExt:DigitalSourceType>'
            f'<dc:description><rdf:Alt><rdf:li xml:lang="x-default">{d}</rdf:li></rdf:Alt></dc:description>'
            '</rdf:Description></rdf:RDF></x:xmpmeta><?xpacket end="w"?>').encode('utf-8')

def rec(job):
    p = os.path.join(RAW, job + '.result.json')
    return json.load(open(p)) if os.path.exists(p) else {}

def prov(job, *more):
    r = rec(job)
    chain = [{'job': job, 'endpoint': r.get('endpoint'), 'request_id': r.get('request_id'), 'prompt': (r.get('input') or {}).get('prompt')}]
    for m in more:
        rr = rec(m)
        chain.append({'job': m, 'endpoint': rr.get('endpoint'), 'request_id': rr.get('request_id'), 'prompt': (rr.get('input') or {}).get('prompt')})
    return chain

manifest = {'note': 'Every asset in this file was generated with AI (fal). Only hero-golden(-tall) and hero-night(-tall) depict the real building (123 E Willow St): golden hour re-imagined from a Street View frame used as an architectural reference only, and night relit from that golden-hour image. None of them shows the real interior, staff, customers or products. Real photos should replace the place images before launch.', 'images': {}, 'videos': {}}

def save_set(img_id, im, widths, alt, provenance, quality=78, alpha=False, kind='generated'):
    files = []
    w0, h0 = im.size
    for w in widths:
        if w > w0: w = w0
        h = round(h0 * w / w0)
        r = im.resize((w, h), Image.LANCZOS) if w != w0 else im
        fn = f'{img_id}-{w}.webp'
        kw = dict(quality=quality, method=6)
        try:
            r.save(os.path.join(OUT, fn), 'WEBP', xmp=xmp(alt, 'algorithmicallyEnhanced' if kind == 'enhanced' else 'trainedAlgorithmicMedia'), **kw)
        except TypeError:
            r.save(os.path.join(OUT, fn), 'WEBP', **kw)
        files.append({'w': w, 'h': h, 'file': 'assets/img/gen/' + fn, 'bytes': os.path.getsize(os.path.join(OUT, fn))})
        if w == w0: break
    manifest['images'][img_id] = {'w': w0, 'h': h0, 'ratio': round(w0 / h0, 4), 'alt': alt, 'ai': kind, 'files': files, 'alpha': alpha, 'provenance': provenance}
    print(img_id, w0, h0, [f['w'] for f in files], sum(f['bytes'] for f in files) // 1024, 'KB')

def load(job, ext='jpg'):
    for e in (ext, 'png', 'jpg'):
        p = os.path.join(RAW, f'{job}-0.{e}')
        if os.path.exists(p): return Image.open(p).convert('RGB')
    raise FileNotFoundError(job)

# --- photographic stills ---------------------------------------------------------------------------
P = [
  ('storefront', 'storefront-b-clean', ['storefront-b'], [1280, 1920, 2560], 'AI illustration: a red-brick building at night, its tall arched shop windows glowing warm over a wet, empty street'),
  ('interior', 'interior-a-clean', ['interior-a'], [1280, 1920, 2560], 'AI illustration: a bright gallery-like shop with white walls, exposed red brick, light oak counters and lit glass display cases'),
  ('macro-a', 'macro-a', [], [960, 1600, 2400], 'AI illustration: extreme close-up of a cannabis flower covered in glistening trichomes, with orange pistils, on black'),
  ('macro-b', 'macro-b', [], [960, 1600, 2400], 'AI illustration: a cured cannabis bud frosted with trichomes, some turning amber, lit in warm gold against black'),
  ('macro-c', 'macro-c', [], [800, 1400, 2048], 'AI illustration: trichome heads up close, like tiny clear and amber crystals, against a dark background'),
  ('macro-v', 'macro-v', [], [760, 1200, 1536], 'AI illustration: the frosted tip of a cannabis flower with orange pistils, lit from above on black'),
  ('magnifier', 'magnifier', [], [960, 1600, 2400], 'AI illustration: a brass magnifying glass on a light oak counter beside a cannabis bud, under a warm spotlight'),
  ('oak-jars', 'oak-jars', [], [960, 1600, 2400], 'AI illustration: clear glass jars of cannabis flower lined up along a light oak counter under warm gallery light'),
  ('plinth', 'plinth', [], [1280, 1920, 2560], 'AI illustration: an empty white gallery plinth under a single warm spotlight against an old red-brick wall'),
  ('brick', 'brick-detail', [], [800, 1200, 1664], 'AI illustration: a black cast-iron column against weathered red brick at blue hour, warm window light at the edge'),
  ('blockparty', 'blockparty-b', [], [1280, 1920, 2560], 'AI illustration: string lights zigzag over a red-brick street at dusk, a boombox and a crate of records waiting on a folding table'),
  ('merch-mood', 'merch-mood', [], [800, 1200, 1792], 'AI illustration: a plain black cap and a folded black t-shirt on a light oak bench in a white gallery room'),
]
for img_id, job, extra, widths, alt in P:
    im = load(job)
    save_set(img_id, im, widths, alt, prov(job, *extra))

# phone crop of the night storefront, centred on the arched windows (portrait 9:16)
im = load('storefront-b-clean')
W, H = im.size
cw = round(H * 9 / 16); cx = int(W * 0.63)
x0 = max(0, min(W - cw, cx - cw // 2))
save_set('storefront-tall', im.crop((x0, 0, x0 + cw, H)), [756], 'AI illustration: a red-brick building at night, its tall arched shop windows glowing warm over a wet street', prov('storefront-b-clean', 'storefront-b'))

# --- golden-hour storefront (home hero) ----------------------------------------------------------------
# A NEW AI photograph of the building at 123 E Willow St (fal nano-banana-pro, job hero-golden-b). The owner's
# Street View frame was passed only as an architectural reference; it lives in private/ref/ and never ships.
# Local clean-ups below (OpenCV, no generator): a garbled door number, a sign on the corner pier (replaced by
# the same pier's next brick course), letter marks inside a blank stone panel, a paper notice behind the fence.
HERO_ALT = ('AI illustration of the red-brick building at 123 E Willow St at golden hour: arched windows, twin '
            'gables and a small cupola, the ground-floor shop windows glowing warm over an empty street')

def regrain(a, y0, y1, x0, x1, seed):
    """Put film grain back on a cleaned patch, matched to the grain measured in a ring around it."""
    g = cv2.GaussianBlur(a.astype(np.float32), (0, 0), 1.2)
    hf = a.astype(np.float32) - g
    ring = np.zeros(a.shape[:2], bool)
    ring[max(0, y0 - 24):y1 + 24, max(0, x0 - 24):x1 + 24] = True
    ring[y0:y1, x0:x1] = False
    sd = float(hf[ring].std())
    rng = np.random.default_rng(seed)
    n = rng.normal(0, sd, (y1 - y0, x1 - x0, 1)).astype(np.float32)
    patch = a[y0:y1, x0:x1].astype(np.float32) + n
    a[y0:y1, x0:x1] = np.clip(patch, 0, 255).astype(np.uint8)

def clean_hero(im):
    a = np.asarray(im).copy()
    # 1) invented door number on the lit transom glass: inpaint (smooth glass), then grain
    m = np.zeros(a.shape[:2], np.uint8); m[2372:2412, 3462:3527] = 255
    a = cv2.inpaint(a, m, 7, cv2.INPAINT_TELEA); regrain(a, 2372, 2412, 3462, 3527, 1)
    # 2) invented sign on the corner pier: copy the pier's next brick course (same columns, dy rows below),
    #    dy chosen by matching the mortar-line profile of clean brick beside the sign
    lum = (0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]).astype(np.float32)
    ref = lum[2376:2474, 2866:2886].mean(axis=1); ref = ref - ref.mean()
    best, dy = -1e9, 156
    for d in range(140, 172):
        cand = lum[2376 + d:2474 + d, 2866:2886].mean(axis=1); cand = cand - cand.mean()
        sc = float((ref * cand).sum())
        if sc > best: best, dy = sc, d
    y0, y1, x0, x1 = 2374, 2477, 2880, 2962
    src = a[y0 + dy:y1 + dy, x0:x1].astype(np.float32)
    al = np.ones((y1 - y0, x1 - x0), np.float32)
    ramp = np.linspace(0, 1, 9)[1:]
    al[:, :8] *= ramp; al[:, -8:] *= ramp[::-1]
    al[:3, :] *= np.linspace(0, 1, 4)[1:, None]; al[-3:, :] *= np.linspace(1, 0, 4)[:-1, None]
    dst = a[y0:y1, x0:x1].astype(np.float32)
    a[y0:y1, x0:x1] = np.clip(dst * (1 - al[..., None]) + src * al[..., None], 0, 255).astype(np.uint8)
    print('  pier patch dy', dy)
    # 3) letter marks inside the blank stone panel on the third floor: smooth the panel's inside, then grain
    py0, py1, px0, px1 = 810, 839, 3662, 3733
    a[py0:py1, px0:px1] = cv2.GaussianBlur(a[py0 - 6:py1 + 6, px0 - 6:px1 + 6], (0, 0), 6)[6:-6, 6:-6]
    regrain(a, py0, py1, px0, px1, 3)
    # 4) paper notice behind the fence: clamp to the dark ground around it (the darker bars survive)
    fy0, fy1, fx0, fx1 = 2600, 2688, 4808, 4876
    ring = np.concatenate([a[fy0 - 12:fy0, fx0:fx1].reshape(-1, 3), a[fy1:fy1 + 12, fx0:fx1].reshape(-1, 3)])
    ground = np.median(ring, axis=0) + 4
    a[fy0:fy1, fx0:fx1] = np.minimum(a[fy0:fy1, fx0:fx1], ground.astype(np.uint8))
    return Image.fromarray(a)

# --- the hero's "life" masks (CSS masks for the animated layers; not content, so not in the manifest) -------
#   hero-sun-mask(.tall).webp  alpha = how much DIRECT low sun a surface gets: warm, lit brick and stone, never the
#                              sky (flood-filled from the top edge) or the lit shop glass. Bird shadows are drawn
#                              through it, so they only darken what the sun actually lights.
#   hero-traffic-mask.webp     alpha = open sky in the gap above the elevated highway deck between the building and its
#                              neighbour, at full resolution: the rail and the deck stay in front of the passing cars.
#   hero-sky-mask(.tall).webp  alpha = open sky (the same flood fill), so birds pass behind the building.
def hero_masks(hero, tx0, tcw):
    from collections import deque
    W0, H0 = hero.size
    S = 4
    w, h = W0 // S, H0 // S
    a = np.asarray(hero.resize((w, h), Image.LANCZOS)).astype(np.float32)
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    lin = lambda v: np.where(v / 255 <= 0.04045, v / 255 / 12.92, ((v / 255 + 0.055) / 1.055) ** 2.4)
    L = 0.2126 * lin(R) + 0.7152 * lin(G) + 0.0722 * lin(B)
    sky = np.zeros((h, w), bool); q = deque()
    for x in range(w):
        if B[0, x] > R[0, x] - 40 and L[0, x] > 0.08: sky[0, x] = True; q.append((0, x))
    while q:
        y, x = q.popleft(); c = a[y, x]
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not sky[ny, nx] and np.abs(a[ny, nx] - c).sum() < 7.5:
                sky[ny, nx] = True; q.append((ny, nx))
    sky = cv2.morphologyEx(sky.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8)).astype(bool)
    warm = np.clip((R - B - 22) / 70, 0, 1)
    lit = np.clip((L - 0.035) / 0.10, 0, 1)
    notglow = 1 - np.clip((L - 0.30) / 0.12, 0, 1)
    notyellow = 1 - np.clip((G / np.maximum(R, 1) - 0.62) / 0.10, 0, 1)
    sun = (warm * lit * notglow * notyellow).astype(np.float32)
    sun = cv2.morphologyEx(sun, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
    # the shopfront glass glows warm from inside (interior light, not sun): keep shadows off the whole ground floor
    # of the front facade (full-res box 2990-4570 x 2110-2830), feathered
    shop = np.zeros((h, w), np.float32); shop[2110 // S:2830 // S, 2990 // S:4570 // S] = 1
    sun = sun * (1 - cv2.GaussianBlur(shop, (0, 0), 3))
    sun = cv2.GaussianBlur(sun, (0, 0), 2.2) * (~sky)
    sun = np.clip(sun / max(1e-6, float(np.percentile(sun[sun > 0.05], 97))), 0, 1)
    def save_mask(m, name):
        out = np.zeros(m.shape + (4,), np.uint8); out[..., 3] = (m * 255).astype(np.uint8)
        Image.fromarray(out, 'RGBA').save(os.path.join(OUT, name), 'WEBP', lossless=True, method=6)
        print(' ', name, m.shape[1], m.shape[0], os.path.getsize(os.path.join(OUT, name)) // 1024, 'KB')
    save_mask(sun, 'hero-sun-mask.webp')
    save_mask(sun[:, tx0 // S:(tx0 + tcw) // S], 'hero-sun-mask-tall.webp')
    # open sky, so the birds can fly BEHIND the gables, the cupola and the roofline
    skym = cv2.GaussianBlur(cv2.erode(sky.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(np.float32), (0, 0), 0.8)
    save_mask(skym, 'hero-sky-mask.webp')
    save_mask(skym[:, tx0 // S:(tx0 + tcw) // S], 'hero-sky-mask-tall.webp')
    # ...and its opposite, the lit world (buildings, street): the night hero's headlight sweep lands only there
    ground = np.clip(1 - skym, 0, 1)
    save_mask(ground, 'hero-ground-mask.webp')
    save_mask(ground[:, tx0 // S:(tx0 + tcw) // S], 'hero-ground-mask-tall.webp')
    # traffic gap, full resolution; box (4540, 1940)-(5000, 2080) is hard-wired in signature.css (.hero__traffic)
    g = np.asarray(hero.crop((4540, 1940, 5000, 2080))).astype(np.float32)
    gl = 0.2126 * lin(g[..., 0]) + 0.7152 * lin(g[..., 1]) + 0.0722 * lin(g[..., 2])
    open_sky = np.clip((gl - 0.12) / 0.16, 0, 1)
    open_sky[:, 435:] = 0            # the neighbour's brick wall starts at x ~4975
    save_mask(cv2.GaussianBlur(open_sky.astype(np.float32), (0, 0), 0.7), 'hero-traffic-mask.webp')

hero_raw = os.path.join(RAW, 'hero-golden-b-0.png')
if os.path.exists(hero_raw):
    clean_path = os.path.join(RAW, 'hero-golden-b-clean-0.png')
    if not os.path.exists(clean_path):
        clean_hero(Image.open(hero_raw).convert('RGB')).save(clean_path)
    hero = Image.open(clean_path).convert('RGB')
    hero_prov = prov('hero-golden-b') + [{'job': 'hero-golden-b-clean', 'endpoint': 'local: tools/process-images.py clean_hero (OpenCV)', 'request_id': None, 'prompt': None}]
    save_set('hero-golden', hero, [1280, 1920, 2560, 3200], HERO_ALT, hero_prov, quality=80)
    # phone crop (9:16): the sunlit corner of the side wall, the corner pier and the front with its cupola + door
    W, H = hero.size
    cw = round(H * 9 / 16); cx = 3300
    x0 = max(0, min(W - cw, cx - cw // 2))
    save_set('hero-golden-tall', hero.crop((x0, 0, x0 + cw, H)), [720, 1080, 1440], HERO_ALT, hero_prov, quality=80)
    print('  tall crop x', x0, '->', x0 + cw, '(the hero life layers use this offset)')
    hero_masks(hero, x0, cw)

# --- the same building at night (operator, 2026-11-10: "a night version of his storefront, but make it look more
# cinematic"): fal nano-banana-pro/edit relit OUR golden-hour image (hero-golden-b-clean, downscaled to 2752 px as the
# input), so the framing is the same: SIFT registration against the golden frame gave scale 0.9998, shift 0.6 px,
# which keeps every hero mask valid. The owner's night photo of another shop was a mood reference only, never an
# input. Local clean-up: a mark the relight wrote on the transom glass above the door.
NIGHT_ALT = ('AI illustration of the red-brick building at 123 E Willow St at night: arched windows, twin gables and a '
             'small cupola against a deep blue sky, the ground-floor shop windows glowing warm over a wet street')
night_raw = os.path.join(RAW, 'hero-night-a-0.png')
if os.path.exists(night_raw) and os.path.exists(hero_raw):
    nclean = os.path.join(RAW, 'hero-night-a-clean-0.png')
    if not os.path.exists(nclean):
        a = np.asarray(Image.open(night_raw).convert('RGB')).copy()
        m = np.zeros(a.shape[:2], np.uint8); m[2280:2309, 3470:3518] = 255
        a = cv2.inpaint(a, m, 6, cv2.INPAINT_TELEA); regrain(a, 2280, 2309, 3470, 3518, 7)
        Image.fromarray(a).save(nclean)
    night = Image.open(nclean).convert('RGB')
    night_prov = prov('hero-night-a') + [{'job': 'hero-night-a-clean', 'endpoint': 'local: tools/process-images.py (OpenCV inpaint)', 'request_id': None, 'prompt': None}]
    save_set('hero-night', night, [1280, 1920, 2560, 3200], NIGHT_ALT, night_prov, quality=80)
    W, H = night.size
    cw = round(H * 9 / 16); x0 = max(0, min(W - cw, 3300 - cw // 2))
    save_set('hero-night-tall', night.crop((x0, 0, x0 + cw, H)), [720, 1080, 1440], NIGHT_ALT, night_prov, quality=80)

# --- engraved hands (founders' mission): ink only, on transparent ---------------------------------------------
# fal nano-banana-pro text-to-image (job hands-engraving-b, render 0): an ORIGINAL, symbolic banknote-style engraving
# of two equal hands reaching toward each other (the operator asked for a take that is only a nod to the Creation of
# Adam, not a copy). The owner's reference drawing carries a stock-site watermark and was NOT used as an input.
# The paper is keyed out (ink coverage -> alpha) and the band is cropped tight around the hands and cuffs (rows
# 520-2160 of 2688) so the section stays compact; the stylesheet fades the cropped sunburst rays at the edges.
HANDS_ALT = ('AI illustration: two hands in rolled-up work-shirt sleeves, one denim and one flannel, reach toward each '
             'other, fingertips almost touching, drawn in fine banknote-style lines')

def hands_silhouettes(alpha):
    """Each hand + arm as its own filled shape (left, right): flood the paper in from the top and bottom edges (ink
    lines are walls; the flood runs round the sunburst rays' open ends), keep what it cannot reach, open with a disc
    wider than any ray so the rays drop out, keep the two big parts and fill each one."""
    H, W = alpha.shape
    S = 2
    a = cv2.resize(alpha, (W // S, H // S), interpolation=cv2.INTER_AREA)
    ff = (a > 0.30).astype(np.uint8) * 255
    h, w = ff.shape
    m = np.zeros((h + 2, w + 2), np.uint8)
    for x in range(w):
        for y in (0, h - 1):
            if ff[y, x] == 0: cv2.floodFill(ff, m, (x, y), 128)
    solid = (ff != 128).astype(np.uint8)
    solid = cv2.morphologyEx(solid, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15)))
    n, lab, st, cen = cv2.connectedComponentsWithStats(solid, 8)
    parts = sorted([i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > 0.01 * h * w], key=lambda i: cen[i][0])
    assert len(parts) == 2, f'expected two hands, found {len(parts)}'
    out = []
    for i in parts:
        cnts, _ = cv2.findContours((lab == i).astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        fill = np.zeros((h, w), np.uint8); cv2.drawContours(fill, cnts, -1, 1, thickness=-1)
        fill = cv2.dilate(fill, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
        out.append(np.clip(cv2.GaussianBlur(cv2.resize(fill.astype(np.float32), (W, H), interpolation=cv2.INTER_LINEAR), (0, 0), 1.2), 0, 1))
    return out

# Two layers so the hands can travel in on scroll and meet (operator, 2026-11-10). Each layer is the full band size,
# transparent except its own hand, which is OPAQUE inside its outline: the paper tone of the band fills the light
# parts of the engraving, so the "The Founders" script behind never shows through a hand, wherever it is.
HANDS_PAPER = np.array([248, 246, 241], np.float32)   # --gallery under the band's top light, measured at the banner
HANDS_INK = np.array([24, 44, 33], np.float32)        # one deep banknote green for every line
hands_raw = os.path.join(RAW, 'hands-engraving-b-0.png')
if os.path.exists(hands_raw):
    g = np.asarray(Image.open(hands_raw).convert('L')).astype(np.float32)[520:2160]
    lp, li = 228.0, 31.0                       # paper (minus its fibres) and ink, measured on the render
    alpha = np.clip((lp - g) / (lp - li), 0, 1) ** 0.9
    sil_l, sil_r = hands_silhouettes(alpha)    # the sunburst rays fall outside both (operator: "remove the rays")
    # where the fingertips nearly touch: the gap the scroll animation closes
    rows = slice(int(alpha.shape[0] * .25), int(alpha.shape[0] * .75))
    tip_l = int(np.where((sil_l[rows] > .5).any(axis=0))[0].max()); tip_r = int(np.where((sil_r[rows] > .5).any(axis=0))[0].min())
    print('  fingertips: left hand ends at x', tip_l, '| right hand starts at x', tip_r, '| gap', tip_r - tip_l, 'px of', alpha.shape[1], f'({(tip_r - tip_l) / alpha.shape[1] * 100:.2f}% of the width)')
    for side, sil in (('l', sil_l), ('r', sil_r)):
        ink = (alpha * sil)[..., None]
        rgb = HANDS_PAPER * (1 - ink) + HANDS_INK * ink
        rgba = np.dstack([np.clip(rgb, 0, 255), sil[..., None] * 255]).astype(np.uint8)
        alt = HANDS_ALT if side == 'l' else ''
        save_set('hands-' + side, Image.fromarray(rgba, 'RGBA'), [1400, 2400, 3200], alt, prov('hands-engraving-b'), quality=84, alpha=True)
    for old in ('hands-engraving-knock.webp',) + tuple(f'hands-engraving-{w}.webp' for w in (1400, 2400, 3200)):
        if os.path.exists(os.path.join(OUT, old)): os.remove(os.path.join(OUT, old))

# --- five pillars: a "museum of the everyday" (operator, 2026-11-10: fun pictures matching the humour of the founders'
# hands). fal nano-banana-pro text-to-image, one render each (tools/jobs/pillars-museum.json); reviewed at full size.
PILLARS = [
  ('pillar-megaphone', 'pillar-01-megaphone', 'AI illustration: a scuffed vintage red megaphone displayed on a white museum plinth behind a velvet rope'),
  ('pillar-jewel', 'pillar-02-jewel', 'AI illustration: a single frosty cannabis bud on a black velvet cushion in a glass display case, lit like a gemstone'),
  ('pillar-snowglobe', 'pillar-03-snowglobe', 'AI illustration: a snow globe holding a tiny red-brick building with arched windows, twin gables and a cupola, on a museum plinth'),
  ('pillar-sommelier', 'pillar-04-sommelier', 'AI illustration: a white-gloved hand presenting a glass jar of cannabis flower like a sommelier, a napkin over the forearm'),
  ('pillar-crown', 'pillar-05-crown', 'AI illustration: a mint-green foam Statue of Liberty souvenir crown on a museum plinth behind a red velvet rope'),
]
for pid, job, alt in PILLARS:
    if os.path.exists(os.path.join(RAW, job + '-0.png')):
        save_set(pid, load(job), [400, 600, 900], alt, prov(job), quality=80)

# --- the client's own store photos (operator, 2026-11-10: "enhance these images, upscale to make it look crisp and HD,
# then make them look cinematic"; the golden-hour grade that followed was rejected: "I didnt like you color grading on
# the images let's revert them to have a very good indoor lighting instead"). Real photographs, kept truthful: an
# Instagram carousel badge painted out of the counter photo (OpenCV), fal Topaz "High Fidelity V2" 2x with face
# enhancement OFF (tools/jobs/store-photos.json, store-photos-2.json; faces, logos and product labels reviewed against
# the originals at 2x), then a deterministic lighting correction (tone and colour only, nothing painted in). IPTC
# DigitalSourceType = algorithmicallyEnhanced; no "AI illustration" tag, because nothing was generated.
# [CONFIRM WITH CLIENT] consent of everyone pictured in the counter photo (staff and customers) before publishing.
def indoor_light(im, white=(1.0, 0.99, 0.965), p_hi=97.0, hi_to=0.92, gamma=0.82, clarity=0.16, sat=1.05):
    """A bright, evenly lit store, the way a good interior photographer would deliver it, by tone and colour only:
    neutral white balance taken from the shop's own white surfaces (a hint of warmth, no cast), exposure set from the
    bright end, mids brightened and shadows lifted with true blacks kept, a soft knee so no wall or lit case clips, gentle
    local contrast and natural colour. No vignette, no grain, no colour grade. Checked on the counter photo's faces: every
    face is lifted, the darker skin tones the most (fill light), and no channel clips (0.00-0.01% of pixels)."""
    a = np.asarray(im.convert('RGB')).astype(np.float32) / 255.0
    h, w = a.shape[:2]
    luma = lambda x: 0.2126 * x[..., 0] + 0.7152 * x[..., 1] + 0.0722 * x[..., 2]
    # white balance: the mean of bright, near-neutral pixels (walls, white cases, counters) is taken to `white`
    lum = luma(a)
    m = ((a.max(axis=2) - a.min(axis=2)) < 0.10) & (lum > 0.50) & (lum < 0.96)
    ref = a[m].mean(axis=0) if m.sum() > 500 else a.reshape(-1, 3).mean(axis=0)
    a = np.clip(a * np.clip(np.array(white, np.float32) / (ref / ref[1]), 0.85, 1.15), 0, 1)
    # exposure from the bright end, then mids up and shadows lifted (gamma) with the top rolled off softly
    lum = luma(a)
    ex = float(np.clip(hi_to / max(np.percentile(lum, p_hi), 1e-3), 0.9, 1.4))
    l2 = np.clip(lum * ex, 0, None) ** gamma
    l2 = np.where(l2 > 0.88, 0.88 + (1 - np.exp(-(l2 - 0.88) / 0.12)) * 0.12, l2)
    a = a * (l2 / np.maximum(lum, 1e-4))[..., None]
    # local contrast (clarity) on luminance only, so detail stays crisp after the lift
    lum = luma(a)
    l3 = np.maximum(lum + clarity * (lum - cv2.GaussianBlur(lum, (0, 0), max(w, h) / 110)), 0)
    a = a * (l3 / np.maximum(lum, 1e-4))[..., None]
    # natural colour, then a soft knee on the brightest channel so nothing clips to a flat channel
    g = luma(a)[..., None]
    a = g + (a - g) * sat
    mx = a.max(axis=2); knee = 0.94
    tgt = np.where(mx > knee, knee + (1 - np.exp(-(mx - knee) / (1 - knee))) * (1 - knee), mx)
    a = np.clip(a * (tgt / np.maximum(mx, 1e-4))[..., None], 0, 1)
    return Image.fromarray((a * 255 + 0.5).astype(np.uint8))

PHOTOS = [
  ('photo-interior', 'photo-interior-up', [1280, 1920, 2720],
   'Inside The Higher Co. at 123 E Willow St: the light-oak counter with the THC logo, glass display cases lit along both walls, black cast-iron columns and ring lights overhead'),
  ('photo-counter', 'photo-counter-up', [800, 1200, 1656],
   'Budtenders in black The Higher Co. shirts helping customers at the light-oak checkout counter, the lit THC sign on the wall behind them'),
  ('photo-display', 'photo-display-up', [800, 1200, 1920],
   'A glass display case at The Higher Co. lined with gold velvet: a black THC snapback cap in the middle among edibles, tins and packs, gold hand sculptures, and the lit THC sign over glassware shelves on the back wall'),
]
for pid, job, widths, alt in PHOTOS:
    src = os.path.join(RAW, job + '-0.png')
    if os.path.exists(src):
        save_set(pid, indoor_light(Image.open(src)), widths, alt, prov(job) + [{'job': pid + '-light', 'endpoint': 'local: tools/process-images.py indoor_light()', 'request_id': None, 'prompt': None}], quality=84, kind='enhanced')

# --- category cut-outs (alpha) ---------------------------------------------------------------------
CUTS = {
  'flower': 'AI illustration: a single frosted cannabis flower bud',
  'prerolls': 'AI illustration: three cone-shaped pre-rolls in natural brown paper',
  'vapes': 'AI illustration: an unbranded glass vape cartridge filled with golden oil',
  'concentrates': 'AI illustration: shards of golden amber shatter beside a dollop of creamy badder',
  'edibles': 'AI illustration: squares of dark chocolate beside a small black tin',
  'accessories': 'AI illustration: a brass herb grinder beside a clear glass hand pipe',
}
for cat, alt in CUTS.items():
    rgba = Image.open(os.path.join(RAW, f'cut-{cat}-0.png')).convert('RGBA')
    a = np.asarray(rgba).copy()
    alpha = a[:, :, 3]
    lum = (0.299 * a[:, :, 0] + 0.587 * a[:, :, 1] + 0.114 * a[:, :, 2])
    n, lab, stats, _ = cv2.connectedComponentsWithStats((alpha > 24).astype(np.uint8), 8)
    if n > 1:
        areas = stats[1:, cv2.CC_STAT_AREA]; big = areas.max()
        H0 = alpha.shape[0]
        for i in range(1, n):
            x, y, w, h, area = stats[i]
            m = lab == i
            mean_l = float(lum[m].mean())
            # floor reflections and tray shards: small-to-mid, dark pieces in the lower part of the frame
            if area < big * 0.02 or (mean_l < 70 and y > H0 * 0.55 and area < big * 0.6):
                a[m, 3] = 0
    out = Image.fromarray(a, 'RGBA')
    bb = out.getbbox(); out = out.crop(bb)
    if cat == 'accessories':  # drop the mirrored floor reflection under the grinder and pipe
        out = out.crop((0, 0, out.width, int(out.height * 0.64))); out = out.crop(out.getbbox())
    # normalise to a common height so the shelf reads as one set
    th = 900; out = out.resize((round(out.width * th / out.height), th), Image.LANCZOS)
    save_set('cut-' + cat, out, [360, 640, out.width], alt, prov('cut-' + cat, 'cat-' + cat), quality=86, alpha=True)

# --- category cards: one product per card, rising out of the top (operator, 2026-11-10: "Replace category Icons with
# reimage of preroll with a preroll from [another SGEN redesign] and make the cards follow
# this layout [that site's category cards] but following the THC branding"). fal flux-pro/v1.1-ultra from ONE
# studio template on a backdrop in each card's THC colour, two seeds, the better kept (tools/jobs/category-cards.json);
# the pre-roll is a flux-pro/kontext re-image of the pre-roll on another SGEN redesign (that site's owner-supplied
# photo, cut out there; set on THC mint here, private/photos/preroll/). fal BiRefNet v2 cut-outs
# (tools/jobs/category-cutouts.json). What shows through the clear glass is the render's backdrop, so it is moved to the
# dark tint of the glass case it stands in (round 2: glass cases with brass accents); product colours further than 40
# from the backdrop are left alone.
GLASS_TINT = (46, 44, 40)
# Round 3 (operator: "finish building the jars ... and remove the teal colored reflection on some of these products"):
#  - jars: the cut-out bit pieces out of the clear glass walls (flower and edibles lost most of their left wall), so each
#    jar's outline is rebuilt as the convex hull of its cut-out and the missing glass refilled from the render;
#  - clear glass (pixels that are the backdrop seen through the glass) becomes smoky and partly see-through, keeping its
#    own highlights, so the jars read as finished glass on the dark case;
#  - the mint backdrops bounced green into some products: the grinder goes back to brass all over, the concentrates glass
#    and the pre-roll's edges go neutral (the budder's gold and the pre-roll's olive flower sit outside the bands).
# (id, render, kind, green-cast fix, alt)
CATCARDS = [
  ('flower', 'cat-flower-b', 'jar', None, 'AI illustration: a clear glass jar with a brass lid, filled to the brim with green cannabis buds'),
  ('prerolls', 'cat-prerolls-k', 'solid', 'neutral', 'AI illustration: a single cone pre-roll with a kraft paper tip, standing at a slant'),
  ('vapes', 'cat-vapes-b', 'solid', None, 'AI illustration: a slim black vape pen with a clear cartridge of golden oil'),
  ('concentrates', 'cat-concentrates-b', 'jar', 'glass', 'AI illustration: a small glass jar with a brass lid, filled with golden cannabis budder'),
  ('edibles', 'cat-edibles-b', 'jar', None, 'AI illustration: a clear glass jar with a brass lid, filled with sugar-coated fruit gummies'),
  ('accessories', 'cat-accessories-b', 'solid', 'brass', 'AI illustration: a polished brass herb grinder with a knurled rim'),
]

def jar_hull(alpha):
    m = (alpha > 128).astype(np.uint8)
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    hm = np.zeros_like(m)
    cv2.fillConvexPoly(hm, cv2.convexHull(max(cnts, key=cv2.contourArea)), 1)
    return cv2.GaussianBlur(hm.astype(np.float32), (0, 0), 0.9)

def unteal(rgb, mode):
    hsv = cv2.cvtColor(np.clip(rgb, 0, 255).astype(np.uint8), cv2.COLOR_RGB2HSV).astype(np.float32)
    h, sat = hsv[..., 0], hsv[..., 1]                              # OpenCV hue 0..180 (x2 = degrees)
    lo, hi = {'brass': (24, 106), 'glass': (34, 106), 'neutral': (58, 106)}[mode]
    w = np.clip((h - (lo - 1)) / 4, 0, 1) * np.clip((hi - h) / 6, 0, 1) * np.clip((sat - 6) / 18, 0, 1)
    if mode == 'brass':
        hsv[..., 0] = h * (1 - w) + 20 * w                        # greener than brass -> brass
    else:
        hsv[..., 1] = sat * (1 - .92 * w)                          # green-cyan cast -> neutral
    return cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2RGB).astype(np.float32)

for cat, job, kind, teal, alt in CATCARDS:
    if not os.path.exists(os.path.join(RAW, f'cat-{cat}-cut-0.png')):
        continue
    raw = np.asarray(Image.open(os.path.join(RAW, job + '-0.png')).convert('RGB')).astype(np.float32)
    cut = np.asarray(Image.open(os.path.join(RAW, f'cat-{cat}-cut-0.png')).convert('RGBA')).astype(np.float32)
    assert cut.shape[:2] == raw.shape[:2], cat
    e = max(8, raw.shape[1] // 40)
    ring = np.concatenate([raw[:e].reshape(-1, 3), raw[-e:].reshape(-1, 3), raw[:, :e].reshape(-1, 3), raw[:, -e:].reshape(-1, 3)])
    bg = np.median(ring, axis=0)
    rgb, al = cut[..., :3].copy(), cut[..., 3] / 255.0
    if kind == 'jar':
        hm = jar_hull(cut[..., 3])
        gap = np.clip(hm - al, 0, 1)[..., None]
        rgb = rgb * (1 - gap) + raw * gap
        al = np.maximum(al, hm)
    d = np.linalg.norm(rgb - bg, axis=2)
    near = np.clip(1 - d / (75.0 if cat == 'concentrates' else 40.0), 0, 1)
    rgb = rgb + near[..., None] * (np.array(GLASS_TINT, np.float32) - bg)
    if kind == 'jar':
        clear = np.clip(1 - d / 26, 0, 1)
        al = al * (1 - .45 * clear)
        g = rgb.mean(axis=2, keepdims=True); rgb = g + (rgb - g) * (1 - .6 * clear[..., None])
    if teal:
        rgb = unteal(rgb, teal)
    out = Image.fromarray(np.concatenate([np.clip(rgb, 0, 255), np.clip(al, 0, 1)[..., None] * 255], axis=2).astype(np.uint8), 'RGBA')
    bb = Image.fromarray(((al > .04) * 255).astype(np.uint8)).getbbox()
    out = out.crop((max(bb[0] - 6, 0), max(bb[1] - 6, 0), min(bb[2] + 6, out.width), min(bb[3] + 6, out.height)))
    # heights 240 / 400 / 720: phone and desktop cards at 1x and 2x, the /shop/ heroes (the cards size products by height)
    widths = sorted({max(24, round(out.width * hh / out.height)) for hh in (240, 400, 720)})
    save_set('cat-' + cat, out, widths, alt, prov(job, f'cat-{cat}-cut'), quality=86, alpha=True)

# --- the Flower Bar ball pit: 90 different buds (operator, 2026-11-10: "something like this
# [a ball-pit background component] but fewer sprites and will be replaced by cannabis buds ... about 90 different
# kinds of buds and a bit bigger ... we will keep the magnifying glass and remove teal 90"). Six fal nano-banana-pro sprite
# sheets of 16 strains each (tools/jobs/bud-sheets.json: greens, purples, frosty, sativas, indicas, exotics), BiRefNet
# cut-outs (tools/jobs/bud-cutouts.json); some sheets came back with thin grid lines, which are taken out of the mask
# here; each bud is split out as its own connected piece, the 90 largest kept, fitted into square cells and packed into
# one atlas (10 x 9) at two sizes. src/content/buds.json carries the layout and each bud's size in its cell (the pit
# sizes its collision circle from it).
BUD_SHEETS = ['greens', 'purples', 'frosty', 'sativas', 'indicas', 'exotics']
BUD_CELL, BUD_COLS, BUD_N = 224, 10, 90

def bud_pieces(sheet):
    rgba = np.asarray(Image.open(os.path.join(RAW, f'buds-{sheet}-cut-0.png')).convert('RGBA')).copy()
    al = rgba[..., 3]
    on = al > 128
    # grid lines: a column (row) lit along most of its length while the columns 10px either side are not, i.e. a thin
    # line, not the middle of a stack of buds (which is just as lit but wide)
    for axis in (0, 1):
        frac = on.mean(axis=axis)
        side = np.maximum(np.roll(frac, 10), np.roll(frac, -10))
        for i in np.where((frac > 0.6) & (frac - side > 0.3))[0]:
            if axis == 0:
                al[:, max(i - 3, 0):i + 4] = 0
            else:
                al[max(i - 3, 0):i + 4, :] = 0
    rgba[..., 3] = al
    n, lab, st, _ = cv2.connectedComponentsWithStats((al > 100).astype(np.uint8), 8)
    out = []
    for i in range(1, n):
        x, y, w, h, area = st[i]
        if area < 6000 or w < 40 or h < 40:
            continue
        crop = rgba[max(y - 4, 0):y + h + 4, max(x - 4, 0):x + w + 4].copy()
        keep = (lab[max(y - 4, 0):y + h + 4, max(x - 4, 0):x + w + 4] == i)
        keep = cv2.dilate(keep.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0      # this bud's own soft edge only
        crop[..., 3] = np.where(keep, crop[..., 3], 0)
        out.append((y + h / 2, x + w / 2, int(area), Image.fromarray(crop, 'RGBA')))
    out.sort(key=lambda t: (round(t[0] / 120), t[1]))                               # reading order, row by row
    return out

if all(os.path.exists(os.path.join(RAW, f'buds-{k}-cut-0.png')) for k in BUD_SHEETS):
    pieces = []
    for k in BUD_SHEETS:
        got = bud_pieces(k)
        print('buds', k, len(got), 'pieces')
        pieces += [(k, a, im) for _, _, a, im in got]
    keep = sorted(range(len(pieces)), key=lambda i: -pieces[i][1])[:BUD_N]
    keep.sort()                                                                    # sheet order, mixed in the pit by JS
    rows = -(-BUD_N // BUD_COLS)
    atlas = Image.new('RGBA', (BUD_COLS * BUD_CELL, rows * BUD_CELL), (0, 0, 0, 0))
    radii = []
    for j, i in enumerate(keep):
        im = pieces[i][2]
        sc = BUD_CELL * 0.94 / max(im.width, im.height)
        im = im.resize((max(1, round(im.width * sc)), max(1, round(im.height * sc))), Image.LANCZOS)
        cx, cy = (j % BUD_COLS) * BUD_CELL, (j // BUD_COLS) * BUD_CELL
        atlas.alpha_composite(im, (cx + (BUD_CELL - im.width) // 2, cy + (BUD_CELL - im.height) // 2))
        area = float((np.asarray(im)[..., 3] > 100).sum())
        radii.append(round(math.sqrt(area / math.pi) / (BUD_CELL / 2), 3))           # visible size as a share of the cell
    files = {}
    for tag, cell in (('hi', BUD_CELL), ('lo', BUD_CELL // 2)):
        im = atlas if cell == BUD_CELL else atlas.resize((BUD_COLS * cell, rows * cell), Image.LANCZOS)
        fn = f'buds-atlas-{cell}.webp'
        im.save(os.path.join(OUT, fn), 'WEBP', quality=80, method=6, xmp=xmp('AI illustration: 90 cannabis buds of different strains', 'trainedAlgorithmicMedia'))
        files[tag] = {'file': 'assets/img/gen/' + fn, 'cell': cell, 'w': im.width, 'h': im.height, 'bytes': os.path.getsize(os.path.join(OUT, fn))}
        print('bud atlas', fn, im.size, files[tag]['bytes'] // 1024, 'KB')
    json.dump({'note': 'Flower Bar ball pit sprite atlas (AI illustrations; tools/process-images.py).', 'cols': BUD_COLS, 'n': BUD_N,
               'files': files, 'r': radii, 'sheets': BUD_SHEETS,
               'provenance': [prov(f'buds-{k}', f'buds-{k}-cut') for k in BUD_SHEETS]},
              open(os.path.join(ROOT, 'src/content/buds.json'), 'w'), indent=1)

# --- lifestyle drop 01, the THC Monogram Snapback (operator, 2026-11-10: the products on the plinth instead of the 3D
# mark). The cap is the client's own, cropped from their display-case photo; that crop was too soft to show large (a glass
# reflection across it, the patch lettering unreadable), so it was re-imaged with fal flux-pro/kontext as a clean studio
# shot of the same cap (tools/jobs/drops.json) and cut out with BiRefNet; the model could not read the patch either, so the
# brand's real wordmark (src/lib/brand.mjs wordSVG, rendered gold: private/photos/drops/wordmark-gold.png) is laid onto it.
DROP_CAP_ALT = 'AI illustration of the THC Monogram Snapback: a black snapback with the white THC monogram and a gold-bordered The Higher Co. patch'
if os.path.exists(os.path.join(RAW, 'drop-cap-cut-0.png')) and os.path.exists(os.path.join(ROOT, 'private/photos/drops/wordmark-gold.png')):
    cap = Image.open(os.path.join(RAW, 'drop-cap-cut-0.png')).convert('RGBA')
    # the brim is nearly the backdrop's colour, so the cut-out bit holes out of it: its outline is convex, so it is
    # rebuilt as the convex hull of the brim rows and refilled from the render (the crown above is left as cut)
    craw = np.asarray(Image.open(os.path.join(RAW, 'drop-cap-k-0.png')).convert('RGB')).astype(np.float32)
    cc = np.asarray(cap).astype(np.float32)
    assert cc.shape[:2] == craw.shape[:2]
    solid = (cc[..., 3] > 128).astype(np.uint8)
    ys_, xs_ = np.where(solid > 0)
    brim_top = int(ys_.min() + (ys_.max() - ys_.min()) * 0.74)               # the brim: the lowest quarter of the cap
    bm = solid.copy(); bm[:brim_top] = 0
    cnts, _ = cv2.findContours(bm, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    hull = np.zeros_like(bm)
    cv2.fillConvexPoly(hull, cv2.convexHull(np.concatenate(cnts)), 1)
    hull[:brim_top] = 0
    hf = cv2.GaussianBlur(hull.astype(np.float32), (0, 0), 0.9)
    alf = cc[..., 3] / 255.0
    gap = np.clip(hf - alf, 0, 1)[..., None]
    cc[..., :3] = cc[..., :3] * (1 - gap) + craw * gap
    cc[..., 3] = np.maximum(alf, hf) * 255
    cap = Image.fromarray(np.clip(cc, 0, 255).astype(np.uint8), 'RGBA')
    ca = np.asarray(cap).astype(int)
    gold = (ca[..., 0] > 100) & (ca[..., 1] > 75) & (ca[..., 2] < 100) & (ca[..., 0] - ca[..., 2] > 45) & (ca[..., 1] - ca[..., 2] > 25)
    rows = [y for y in range(600, 690) if gold[y, 330:780].sum() >= 40]         # the patch: a wide band of gold
    top, bot = rows[0], rows[-1]
    xs = np.where(gold[top:bot + 1, 330:780].any(axis=0))[0] + 330
    lft, rgt = int(xs.min()), int(xs.max())
    patch = ca[top:bot + 1, lft:rgt + 1, :3]
    dark = patch[patch.max(axis=2) < 70]
    ink = tuple(int(v) for v in np.median(dark, axis=0)) if len(dark) else (16, 16, 16)
    box = (lft - 2, top - 2, rgt + 3, bot + 3)
    cap.paste(Image.new('RGBA', (box[2] - box[0], box[3] - box[1]), ink + (255,)), box[:2])
    wm = Image.open(os.path.join(ROOT, 'private/photos/drops/wordmark-gold.png')).convert('RGBA')
    cap.alpha_composite(wm.resize((box[2] - box[0], box[3] - box[1]), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.5)), box[:2])
    arr = np.asarray(cap).copy()
    arr[..., 3] = np.where(arr[..., 3] < 90, 0, arr[..., 3])                    # drop the faint backdrop shadow the cut-out kept
    cap = Image.fromarray(arr, 'RGBA')
    cap = cap.crop(cap.getbbox())
    save_set('drop-cap', cap, [360, 560, 820], DROP_CAP_ALT, prov('drop-cap-k', 'drop-cap-cut'), quality=86, alpha=True)

# --- lifestyle drop 02, the Lady Liberty Graphic tee (operator, 2026-11-10: "extract the product image from here to
# replace the place holder"). The operator's mockup of the tee folded on marble (private/photos/drops/tee-src.png, 1536x1024,
# no metadata: origin to confirm, treated as an AI illustration), cut out with fal BiRefNet (tools/jobs/drops.json).
# [CONFIRM WITH CLIENT] the picture is an EDITED version of the graphic: the joint and the smoke cloud were removed (operator, 2026-11-10) because New York's cannabis advertising rules bar depicting consumption (9 NYCRR 129.2(b)(5) per a secondary source; check the current official text, Parts 128-129 were recently amended). The tee sold in store still has them, so the client either prints this version or the type poster comes back (its styles are kept); the cannabis-leaf crown still needs their compliance review; the artwork matches a Shutterstock stock illustration (ID 1795674991): confirm the licence covers merch and edits.
# The operator then asked to take the joint out ("then remove the joint from the graphic? enough to comply?"): the joint
# AND the smoke cloud were removed with fal flux-pro/kontext (tools/jobs/drops.json drop-tee-b, image 2 of 2: an open hand
# raised in a wave; the other take curled the hand into a pinch and was rejected), then cut out (drop-tee-b1-cut). The
# cut-out bit a hole into the black shirt between the hand and the head, so every transparent region the border cannot
# reach is filled back in from the render. [CONFIRM WITH CLIENT] this edited graphic differs from the tee sold in store.
DROP_TEE_ALT = 'AI illustration of the Lady Liberty Graphic tee: a folded black T-shirt printed with Lady Liberty in mint, crowned with cannabis leaves, raising an open hand in a wave'
_tee_cut = os.path.join(RAW, 'drop-tee-b1-cut-0.png')
if os.path.exists(_tee_cut):
    tee = np.asarray(Image.open(_tee_cut).convert('RGBA')).copy()
    traw = np.asarray(Image.open(os.path.join(RAW, 'drop-tee-b-1.png')).convert('RGB'))
    assert tee.shape[:2] == traw.shape[:2]
    clear = (tee[..., 3] <= 128).astype(np.uint8)
    n, lab = cv2.connectedComponents(clear, 4)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    hole = (clear > 0) & ~np.isin(lab, list(edge))
    hole = cv2.dilate(hole.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0     # take the soft rim of each hole too
    tee[hole, :3] = traw[hole]
    tee[hole, 3] = 255
    print('drop-tee holes filled px', int(hole.sum()))
    tee = Image.fromarray(tee, 'RGBA')
    tee = tee.crop(tee.getbbox())
    tp = prov('drop-tee-b', 'drop-tee-b1-cut')
    tp.insert(0, {'job': 'operator-supplied', 'endpoint': 'operator mockup (chat image, 2026-11-10), origin unconfirmed', 'request_id': None, 'prompt': None})
    save_set('drop-tee', tee, [360, 560, 820], DROP_TEE_ALT, tp, quality=86, alpha=True)

# --- the Join band's backdrop (operator, 2026-11-10: "can we use this as a background for this section"): the operator's
# image of Lady Liberty flashing a peace sign before the Lower Manhattan skyline at sunset (private/photos/join/
# skyline-src.png, 2000x706, no metadata; the statue's pose is not the real one, so it is treated as an AI illustration),
# upscaled 2x with fal Topaz High Fidelity V2 (tools/jobs/join.json). Decorative on the page (the heading carries the
# meaning); a right-hand crop keeps Liberty in view on phones.
JOIN_ALT = 'AI illustration: the Statue of Liberty flashing a peace sign beside the Lower Manhattan skyline at sunset'
if os.path.exists(os.path.join(RAW, 'join-sky-up-0.png')):
    sky = Image.open(os.path.join(RAW, 'join-sky-up-0.png')).convert('RGB')
    jp = prov('join-sky-up')
    jp.insert(0, {'job': 'operator-supplied', 'endpoint': 'operator image (chat, 2026-11-10), origin unconfirmed', 'request_id': None, 'prompt': None})
    save_set('join-sky', sky, [960, 1440, 1920, 2880], JOIN_ALT, jp, quality=80)
    W, H = sky.size
    tall = sky.crop((int(W * 0.56), 0, W, H))                                  # Liberty and the right of the skyline
    save_set('join-sky-tall', tall, [700, 1100, 1600], JOIN_ALT, jp, quality=80)

# --- the Liberty vector ------------------------------------------------------------------------------
shutil.copyfile(os.path.join(RAW, 'liberty-b-0.svg'), os.path.join(OUT, 'liberty.svg'))
r = rec('liberty-b')
manifest['images']['liberty'] = {'w': 1509, 'h': 2048, 'ratio': round(1509 / 2048, 4), 'ai': 'generated', 'alpha': True,
  'alt': 'AI illustration: an original line drawing of the Statue of Liberty raising her torch, in mint on black',
  'files': [{'w': 1509, 'h': 2048, 'file': 'assets/img/gen/liberty.svg', 'bytes': os.path.getsize(os.path.join(OUT, 'liberty.svg'))}],
  'provenance': prov('liberty-b'), 'note': 'SVG keeps the generator\'s embedded C2PA content-credentials manifest.'}

# --- video loops ---------------------------------------------------------------------------------------
for vid, job, alt in [('vid-storefront', 'vid-storefront', 'AI-generated loop: mist and light shimmer outside a red-brick building at night'),
                      ('vid-macro', 'vid-macro', 'AI-generated loop: light glints across the trichomes of a cannabis flower')]:
    src = os.path.join(RAW, f'{job}-0.mp4')
    dst = os.path.join(VOUT, f'{vid}.mp4')
    subprocess.run([FF, '-v', 'error', '-y', '-i', src, '-an', '-vf', 'scale=1600:-2:flags=lanczos,format=yuv420p',
                    '-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-movflags', '+faststart',
                    '-metadata', 'comment=AI-generated (fal Kling 2.1 Pro image-to-video); not a recording of a real place',
                    dst], check=True)
    poster = os.path.join(OUT, f'{vid}-poster.webp')
    tmp = os.path.join(RAW, f'{vid}-poster.png')
    subprocess.run([FF, '-v', 'error', '-y', '-i', dst, '-frames:v', '1', tmp], check=True)
    pim = Image.open(tmp).convert('RGB')
    pim.save(poster, 'WEBP', quality=78, method=6)
    manifest['videos'][vid] = {'file': f'assets/video/{vid}.mp4', 'bytes': os.path.getsize(dst), 'poster': f'assets/img/gen/{vid}-poster.webp',
                               'w': pim.width, 'h': pim.height, 'alt': alt, 'ai': 'generated', 'provenance': prov(job)}
    print(vid, os.path.getsize(dst) // 1024, 'KB', pim.size)

json.dump(manifest, open(os.path.join(ROOT, 'src/content/images.json'), 'w'), indent=1)
print('manifest written:', len(manifest['images']), 'images,', len(manifest['videos']), 'videos')
