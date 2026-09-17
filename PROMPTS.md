# Image prompts

Every file in `public/images/` is currently a generated placeholder. Replace each
one with a real image, **keeping the exact filename** — the paths are referenced
from `lib/site.ts` and `components/sections/DoctorIntro.tsx`.

Paste a prompt into ChatGPT (image generation), Midjourney, or any comparable
tool. The art direction below matches the site: warm off-white `#F7F5F0`, deep
ink `#10161A`, one petrol-teal accent `#145E58`, soft daylight, no clutter.

**House style — append to every prompt:**

> Editorial architectural photography, natural soft daylight from a large window,
> warm off-white walls, shallow depth of field, calm and uncluttered, muted
> colour palette of bone white and deep petrol green, no text, no logos, no
> watermarks, no visible brand names, photorealistic, 35mm lens look, high
> dynamic range but gentle contrast.

---

## `doctor-portrait.png` — 4:5 portrait

> Editorial portrait of a Greek male dermatologist in his late fifties, short
> grey hair, calm confident expression, light stubble, wearing a crisp white
> medical coat over a navy shirt, no tie. Standing three-quarter turned toward
> the camera in a bright minimal consultation room, hands relaxed. Warm off-white
> wall behind with a single soft shadow. Shot at eye level, 85mm, aperture f/2,
> background gently out of focus. Vertical 4:5 crop with headroom above.

Alternatives worth generating so there is a choice:

- **Seated at the desk** — > …seated at a pale oak desk, one hand resting near a
  dermatoscope, looking up toward the camera as if a patient has just walked in.
- **At work, no eye contact** — > …in profile, examining a dermatoscope under a
  task light, fully absorbed, shot from slightly behind the shoulder.

> **Note.** This is a portrait of a real, named physician. Whatever image is used
> here is presented to patients as him. Swapping in a real photograph, or a
> clearly non-identifying image (hands, silhouette, room detail), is the only way
> the page is accurate.

---

## `clinic-01.png` — the entrance · 4:5 portrait

> The entrance of a small private dermatology practice on a quiet Greek suburban
> street. Pale plaster façade, a plain glass door with a slim dark frame, a
> single olive tree in a large terracotta pot beside it, three low stone steps.
> Late afternoon light raking across the wall. Shot straight on from the
> pavement, vertical composition.

## `clinic-02.png` — reception · 4:5 portrait

> Reception area of a minimal medical practice. Pale oak desk with a rounded
> front, a single small vase with one dried branch, a closed laptop, nothing
> else on the surface. Warm off-white wall behind, one recessed shelf. Soft
> daylight from the left. No people. Vertical composition.

## `clinic-03.png` — the waiting area · 4:5 portrait

> Waiting area of a small clinic: three linen-upholstered chairs in oatmeal
> against an off-white wall, a low travertine side table with two neatly stacked
> journals, a tall potted olive plant in the corner, pale oak floor. Large
> window out of frame casting a soft rectangle of light on the floor. Empty,
> quiet, vertical composition.

## `clinic-04.png` — the examination room · 4:5 portrait

> Dermatology examination room. A clean examination couch with fresh white
> paper, a stainless adjustable examination lamp angled down, a small trolley
> with neatly arranged instruments, pale cabinetry. Cool clinical cleanliness
> warmed by daylight. Deep petrol-green detail on a single cabinet door. No
> people, no visible branding, vertical composition.

## `clinic-05.png` — dermatoscope, macro · 4:5 portrait

> Extreme close-up of a handheld dermatoscope resting on a clean pale surface,
> its glass lens catching a soft highlight, knurled metal barrel, a faint teal
> reflection in the optics. Very shallow depth of field, macro lens, the rest of
> the frame falling into soft neutral blur. Vertical composition.

> This one carries the site's lens interaction, so a sharp, high-detail file
> matters more here than anywhere else.

## `clinic-06.png` — corridor detail · 4:5 portrait

> Quiet corridor inside a small medical practice. Off-white wall, a single
> half-open pale oak door, a slim brushed-steel handle, warm daylight spilling
> through the gap onto the floor. Almost abstract, mostly empty frame, strong
> sense of calm. Vertical composition.

---

## `og-background.png` — 1200 × 630 landscape

Used as the backdrop of every social preview card. It sits behind a light wash,
so it must be **calm and low contrast** — a busy image turns the headline to
mush.

> Wide, quiet interior of a minimal dermatology practice, shot from a low angle.
> Off-white wall filling the left two thirds, an olive plant and a sliver of
> window light on the right. Deliberately understated, low contrast, generous
> empty space on the left for text. Landscape 1200×630.

Check the result at `/opengraph-image` after rebuilding.

---

## After swapping the files

```bash
npm run build
```

Two things worth doing to the real photographs first:

- Resize the clinic images to about 1400 px on the long edge. Anything larger is
  wasted — they are never displayed bigger.
- Convert to WebP and update the extensions in `lib/site.ts`. PNG photographs are
  roughly four times the size for no visible gain.

To regenerate the placeholders at any point:

```bash
npm run placeholders
```
