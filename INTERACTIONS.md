# Interaction system

The site belongs to a walk-in dermatology practice. Most visitors arrive with a
symptom and a question, on a phone, and leave once they have the number or the
address. Every interaction below is judged against that: it either helps someone
find those two things, or it earns its place by making the practice feel careful.
Nothing here exists to be admired.

---

## 1. Timing

One scale, defined in `app/globals.css` and used everywhere. Duration follows
distance travelled, not importance.

| Token | Value | Used for |
|---|---|---|
| `--dur-tap` | 90ms | Press feedback. Must read as contact, not animation. |
| `--dur-quick` | 180ms | Colour, opacity, border. Nothing moves. |
| `--dur-base` | 320ms | Hover transforms over a short distance. |
| `--dur-slow` | 560ms | Indicators and panels that travel. |
| `--dur-page` | 900ms | Entrances and scroll reveals. |

Three helper classes pair with an explicit Tailwind `transition-*`, so the
property list stays visible at the call site while the timing stays central:
`.t-quick`, `.t-base`, `.t-slow`.

**Easing.** Entrances decelerate, exits accelerate.

| Token | Curve | Used for |
|---|---|---|
| `--ease-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Anything arriving. |
| `--ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` | Hover movement. |
| `--ease-in-quart` | `cubic-bezier(0.5, 0, 0.75, 0)` | Anything leaving. |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Colour and neutral changes. |

Only `transform`, `opacity` and `filter` are animated. Width, height, `top` and
`left` are never animated, because they force layout on every frame.

---

## 2. The four states

Every interactive element answers in all four. A control that only has a hover
state does not exist on a phone.

1. **Rest.** Readable without any cue that it is interactive being necessary.
2. **Hover.** Fine pointers only. Tailwind v4 already scopes `hover:` behind
   `@media (hover: hover)`, so a tap never leaves a stuck hover state.
3. **Focus-visible.** A 2px accent outline at 3px offset, set once globally. No
   component removes it. The contact form used to, via `outline-none`, and a
   1px border colour change is not a substitute.
4. **Press.** `.press` scales to 0.97 over `--dur-tap`. Wide elements use
   `.press-sm` at 0.99, because 0.97 on a full-width bar looks like a fault.

---

## 3. Per element

**Custom cursor** (`components/Cursor.tsx`) — a 6px dot that tracks tightly at
120ms and a ring that lags at 550ms. The lag is the whole point: it signals
direction of travel. The ring resizes by mode, read from `data-cursor` on the
element under the pointer: 32px at rest, 56px over a link or a phone number,
full size over the dermatoscope. Holding the pointer down contracts the ring to
78%, so a click has a physical answer. Fine pointers only, and off entirely
under reduced motion — the native cursor is never hidden without a replacement.

**Magnetic buttons** (`components/Magnetic.tsx`) — the primary call action pulls
toward the pointer at up to 14px with an elastic release. Used on exactly two
elements site-wide. A page where everything is magnetic is a page where nothing
is emphasised.

**Links in prose** — `.link-line` grows an underline from the leading edge over
`--dur-base` using `background-size`, which composites. Links that are already
underlined invert: the line retracts. Both are the same gesture read two ways.

**Navigation** — the header hides on scroll down and returns on scroll up, one
tween per animation frame rather than one per scroll event. The current page
carries `aria-current`. Below `lg` the header collapses into a full-screen
overlay that is a real `nav` landmark, traps nothing but makes everything behind
it `inert`, closes on Escape, and returns focus to the button that opened it.
Menu items rise in sequence at 60ms intervals — the only decorative stagger on
the site, because it covers the panel's own transition.

**Cards and rows** (conditions, articles, gallery) — the whole row is the
target, never a "read more" link inside it. On hover the title slides 8–12px
toward the reader and an arrow fades in from behind it. On touch the same row
gets press feedback instead.

**Dermatoscope lens** (`components/LensReveal.tsx`) — on a fine pointer the lens
dilates from 0 to 110px as the pointer enters and follows it, revealing a
magnified, contrast-boosted copy of the image. The radius is a registered CSS
custom property, so it interpolates instead of popping. On touch there is no
hover, so the lens opens where the finger lands, stays put, and a second tap
closes it. A label reading "Πατήστε για μεγέθυνση" appears only where hover is
unavailable.

**3D layers** — three shader canvases: subsurface light in the hero, a particle
field behind the conditions grid, caustics in the footer. Each one mounts only
when it first comes near the viewport, parks its animation loop when scrolled
away, falls back to a CSS gradient if the context is lost, and never mounts at
all under reduced motion or without WebGL. The hero shader is masked so that
light only falls where there is no type: a column on the right at desktop
widths, a band above the headline on narrow ones.

**Scroll** — Lenis drives scrolling from the GSAP ticker, so pinned sections and
scroll triggers read positions in the same frame. A progress arc in the corner
doubles as back-to-top past 600px. Content reveals are CSS keyframes triggered
by IntersectionObserver, never GSAP `from()` — a `from()` tween writes the
hidden state immediately, so any failure between creation and playback leaves
content invisible forever. The worst case here is "no animation", never "no
content".

**Forms** (`components/ContactForm.tsx`) — labels float on focus or when the
field holds a value, and remain real `label` elements. Required fields carry
`required` and `aria-required`. Errors appear under the field, are announced
through `role="alert"`, and are wired to their input through `aria-invalid` and
`aria-describedby`. Submission moves through sending, sent and error states; the
success state replaces the form rather than sitting above it.

**Mobile call bar** — below `md`, where the header carries no phone number, a
bar slides up past 600px of scroll with the number and a map link. It is `inert`
while off-screen, so it is never a hidden tab stop.

---

## 4. Touch

Nothing on the site requires hover to be usable. Every hover behaviour has a
tap, press or always-visible equivalent: the lens opens on tap, the cursor
simply does not exist, magnetic pull is skipped, and cards answer with press
feedback. Targets are at least 44×44px with 8px of separation.

No custom gestures. No swipe-to-do-anything. Scroll is scroll.

---

## 5. Reduced motion

`prefers-reduced-motion: reduce` disables the preloader, the custom cursor,
magnetic pull, smooth scroll, all GSAP timelines, the header's hide-on-scroll,
every entrance keyframe and all three WebGL canvases. What remains is the same
site with instant state changes. Colour and focus feedback are never removed —
they are information, not decoration.
