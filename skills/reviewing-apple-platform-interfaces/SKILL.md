---
name: reviewing-apple-platform-interfaces
description: Use when reviewing or refining an iOS, iPadOS, or macOS app interface against current Apple Human Interface Guidelines, including native, Flutter, React Native, Tauri, or Electron implementations.
---

# Reviewing Apple Platform Interfaces

## Scope

Review an app for the Apple platforms it actually targets. Apply Apple platform conventions to iOS, iPadOS, and macOS apps; apply only transferable accessibility and design principles to a website. Do not treat an Apple-inspired appearance as a requirement to imitate system controls. This method evaluates an existing experience; use `designing-ui-systems` to establish a reusable design system or `auditing-pixel-perfect-frontend` to compare implementation against an approved reference.

## Review workflow

1. Identify the platform, framework, audience, screen's job, and available evidence: running app, code, video, screenshot, or design file. Record which interactions and states cannot be observed. Review both compact and expanded layouts when the app supports them.
2. Open the *current* Apple Human Interface Guidelines through [the topic map](references/apple-guidelines.md). Read the platform overview, accessibility, layout, and the pages for controls and flows actually present. Use the page's current guidance rather than recalled numbers or bundled excerpts. If a page is unavailable, mark its requirements unverified.
3. Walk the task from entry to completion. Check navigation, control placement, labels, focus and input, empty/loading/error states, destructive actions, undo and permission timing. On mobile, inspect safe areas, text enlargement, orientation and accessible touch interaction. On macOS, inspect window resizing, keyboard, menus and pointer behavior. Translate a platform behavior into the actual framework's capabilities before prescribing code.
4. Verify accessibility using evidence: screen-reader labels and order, dynamic text sizing, readable contrast from source colors, keyboard access when applicable, motion settings and alternate appearance. Measure numeric claims from real values or a running UI; a screenshot alone does not establish compliance.
5. Separate a platform convention from a design preference. Keep the product's own type, color and visual character where platform behavior permits. Diagnose whether the interface communicates the task clearly before recommending decorative changes.
6. Prioritize fixes by impact and confidence. For each finding include the observed behavior, location, relevant Apple page and heading or principle, why it applies to this platform, a concrete change in the user's framework, and a verification step. State uncertainty when source or behavior cannot be checked.

## Result

Provide a short assessment, then actionable findings ordered by severity: blocked task or accessibility, confusing platform behavior, and polish. Include what already works and what remains unverified. Link to the relevant official guideline for each platform-specific claim. Do not describe a design as Apple-certified, officially endorsed, or fully compliant on the basis of a static review.

## Boundary

Apple updates its guidance. Do not copy or redistribute its pages as part of this skill, and do not assert fixed values such as contrast thresholds or minimum target sizes without verifying the applicable current source and context. For Android or general web apps, avoid imposing iOS or macOS navigation and material conventions unless the user's product explicitly requires them.
