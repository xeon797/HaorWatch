# APIs, Security & Integrations — HaorWatch AI

Base path: `/api/v1`. All timestamps UTC ISO-8601. JSON unless GeoJSON endpoint. Backend is source of truth. Null means unavailable; zero means measured zero.

## 1. Error format
```json
{
  "error": {
    "code": "ANALYSIS_NOT_FOUND",
    "message": "No analysis is available for this study area.",
    "request_id": "optional-correlation-id"
  }
}
```

## 2. Endpoints

### Health
`GET /health`
```json
{
  "status": "ok",
  "service": "haorwatch-api",
  "version": "0.1.0",
  "timestamp": "2026-11-18T00:00:00Z"
}
```

### List study areas
`GET /study-areas`
```json
{
  "items": [{
    "id": "uuid",
    "slug": "pilot-haor",
    "name": "Pilot Haor Study Area",
    "division": "Sylhet",
    "districts": [],
    "country_code": "BD",
    "area_km2": null,
    "bounds": [91.0, 24.0, 92.0, 25.0],
    "is_active": true
  }]
}
```
Bounds order is `[west,south,east,north]`; example coordinates are illustrative only.

### Study area detail
`GET /study-areas/{slug}`
Returns `id`, `slug`, `name`, `division`, `districts`, `country_code`, `area_km2`, `boundary_geojson`, and `metadata`. Geometry must be actual AOI or omitted if unavailable.

### Latest analysis
`GET /study-areas/{slug}/analyses/latest`
```json
{
  "id": "uuid",
  "study_area": {"slug": "pilot-haor", "name": "Pilot Haor Study Area"},
  "status": "completed",
  "analysis_label": "Latest available observation",
  "observation_start": "2026-05-01T00:00:00Z",
  "observation_end": "2026-05-13T00:00:00Z",
  "created_at": "2026-11-18T00:00:00Z",
  "completed_at": "2026-11-18T00:00:00Z",
  "progress_percent": 100,
  "progress_message": null,
  "is_stale": false,
  "model": {"name": "HaorWatch Flood Classifier", "version": "0.1.0"},
  "baseline": {"method": "otsu_thresholding", "display_name": "Otsu SAR Thresholding"},
  "permanent_water_mask": {"applied": true, "source": "JRC Global Surface Water", "threshold": null, "note": null},
  "validation": {"status": "not_available", "note": "No independent reference layer was available."},
  "summary": {
    "study_area_km2": null,
    "detected_flood_area_km2": null,
    "baseline_flood_area_km2": null,
    "mapped_agricultural_area_km2": null,
    "potentially_exposed_agricultural_area_km2": null,
    "potentially_exposed_agricultural_share_percent": null,
    "valid_pixel_count": null,
    "nodata_pixel_count": null
  },
  "available_layers": ["study_area", "ml_flood", "baseline_flood", "agricultural_exposure"]
}
```
Example values are schema examples, not real findings. If none exists, return 404 `ANALYSIS_NOT_FOUND`.

### List analyses
`GET /study-areas/{slug}/analyses?limit=10`
```json
{"items":[{"id":"uuid","status":"completed","analysis_label":"Observation period label","observation_start":null,"observation_end":null,"created_at":"2026-11-18T00:00:00Z","completed_at":null}],"total":1}
```

### Analysis detail
`GET /analyses/{analysis_id}`
Returns the latest-analysis object plus full provenance/configuration.

### Layer catalogue
`GET /analyses/{analysis_id}/layers`
```json
{
  "analysis_id": "uuid",
  "layers": [{
    "layer_key": "ml_flood",
    "display_name": "ML-detected flood extent",
    "available": true,
    "format": "geojson",
    "area_km2": null,
    "feature_count": null,
    "source_date": null,
    "model_version": "0.1.0",
    "description": "Flood-class pixels from custom ML model after configured masking."
  },{
    "layer_key": "baseline_flood",
    "display_name": "Thresholding baseline",
    "available": true,
    "format": "geojson",
    "area_km2": null,
    "feature_count": null,
    "source_date": null,
    "model_version": null,
    "description": "Flood-class pixels from documented SAR thresholding baseline."
  },{
    "layer_key": "agricultural_exposure",
    "display_name": "Potentially exposed agricultural land",
    "available": true,
    "format": "geojson",
    "area_km2": null,
    "feature_count": null,
    "source_date": null,
    "model_version": null,
    "description": "Intersection of detected flood extent and selected agricultural land-cover classes."
  },{
    "layer_key": "permanent_water",
    "display_name": "Permanent water mask",
    "available": false,
    "format": "geojson",
    "area_km2": null,
    "feature_count": null,
    "source_date": null,
    "model_version": null,
    "description": "Unavailable for this run."
  }]
}
```

