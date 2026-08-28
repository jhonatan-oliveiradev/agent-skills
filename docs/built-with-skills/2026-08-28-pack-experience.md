# Pack experience — Built with Skills record

Date: 2026-08-28

## Skills applied

- `designing-ui-systems`
- `building-premium-nextjs-interfaces`
- `building-conversion-product-pages`

## Decisions and outcomes

### Give active and planned packs different product roles

Active packs are installable collections with ordered skill composition and a
concrete operating-system command. Planned packs are roadmap content. They
explain direction and expected outcomes without displaying disabled controls,
empty commands, or misleading installation actions.

### Derive every page from catalog facts

Names, status, summaries, descriptions, outcomes, version, color, order, and
membership come from the generated catalog. Pack installation commands are
derived from the validated slug only when the catalog marks the pack active.

### Preserve one visual system while expressing pack identity

The interface reuses existing surfaces, borders, typography, spacing, focus,
buttons, skill cards, and responsive breakpoints. A scoped pack accent token
expresses catalog color without creating six separate component variants.

## Verifiable result

- Six localized pack index entries are published in each language.
- Twelve localized pack detail pages are statically generated.
- Three active packs provide Bash and PowerShell installation commands.
- Three planned packs publish roadmap information with no install action.
- Member skills link to their localized detail pages in catalog order.
