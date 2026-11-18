# Product Requirements Document — HaorWatch AI

## 1. App overview
HaorWatch AI is an AI-powered geospatial monitoring application for Bangladesh's haor ecosystems. It analyzes Sentinel-1 Synthetic Aperture Radar (SAR) imagery to map areas classified as flooded, compares a custom-trained machine-learning model with a conventional SAR thresholding baseline, masks permanent water where suitable reference data is available, and overlays flood extent with land-cover data to estimate potentially exposed agricultural land. Results are presented through an interactive map, transparent methodology and validation information, and concise Bangla/English summaries. It makes location-specific flood extent and agricultural exposure information easier to inspect than a generic rainfall or weather alert.

## 2. Problem statement
Haor regions in northeastern Bangladesh are vulnerable to seasonal and sudden flooding that can affect standing crops and local livelihoods. General weather alerts may indicate rainfall or flood risk, but do not necessarily show where water has spread or which agricultural areas overlap with detected flood extent. Remote locations and limited ground observations make spatially explicit assessment difficult.

The product addresses this information gap. It does not replace official warnings, field assessment, or disaster-management authorities.

## 3. Target audience
**Primary:** farmers and agricultural stakeholders; local authorities and disaster-response groups; researchers and students.
**Secondary:** NGOs and development organizations working in climate resilience and agriculture; technical reviewers and hackathon judges.

**User goals:** inspect the latest available flood map; understand agricultural land-cover overlap; compare ML with baseline; inspect dates, sources, model version, validation status, and limitations; read a clear Bangla explanation.

## 4. Product principles
1. Evidence before narrative: every displayed number comes from a stored analysis result.
2. Transparent uncertainty: show acquisition dates, sources, model version, and validation status.
3. No false urgency: never imply real-time warning capability.
4. Haor-specific framing: account for permanent and seasonal water.
5. Honest agricultural language: estimate potential exposure, not crop damage or financial loss.
6. Model accountability: compare ML and baseline on the same held-out evaluation set.

## 5. MVP core features — required
### A. Study area and overview
- One preconfigured pilot haor area. Hakaluki Haor is a candidate; confirm exact AOI geometry and name before seeding.
- Overview page with study area, latest analysis status, data-as-of timestamp, and acquisition date(s).
- KPI cards for detected flood extent, potentially exposed agricultural area, mapped agricultural area, and model metrics only when available.

### B. Flood analysis
- Load or ingest Sentinel-1 SAR imagery for a documented observation period.
- Train and use a custom U-Net semantic-segmentation model on suitable labelled Sentinel-1 flood data. U-Net is the primary custom ML model for the MVP; using only a pretrained model or thresholding is not an acceptable substitute for the planned custom-training work.
- Use Sen1Floods11 as the primary candidate training dataset, subject to an initial audit of access, license, label schema, polarization/input compatibility, and geographic/event split availability. Do not silently substitute another dataset; document any replacement and rationale.
- Use weak labels for training only if their semantics and quality are understood; reserve suitable hand-labelled samples and geographically/event-separated data for validation/testing where feasible.
- Generate a separate conventional SAR baseline (Otsu thresholding or documented change detection).
- Apply JRC Global Surface Water permanent-water mask where appropriate and available.
- Save ML and baseline masks separately.
- Record imagery identifiers, dates, bands/polarizations, preprocessing, thresholds, model version, and run status.

### C. Agricultural exposure
- Use ESA WorldCover and its documented product legend/version.
- Intersect detected flood extent with relevant agricultural/cropland class(es).
- Calculate study area, flood extent, mapped agricultural area, potentially exposed agricultural area, and exposed share.
- Compute area in a suitable projected CRS or with a defensible geodesic method; never calculate km² directly from longitude/latitude degrees.
- Label all agricultural results as **potential exposure estimates**, not verified damage.

### D. Evaluation and transparency
- Show precision, recall, F1, IoU, and confusion matrix only when calculated on valid labelled evaluation data.
- Evaluate ML and baseline on the same held-out samples and valid-pixel mask.
- Record test dataset, split strategy, sample count, date, and validation status.
- Validation status values: `not_available`, `internal_test_only`, `external_reference_checked`.
- Never invent or display placeholder metric values.

### E. Interactive map
- Study-area boundary and toggles for ML flood, baseline flood, agricultural exposure, permanent water, and reference layer where available.
- Legend, layer descriptions, acquisition date, method/model metadata.
- Handle missing layers and empty geometry gracefully.

### F. Reports
- Bangla summary by default; English optional.
- LLM may phrase stored results, but must not invent figures, forecasts, crop-loss claims, or unsupported causes.
- Deterministic template fallback if LLM provider fails.

### G. Frontend
- React application consumes the versioned REST API in `api.md`.
- Explicit loading, empty, partial-data, stale-data, and API-error states.

## 6. Acceptance criteria
1. Frontend retrieves study-area metadata and latest analysis.
2. At least one real or clearly labelled prepared analysis is available.
3. Map renders flood and agricultural exposure layers with legend.
4. ML and baseline are distinct and clearly labelled.
5. Data dates, provenance, model version, and caveats are visible.
6. Metrics appear only when genuinely calculated.
7. Permanent-water mask status is explicit.
8. Agricultural result says “potentially exposed”.
9. Bangla report works, including template fallback.
10. No claims of forecasting, verified crop loss, or emergency warning.

## 7. Out of scope
- Flood forecasting, water-level prediction, SMS/push alerts.
- Crop damage, yield loss, or financial-loss estimation.
- Nationwide coverage or arbitrary AOI selection.
- Accounts, login, password reset, roles, multi-tenant workspaces.
- User-uploaded imagery or arbitrary raster jobs.
- Field surveys, farmer registration, personal data collection.
- Payments, subscriptions, chatbot-first interface, agentic workflows.
- Real-time satellite streaming.
- Guarantee that ML outperforms thresholding.
- Train large foundation models or perform nationwide model training.

## 8. Risks and caveats
- Public flood labels may not represent haor conditions; geographic generalization must be tested.
- Permanent and seasonal water may be confused.
- SAR can struggle with flooded vegetation and rough water surfaces.
- Sentinel-1 revisit intervals can miss a short-lived flash-flood peak.
- WorldCover cropland does not identify Boro rice specifically.
- Without ground truth, do not claim verified local accuracy.
- Copernicus EMS/UNOSAT maps or cloud-free Sentinel-2 may be reference evidence only when date, extent, and semantics match.

## 9. Demo success measures
A complete data-to-map workflow for one study area; a reproducibly trained U-Net checkpoint and inference pipeline; a separate Otsu baseline; honest metric comparison on held-out labelled data if valid labels exist; understandable exposure estimate; visible provenance and limitations; no unsupported quantitative claims.
