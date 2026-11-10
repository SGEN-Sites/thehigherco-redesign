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
from PIL import Image
import numpy as np
import cv2

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
RAW = os.path.join(ROOT, 'private/gen-raw')
OUT = os.path.join(ROOT, 'src/assets/img/gen'); os.makedirs(OUT, exist_ok=True)
VOUT = os.path.join(ROOT, 'src/assets/video'); os.makedirs(VOUT, exist_ok=True)
FF = os.environ.get('FFMPEG') or '/private/tmp/claude-501/-Users-carlcelino-OSOFT/b81bd7fa-5824-44fc-a518-2091ef9139ac/scratchpad/pylib/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v9.0'

def xmp(desc):
    d = desc.replace('&', '&amp;').replace('<', '&lt;')
    return ('<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">'
            '<rdf:Description rdf:about="" xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" xmlns:dc="http://purl.org/dc/elements/1.1/">'
            '<Iptc4xmpExt:DigitalSourceType>http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia</Iptc4xmpExt:DigitalSourceType>'
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

manifest = {'note': 'Every asset in this file was generated with AI (fal). None of them shows the real store, staff, customers or products. Real photos should replace the place images before launch.', 'images': {}, 'videos': {}}

def save_set(img_id, im, widths, alt, provenance, quality=78, alpha=False):
    files = []
    w0, h0 = im.size
    for w in widths:
        if w > w0: w = w0
        h = round(h0 * w / w0)
        r = im.resize((w, h), Image.LANCZOS) if w != w0 else im
        fn = f'{img_id}-{w}.webp'
        kw = dict(quality=quality, method=6)
        try:
            r.save(os.path.join(OUT, fn), 'WEBP', xmp=xmp(alt), **kw)
        except TypeError:
            r.save(os.path.join(OUT, fn), 'WEBP', **kw)
        files.append({'w': w, 'h': h, 'file': 'assets/img/gen/' + fn, 'bytes': os.path.getsize(os.path.join(OUT, fn))})
        if w == w0: break
    manifest['images'][img_id] = {'w': w0, 'h': h0, 'ratio': round(w0 / h0, 4), 'alt': alt, 'ai': 'generated', 'files': files, 'alpha': alpha, 'provenance': provenance}
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