### GeoJSON map layer
`GET /analyses/{analysis_id}/layers/{layer_key}`
Returns `application/geo+json` FeatureCollection:
```json
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "id": "feature-id",
    "geometry": {"type": "MultiPolygon", "coordinates": []},
    "properties": {"layer_key": "ml_flood", "area_km2": null, "class_name": "flood"}
  }]
}
```
Coordinates are illustrative placeholders. Return actual valid geometry. Supported keys: `study_area`, `ml_flood`, `baseline_flood`, `agricultural_exposure`, `permanent_water`, `validation_reference`. If unavailable, return 404 `LAYER_NOT_AVAILABLE`. Simplify geometry for browser if large; retain full raster internally.

### Evaluation metrics
`GET /analyses/{analysis_id}/metrics`
```json
{
  "analysis_id": "uuid",
  "validation_status": "internal_test_only",
  "positive_class": "flood",
  "test_dataset": {
    "name": "Public labelled flood dataset",
    "version": null,
    "split_strategy": "geographic_or_event_holdout",
    "test_pixel_count": null
  },
  "methods": [{
    "method_key": "custom_ml",
    "method_name": "Custom ML Model",
    "precision": null, "recall": null, "f1": null, "iou": null,
    "confusion_matrix": {"true_positive": null, "false_positive": null, "true_negative": null, "false_negative": null},
    "evaluated_at": null, "notes": null
  },{
    "method_key": "otsu_baseline",
    "method_name": "Otsu SAR Thresholding",
    "precision": null, "recall": null, "f1": null, "iou": null,
    "confusion_matrix": {"true_positive": null, "false_positive": null, "true_negative": null, "false_negative": null},
    "evaluated_at": null, "notes": null
  }],
  "limitations": ["Public training labels may not fully represent haor conditions."]
}
```
Null metrics mean unavailable, not zero. If no evaluation, methods may be empty and status `not_available`.

### Data sources/provenance
`GET /analyses/{analysis_id}/sources`
```json
{
  "analysis_id": "uuid",
  "sources": [{
    "dataset_key": "sentinel1_sar",
    "display_name": "Sentinel-1 SAR",
    "provider": "Copernicus",
    "role": "Flood detection input imagery",
    "version": null, "acquired_at": null,
    "period_start": null, "period_end": null,
    "resolution_m": null, "crs": null, "source_url": null,
    "status": "used", "notes": null
  },{
    "dataset_key": "jrc_gsw",
    "display_name": "JRC Global Surface Water",
    "provider": "European Commission Joint Research Centre",
    "role": "Permanent-water exclusion mask",
    "version": null, "acquired_at": null,
    "period_start": null, "period_end": null,
    "resolution_m": null, "crs": null, "source_url": null,
    "status": "used", "notes": null
  },{
    "dataset_key": "esa_worldcover",
    "display_name": "ESA WorldCover",
    "provider": "European Space Agency",
    "role": "Agricultural land-cover overlay",
    "version": null, "acquired_at": null,
    "period_start": null, "period_end": null,
    "resolution_m": 10, "crs": null, "source_url": null,
    "status": "used", "notes": "Land-cover class is not crop-specific."
  }]
}
```
Include only sources actually used. `status`: used/unavailable/reference_only.

