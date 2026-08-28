# Catalog experience — Built with Skills record

Date: 2026-08-28

## Skills applied

- `designing-ui-systems`
- `building-premium-nextjs-interfaces`
- `building-conversion-product-pages`

## Decisions and outcomes

### Reuse the existing visual system

The catalog and detail pages use the microsite's semantic color tokens,
spacing rhythm, focus treatment, buttons, borders, and responsive breakpoints.
The implementation adds page-level compositions without creating a parallel
component library or one-off color system.

### Keep the server/client boundary narrow

Catalog data, localized detail content, metadata, related skills, installation
commands, and structured data are generated in Server Components. Client state
is limited to URL-backed catalog controls through `nuqs` and copy feedback for
commands and prompts.

### Organize details around the reader's decision

Each detail page leads with purpose and primary benefit, then answers when the
skill should and should not be used. Concrete use cases and prompts precede the
installation action. Compatibility, dependencies, packs, relations, version,
and canonical source remain visible without competing with the primary flow.

## Verifiable result

- 18 catalog skills are searchable and filterable in two locales.
- 36 localized skill detail pages are statically generated.
- Catalog URLs remain shareable through `nuqs` using the approved query keys.
- Bash and PowerShell commands are derived from each validated skill slug.
- Every detail page publishes localized metadata, language alternates, Open
  Graph data, and structured data.
