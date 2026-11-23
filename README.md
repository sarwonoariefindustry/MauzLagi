# Mauz Lagi — static website

Plain HTML, CSS and vanilla JavaScript. No framework, no build step.

## Run locally
Open `index.html` in a browser (double-click). Or serve the folder: `python3 -m http.server 8000` then visit http://localhost:8000.

## Files
- `index.html`, `flavors.html`, `about.html`, `order.html`, `experience.html`, `build-your-box.html`
- `css/style.css` — design system (colors, type, spacing, components) from the Stitch `DESIGN.md`
- `js/products.js` — products, prices, image URLs, WhatsApp number (edit business info here)
- `js/main.js` — header/footer, mobile menu, active nav, filters, FAQ, WhatsApp links
- `js/order.js` — order calculator, Build Your Box, WhatsApp message

## Fill in before launch
In `js/products.js` → `MAUZ_CONFIG`:
- `whatsappNumber`: e.g. `"628123456789"` (no `+`, no spaces). While empty, WhatsApp opens with the message ready and lets the sender choose a contact.
- `instagramUrl`: the footer link only appears when this is set.
- `IMAGES`: temporary Stitch URLs. Replace with local files, e.g. `"assets/images/matcha.jpg"`. A placeholder shows if an image fails to load.
- Logo: a text wordmark is used. Put the real logo in `assets/logo/` and update `renderChrome()` in `js/main.js`.
- Product weight, ingredients and other details are intentionally left out until confirmed.

## Publish on GitHub Pages
1. Create a GitHub repository and upload everything inside `mauz-lagi/` (so `index.html` is at the repository root).
2. Repository **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then Save.
4. After a minute the site is live at `https://<username>.github.io/<repository>/`. All paths are relative, so it works under that subfolder.
