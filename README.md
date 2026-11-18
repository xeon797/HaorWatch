# HaorWatch AI (হাওরওয়াচ এআই)

> **Geospatial AI Flood Monitoring & Agricultural Exposure Assessment for Bangladesh's Haor Ecosystems**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)

---

## Overview

**HaorWatch AI** is an AI-powered geospatial monitoring platform specifically engineered for Bangladesh's unique haor wetlands (starting with Hakaluki Haor in the Sylhet basin). It processes **Copernicus Sentinel-1 Synthetic Aperture Radar (SAR)** imagery to detect flood extents through cloudy and monsoon conditions, benchmarks a custom-trained **U-Net semantic segmentation** model against a conventional **Otsu SAR thresholding** baseline, excludes permanent water bodies via the **JRC Global Surface Water (GSW)** mask, and intersects flood polygons with **ESA WorldCover 10m** cropland datasets to estimate **potentially exposed agricultural land**.

### Core Principles
1. **Evidence Before Narrative:** Every metric is backed by stored satellite analysis runs.
2. **Transparent Uncertainty:** Clear sensor acquisition dates, held-out validation status, and pipeline provenance.
3. **Honest Agricultural Framing:** Estimates *potentially exposed agricultural land*—never claiming unverified crop loss or official compensation entitlement.
4. **Bilingual Accessibility:** Executive briefings provided in both Bengali (**বাংলা**) and English.

---

## Key Features

- **Executive Overview (`/`):** 60/40 visual split featuring an interactive Leaflet catchment mini-map, 4 core KPI cards (Detected Flood Extent, Potentially Exposed Cropland, Total Mapped Agriculture, Baseline Delta), and a metric-driven bilingual briefing strip.
- **Full-Bleed Map Explorer (`/map`):** Full-screen cartographic canvas (`calc(100vh - 70px)`) with dual basemaps (CartoDB Positron & Esri World Imagery Satellite), on-demand GeoJSON vector streaming, interactive U-Net vs. Otsu split-curtain swipe comparison, feature inspector popovers, and layer drawer with opacity sliders.
- **Model Evaluation & Accountability (`/evaluation`):** Rigorous held-out test dataset audit (Sen1Floods11 geographic holdout), Precision / Recall / F1 / IoU score bars, and side-by-side 2×2 confusion matrices comparing U-Net against Otsu thresholding.
- **Methodology & Provenance (`/methodology`):** Interactive 6-step radar processing pipeline diagram (Sentinel-1 Ingestion → Preprocessing → JRC Water Mask → Dual Flood Segmentation → ESA Cropland Overlay → Bilingual Briefing) and complete data provenance ledger.
- **Situation Briefing Report (`/report`):** Full-width 12-column situation dossier with one-click English/Bangla language switching, clipboard export, and print/PDF generation.

---

## Tech Stack

- **Framework:** React 18 + Vite (Strict Mode TypeScript)
- **Styling:** Tailwind CSS (Daylight Cartographic Editorial design system, Satoshi + Hind Siliguri typography)
- **Routing:** React Router v6 (Native View Transitions API)
- **Data Fetching & Caching:** TanStack Query v5
- **Mapping & GIS:** Leaflet + React-Leaflet
- **Icons:** Lucide React
- **Quality & Linting:** Oxlint, TypeScript Compiler (`tsc --noEmit`), Node test suite

---

## Project Structure

```text
HaorWatch/
├── docs/                             # Architecture, PRD, API contract, and flow specs
│   ├── api.md
│   ├── architecture.md
│   ├── design.md
│   ├── flows.md
│   ├── prd.md
│   └── schema.md
├── frontend/                         # React 18 + Vite + TypeScript application
│   ├── public/                       # Favicon, assets, and project logo
│   ├── src/
│   │   ├── components/               # Modular UI, layout, map, and evaluation components
│   │   ├── hooks/                    # TanStack Query custom hooks
│   │   ├── lib/                      # API client, safe formatters, and mock fixtures
│   │   ├── pages/                    # 5 Core Application Screens
│   │   │   ├── OverviewPage.tsx
│   │   │   ├── MapExplorerPage.tsx
│   │   │   ├── ModelEvaluationPage.tsx
│   │   │   ├── MethodologyPage.tsx
│   │   │   └── ReportPage.tsx
│   │   └── types/                    # Strict TypeScript API schemas
│   └── tests/                        # Unit tests for null-safe formatting functions
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/xeon797/HaorWatch.git
   cd HaorWatch
   ```

2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. Run tests, typecheck & build:
   ```bash
   npm test          # Run formatting unit assertions
   npm run typecheck # Run TypeScript strict validation
   npm run lint      # Run Oxlint
   npm run build     # Compile production bundle
   ```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
