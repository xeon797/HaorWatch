# HaorWatch AI — Frontend Developer Package

This package is specifically for the **frontend workstream**. It contains the full product and backend contract so the interface can accurately represent the system.

## Your responsibility
Build the complete frontend experience and integrate it with the backend API described in `api.md`.

## Full creative freedom for UI/UX
You own the visual direction and interface design. There is **no prescribed palette, typography, spacing system, page layout, navigation pattern, component style, or dashboard template**.

Create an original, polished interface that communicates flood intelligence and agricultural exposure in the context of Bangladesh's haor regions. You may explore map-first, editorial, data-storytelling, or other approaches. Avoid defaulting to a generic admin dashboard unless you believe it is the strongest solution.

You decide:
- Visual identity, colors, typography, spacing, and design tokens.
- Information architecture, navigation, page composition, and responsive behavior.
- Map presentation, layer controls, legends, charts, cards, and report presentation.
- Component patterns, interactions, transitions, and micro-interactions.
- How to make the experience clear, distinctive, accessible, and usable.

Do not interpret this creative freedom as permission to change product functionality or invent data.

## What is fixed and must be respected
- `prd.md` defines required product scope and acceptance criteria.
- `architecture.md` describes the system and intended frontend/backend boundaries.
- `schema.md` explains the underlying data model.
- `flows.md` defines required user journeys and important edge cases.
- `api.md` is the authoritative API contract. Do not silently rename fields, change endpoint paths, or assume undocumented response properties.

You may organize and present the required functionality creatively, but preserve its meaning and behavior.

## Required UX/data behavior
- Show real backend data. If using fixtures while the backend is unavailable, clearly label them as demo/mock data.
- Never fabricate statistics, charts, map polygons, dates, validation scores, or analysis results.
- Distinguish ML flood detection, thresholding baseline, and reference layers visually and in labels.
- Distinguish unavailable (`null`/missing) from measured zero.
- Include loading, empty, partial-data, stale-data, and error states.
- Make observation/acquisition dates, data provenance, model/method information, and limitations discoverable.
- Describe agricultural output as **potentially exposed agricultural area**, not confirmed crop damage.
- Do not present the platform as a flood forecasting or emergency-warning service.
- Handle unavailable map layers without drawing invented geometry.
- Support Bangla and English report content as specified by the API.

## Suggested implementation stack
React + Vite + TypeScript, Tailwind CSS, React Router, TanStack Query, and Leaflet/React-Leaflet or MapLibre are suggested options, not mandatory design constraints. You may choose alternatives if they improve the result and remain compatible with the API.

## Integration workflow
1. Review all specification files before implementation.
2. Build against the exact API contract in `api.md`.
3. Until backend endpoints are ready, use local fixtures that match the documented response shapes exactly.
4. Keep API access behind a small typed client/service layer.
5. Coordinate any proposed API contract changes with the backend developer before relying on them.

Your goal is a distinctive, production-quality interface with full creative ownership of the design, while preserving the specified product capabilities and data integrity.

## Model terminology to display
The MVP's primary custom model is a trained U-Net segmentation model. The conventional comparison method is Otsu thresholding. Present them as separate methods/layers, and display model version, dataset/label provenance, acquisition date, and evaluation status only when supplied by the backend.
