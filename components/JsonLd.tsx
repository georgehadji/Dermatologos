/**
 * Renders a schema.org block.
 *
 * `<` is escaped to `<` before it reaches the DOM. JSON.stringify happily
 * emits the literal sequence `</script>` if it ever appears inside a string,
 * which would close the tag early and turn the rest of the payload into live
 * markup. Escaping the angle bracket is valid JSON and closes that door for
 * good, including for any content that later comes from a CMS.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
