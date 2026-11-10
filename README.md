# The Higher Company: website redesign concept

Design concept for **The Higher Company (The Higher Co.)**, a licensed adult-use cannabis dispensary at
123 E Willow St, downtown Syracuse, NY. Static, platform-free, no dependencies.

- **Preview (noindex):** https://sgen-sites.github.io/thehigherco-redesign/
- **Developer README:** [`docs/README.md`](docs/README.md)
- **Pitch notes and open questions for the client:** [`docs/PITCH-NOTES.md`](docs/PITCH-NOTES.md)
- **Every decision, rewrite and generated image:** [`docs/CHANGE-LOG.md`](docs/CHANGE-LOG.md)
- **Brand system:** [`docs/BRAND-SYSTEM.md`](docs/BRAND-SYSTEM.md) · **Deploy:** [`docs/DEPLOY.md`](docs/DEPLOY.md)

```bash
node src/build.mjs                       # production build -> dist/
python3 -m http.server 8080 -d dist      # http://localhost:8080/
```

Shop pages carry the store's own live online menu, opened straight on each category, with its cart and checkout.
Images marked "AI illustration" are generated artwork, not photographs of the store, staff or products.
