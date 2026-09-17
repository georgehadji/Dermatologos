# Fonts

Greek subsets of EB Garamond and Manrope, committed because `lib/og.tsx` reads
them from disk at build time — Satori has no fallback that can draw Greek
glyphs, and the build must not depend on network access.

Both are licensed under the SIL Open Font License 1.1, which permits
redistribution:

- EB Garamond — Georg Duffner, Octavio Pardo
- Manrope — Mikhail Sharanda

The web pages themselves do not use these files; `next/font` self-hosts its own
optimised copies.
