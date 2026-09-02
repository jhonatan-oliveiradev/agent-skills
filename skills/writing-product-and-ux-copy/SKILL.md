---
name: writing-product-and-ux-copy
description: Use when writing interface labels, buttons, onboarding, forms, permissions, empty states, loading states, errors, confirmations, notifications, or other product text that helps a user understand state and take an action.
---

# Writing Product and UX Copy

## Overview

Treat interface text as part of product behavior. Good UX copy tells people where they are, what happened, what they can do next, and what a consequential action will cause.

## Start From the Product State

For each string or flow, identify:

- the user's current state and likely intent;
- the action available now;
- the system consequence of that action;
- prerequisites, irreversible effects, cost, permission, or data impact;
- the recovery path when something fails;
- nearby labels and terminology that must remain consistent.

Do not invent behavior to make a string sound cleaner. If the product state is unclear, surface the ambiguity to the implementer.

## Write by Component

- **Buttons and links:** use specific action language; the label should predict the next state.
- **Forms:** label the information requested, explain unusual requirements before failure, and keep helper text separate from validation feedback.
- **Errors:** state what failed in user-relevant terms, avoid blame, preserve useful detail, and give a recovery action when one exists.
- **Confirmations:** confirm the completed action and any next consequence; do not celebrate routine operations excessively.
- **Empty states:** distinguish first-use emptiness from no-results and error states; explain the most useful next action.
- **Loading and progress:** describe meaningful waiting only when it helps users understand whether work is continuing.
- **Permissions and consent:** explain what is requested, why it is needed, and what changes if the user declines.
- **Destructive actions:** name the affected object and consequence; do not hide irreversibility behind vague labels such as “Continue.”

## System Rules

1. Frontload the information needed to decide or recover.
2. Prefer common, concrete words over internal product terminology.
3. Keep the same concept named the same way across the flow.
4. Write for localization: avoid wordplay, ambiguous fragments, and layout-dependent instructions.
5. Do not rely on punctuation, color, iconography, or visual position as the only carrier of meaning.
6. Keep operational UI free from unnecessary sales pressure. Marketing copy may support a choice, but it must not obscure the actual system action.

## Boundary With Other Writing

Use `writing-conversion-copy` for marketing surfaces whose primary job is persuasion. Use `writing-brand-voice-and-messaging` to define the durable voice that this interface copy may inherit. Use `editing-for-clarity-and-tone` when the task is revising prose rather than specifying interaction text.

## Verification

Read the copy in state order, including failure and cancellation paths. Check that labels match actual controls, errors are actionable, destructive consequences are explicit, terminology is consistent, and the text still makes sense without relying on surrounding visual styling.

## Reference Signals

Microsoft's interface-writing guidance explicitly treats buttons, dialogs, errors, accessibility, and localization as usability concerns. Google documentation guidance reinforces direct language, scannability, accessibility, and globally understandable wording.
