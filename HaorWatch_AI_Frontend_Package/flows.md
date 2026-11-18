# User Flows & Edge Cases — HaorWatch AI

## 1. Entry and authentication
MVP has no sign-up/login. User opens the public dashboard. Frontend loads API health, configured study area, and latest analysis. If no run exists, show “No analysis available yet”. Any future operator-only action stays separate from public viewer UI.

## 2. Overview flow
1. Open `/`.
2. Request `GET /api/v1/health`.
3. Request `GET /api/v1/study-areas`.
4. Select configured pilot area (one in MVP).
5. Request `GET /api/v1/study-areas/{slug}/analyses/latest`.
6. If completed, render KPIs, timestamps, model, mask, and validation status.
7. If processing, show only backend-reported status/progress.
8. If no run, show explanatory empty state.
Success: user understands latest available observation, flood estimate, agricultural exposure estimate, and caveats.

## 3. Map explorer flow
1. Open `/map`.
2. Load latest analysis.
3. Request layer catalogue.
4. Fetch GeoJSON only for available layers, preferably on demand.
5. Fit map to study-area bounds.
6. Toggle ML flood, baseline, agricultural exposure, permanent water, and reference layer.
7. Update legend to visible layers.
8. Feature popup uses only returned properties.
Success: user can see spatial flood output and land-cover overlap.

## 4. Model evaluation flow
1. Open `/evaluation`.
2. Fetch analysis detail and metrics.
3. Render ML and baseline on same metric scale.
4. Show test dataset, split strategy, test count, evaluation date, validation status.
5. If metrics missing, show “Evaluation not available”.
6. Distinguish internal held-out testing from external reference validation.
Success: user can explain model contribution and whether it improves over baseline.

## 5. Methodology flow
1. Open `/methodology`.
2. Fetch sources and processing configuration.
3. Show pipeline: satellite → preprocessing → permanent-water mask → baseline → custom ML → exposure overlay → validation/report.
4. Show sources actually used, their version/date/status.
5. Show limitations.
6. Missing sources must be labelled unavailable, not used.

## 6. Report flow
1. Open `/report`.
2. Fetch report for selected analysis and language.
3. Default to Bangla (`bn`); allow English (`en`).
4. Show figures, units, acquisition date, source and caveats.
5. If LLM failed, show template report and label it as such.
6. Clipboard failure must not crash page.

## 7. Optional operator analysis flow
1. Operator submits configured study area and observation period through protected endpoint or CLI.
2. Validate request and create queued/processing run.
3. Resolve inputs and record provenance.
4. Preprocess and align rasters.
5. Apply permanent-water mask if configured.
6. Run baseline and custom ML independently.
7. Evaluate against held-out labels if available.
8. Intersect flood and agricultural masks; calculate area.
9. Persist layers, summary, metrics, provenance, report.
10. Mark completed; on error mark failed with safe message.
If end-to-end processing cannot be completed in MVP, load a prepared analysis bundle but clearly label it prepared/precomputed.

## 8. Edge-case behavior

| Condition | Backend | Frontend |
|---|---|---|
| No study area | empty list | setup/unavailable state |
| No analysis | 404 `ANALYSIS_NOT_FOUND` | no-analysis state |
| Processing | status/progress | show status; poll conservatively |
| Failed | safe code/message | error state; retry only if supported |
| Missing map layer | `available=false` | hide/disable toggle |
| Missing JRC mask | mask applied false | visible caveat |
| No external validation | status not_available | neutral “No external validation” |
| Missing metrics | null/empty | “Not evaluated”, not zero |
| LLM failure | template fallback or unavailable | label template summary |
| Raster nodata | exclude and count | show coverage note if available |
| Invalid geometry | reject/omit and log | layer error, map remains usable |
| Old acquisition | return timestamp/stale flag | “Older observation” |
| Null area | return null | “Not available” |
| API timeout | standard error | retry option |
| Unsupported language | 422 | retain previous language |
| Unauthorized operator | 401/403 | access denied |

## 9. Error envelope
```json
{
  "error": {
    "code": "ANALYSIS_NOT_FOUND",
    "message": "No analysis is available for this study area.",
    "request_id": "optional-correlation-id"
  }
}
```
Never expose tracebacks, secrets, internal paths, or provider credentials.

## 10. UI wording
Use: “Detected flood extent”, “Potentially exposed agricultural area”, “Latest available satellite observation”, “External validation unavailable”, “Estimated land-cover overlap”.
Avoid: “Predicted flood”, “Confirmed crop damage”, “Real-time flood warning”, “100% accurate”, “Affected farmers” unless farmer-level data exists.