### Report
`GET /analyses/{analysis_id}/reports/{language}` where language is `bn` or `en`.
```json
{
  "analysis_id": "uuid",
  "language": "bn",
  "generation_method": "template",
  "status": "completed",
  "title": "হাওর এলাকার বন্যা ও কৃষিজমির সম্ভাব্য ঝুঁকি",
  "body": "Report text generated from stored analysis values.",
  "created_at": "2026-11-18T00:00:00Z",
  "data_as_of": null,
  "caveats": ["এই ফলাফল সম্ভাব্য কৃষিজমির সংস্পর্শ নির্দেশ করে; নিশ্চিত ফসলের ক্ষতি নয়।"]
}
```

### Trigger analysis (optional/operator only)
`POST /admin/analyses` with `X-Operator-Key: <secret>`.
Request:
```json
{
  "study_area_slug": "pilot-haor",
  "observation_start": "2026-05-01T00:00:00Z",
  "observation_end": "2026-05-15T00:00:00Z",
  "run_ml": true,
  "run_baseline": true,
  "run_exposure": true
}
```
Returns `202`:
```json
{"analysis_id":"uuid","status":"queued","message":"Analysis request accepted."}
```
Protect with operator key. If no queue is implemented, omit this endpoint and run pipeline via CLI.

## 3. Third-party integrations
- **Sentinel-1:** obtain SAR via confirmed route such as Google Earth Engine or Copernicus Data Space. Record product IDs, acquisition date, polarization, orbit, preprocessing.
- **Sen1Floods11:** primary candidate training dataset for the custom U-Net model. Verify and record the exact release, access/license terms, label semantics, VV/VH compatibility, and split strategy before training; distinguish hand-labelled and weakly-labelled samples.
- **JRC Global Surface Water:** permanent-water mask; record product and threshold.
- **ESA WorldCover:** land-cover overlay; record version and class mapping.
- **Copernicus EMS / UNOSAT:** optional independent reference maps if spatially and temporally matched.
- **Sentinel-2:** optional cloud-free reference proxy, not automatically ground truth.
- **LLM:** optional Gemini or another provider. Send structured results only. Prompt must prohibit invented values, forecasting, crop-loss claims, and unsupported causes. Validate or use template fallback.
- **Map tiles:** frontend may use OSM-compatible provider; comply with attribution and usage policy.

## 4. Security
- No public user auth in MVP.
- Operator analysis trigger must use server-side secret.
- Never commit `.env`, credentials, private data, or large model weights.
- Validate slugs and paths; never accept arbitrary filesystem paths from client.
- Restrict CORS to known frontend origins.
- Rate-limit public report generation and operator endpoints if exposed.
- Sanitize LLM output; render safe text/Markdown, never raw HTML.
- Do not expose stack traces, internal paths, database URLs, or provider tokens.
- Use HTTPS in deployment.

## 5. Environment variables

Backend `.env.example`:
```env
APP_ENV=development
APP_NAME=HaorWatch AI API
API_V1_PREFIX=/api/v1
HOST=0.0.0.0
PORT=8000
LOG_LEVEL=INFO
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/haorwatch
CORS_ORIGINS=http://localhost:5173
DATA_ROOT=./data
MODEL_ROOT=./models
DEFAULT_STUDY_AREA_SLUG=pilot-haor
OPERATOR_API_KEY=replace-with-long-random-secret

GOOGLE_EARTH_ENGINE_PROJECT=
COPERNICUS_CLIENT_ID=
COPERNICUS_CLIENT_SECRET=

LLM_PROVIDER=none
GEMINI_API_KEY=
GEMINI_MODEL=
```
Frontend `.env.example`:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_ENV=development
```
Never put secrets in `VITE_` variables; they are exposed to browser.

## 6. Status codes
200 success; 202 accepted async run; 400 malformed request; 401 missing/invalid operator key; 403 forbidden; 404 resource/layer missing; 422 validation; 429 rate limit; 500 safe unexpected error; 503 provider unavailable.

## 7. Frontend integration checklist
- Use `VITE_API_BASE_URL`.
- Call health, study areas, latest analysis.
- Fetch layer catalogue before rendering toggles.
- Fetch GeoJSON only for available layers.
- Fetch metrics and sources independently so one failure does not blank entire dashboard.
- Fetch report by selected language.
- Render null as unavailable, not zero.
- Show stale flag, mask status, and validation status.
- Handle the standard error envelope consistently.
