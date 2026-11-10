# trace-logo.py — vectorise the client's real logo (assets/source/brand/THC_logo_white-100.jpg).
# Not an AI step: colour separation + potrace-style spline tracing (vtracer), so the mark keeps its own shapes.
#
#   PYTHONPATH=<dir with vtracer> python3 -I tools/trace-logo.py
#
# Writes private/logo-trace/{dark,gold,leaf,word}.png masks + .svg traces, and src/assets/brand/thc-logo-parts.json
# (path data per part, in one shared 0..1000 coordinate space).
import json, os, re, sys
import numpy as np
from PIL import Image, ImageFilter
import cv2
import potrace

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SRC = os.path.join(ROOT, 'assets/source/brand/THC_logo_white-100.jpg')
OUT = os.path.join(ROOT, 'private/logo-trace'); os.makedirs(OUT, exist_ok=True)
DST = os.path.join(ROOT, 'src/assets/brand'); os.makedirs(DST, exist_ok=True)
SCALE = 2

im = Image.open(SRC).convert('RGB')
im = im.resize((im.width * SCALE, im.height * SCALE), Image.LANCZOS)
a = np.asarray(im).astype(np.float32)
dark = np.array([35, 31, 32], np.float32)
gold = np.array([183, 158, 104], np.float32)
bg = np.array([232, 232, 232], np.float32)
d_dark = np.linalg.norm(a - dark, axis=2)
d_gold = np.linalg.norm(a - gold, axis=2)
d_bg = np.linalg.norm(a - bg, axis=2)
mask_dark = (d_dark < d_gold) & (d_dark < d_bg)
mask_gold = (d_gold < d_dark) & (d_gold < d_bg)

def clean(mask):
    m = (mask * 255).astype(np.uint8)
    m = cv2.GaussianBlur(m, (0, 0), 1.2)
    _, m = cv2.threshold(m, 127, 255, cv2.THRESH_BINARY)
    return m

md = clean(mask_dark)
mg = clean(mask_gold)

# split gold into the leaf (the component(s) right of / above the box) and the word box + letters
n, lab, stats, cent = cv2.connectedComponentsWithStats(mg, 8)
box_top = None
# the box is the widest component
widest = max(range(1, n), key=lambda i: stats[i, cv2.CC_STAT_WIDTH])
box_top = stats[widest, cv2.CC_STAT_TOP]
leaf = np.zeros_like(mg); word = np.zeros_like(mg)
for i in range(1, n):
    x, y, w, h, area = stats[i]
    if area < 30: continue
    if y + h <= box_top + 4:  # entirely above the box -> leaf
        leaf[lab == i] = 255
    else:
        word[lab == i] = 255

def trace(mask, name):
    Image.fromarray(255 - mask).save(os.path.join(OUT, name + '.png'))  # black shape on white, for review
    bm = potrace.Bitmap(mask == 0)  # potracer fills values below its blacklevel, i.e. the 0 pixels
    plist = bm.trace(turdsize=6, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.0, opticurve=True, opttolerance=0.2)
    ds = []
    for curve in plist:
        x, y = curve.start_point.x, curve.start_point.y
        d = [f'M {x:.2f} {y:.2f}']
        for seg in curve.segments:
            if seg.is_corner:
                d.append(f'L {seg.c.x:.2f} {seg.c.y:.2f} L {seg.end_point.x:.2f} {seg.end_point.y:.2f}')
            else:
                d.append(f'C {seg.c1.x:.2f} {seg.c1.y:.2f} {seg.c2.x:.2f} {seg.c2.y:.2f} {seg.end_point.x:.2f} {seg.end_point.y:.2f}')
        d.append('Z')
        ds.append({'d': ' '.join(d), 'tx': 0.0, 'ty': 0.0})
    return ds

parts = {name: trace(m, name) for name, m in [('mono', md), ('leaf', leaf), ('word', word)]}

# normalise every part into one 1000-wide space over the logo's own bounding box
allmask = (md > 0) | (mg > 0)
ys, xs = np.where(allmask)
x0, y0, x1, y1 = xs.min(), ys.min(), xs.max(), ys.max()
k = 1000.0 / (x1 - x0)
num = re.compile(r'-?\d+(?:\.\d+)?')

def norm_path(p):
    # vtracer emits absolute M/C/L/Z commands with x,y pairs; shift by translate, then by the bbox, then scale
    toks = re.findall(r'[MCLZmclz]|-?\d+(?:\.\d+)?', p['d'])
    out, coord_i = [], 0
    for t in toks:
        if t.isalpha():
            out.append(t.upper() if t in 'MCLZ' else t); coord_i = 0; continue
        v = float(t)
        if coord_i % 2 == 0: v = (v + p['tx'] - x0) * k
        else: v = (v + p['ty'] - y0) * k
        out.append(f'{v:.1f}'); coord_i += 1
    return ' '.join(out)

result = {'source': 'assets/source/brand/THC_logo_white-100.jpg (live site, 21+ gate image)', 'method': 'colour separation + vtracer spline trace, x' + str(SCALE),
          'viewBox': [0, 0, 1000, round((y1 - y0) * k, 1)],
          'bbox_px_at_scale': [int(x0), int(y0), int(x1), int(y1)],
          'colours_measured': {'ink': '#231F20', 'gold': '#B79E68'}}
for name, ps in parts.items():
    result[name] = [norm_path(p) for p in ps]
    print(name, len(ps), 'paths')
# monogram letter split points (x in the 1000 space) measured from column coverage of the dark mask
cols = (md[:, x0:x1 + 1] > 0).sum(0)
json.dump(result, open(os.path.join(DST, 'thc-logo-parts.json'), 'w'))
print('viewBox', result['viewBox'])
# column profile summary, to locate the slots between T, H and C
prof = [(int(i * k), int(c)) for i, c in enumerate(cols) if i % (12 * SCALE) == 0]
print('profile', prof)
