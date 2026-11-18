# Data Model & Schema — HaorWatch AI

## 1. Database
Use PostgreSQL 16 + PostGIS. Metadata, summaries, and vector geometries are stored in DB. Large rasters and model artifacts remain in filesystem/object storage and are referenced by internal URIs. All primary keys UUID; timestamps UTC `timestamptz`; numeric field names include units.

## 2. Entities

### `study_areas`
- `id` UUID PK
- `slug` varchar(80) unique, lowercase URL-safe
- `name` varchar(160) required
- `division` varchar(80), nullable
- `districts` JSONB array, nullable
- `country_code` char(2), default `BD`
- `boundary` geometry(MultiPolygon,4326), nullable until AOI is confirmed; required for map analysis
- `area_km2` numeric(12,3), nullable
- `is_active` boolean default true
- `metadata` JSONB
- `created_at`, `updated_at` timestamptz

### `dataset_assets`
- `id` UUID PK
- `study_area_id` UUID FK nullable
- `dataset_key` varchar(80): `sentinel1_sar`, `sen1floods11`, `jrc_gsw`, `esa_worldcover`, `sentinel2_reference`, etc.
- `display_name` varchar(180), `provider` varchar(120)
- `data_type` varchar(40): raster/vector/tabular/model/other
- `source_url` text nullable; `source_version` varchar(100) nullable
- `acquired_at` timestamptz nullable
- `period_start`, `period_end` date nullable
- `crs` varchar(40) nullable; `resolution_m` numeric(10,3) nullable
- `license_note` text nullable
- `storage_uri` text nullable (internal only)
- `checksum_sha256` char(64) nullable
- `metadata` JSONB; `created_at` timestamptz

### `analysis_runs`
- `id` UUID PK; `study_area_id` UUID FK required
- `status` varchar(24): queued/processing/completed/failed/not_available
- `analysis_label` varchar(160)
- `observation_start`, `observation_end` timestamptz nullable
- `created_at`, `updated_at` timestamptz; `started_at`, `completed_at` nullable
- `progress_percent` smallint 0–100 nullable; `progress_message` varchar(240) nullable
- `model_name` varchar(120), `model_version` varchar(80) nullable
- `baseline_method` varchar(80) nullable
- `permanent_water_mask_applied` boolean default false
- `permanent_water_threshold` numeric(6,3) nullable; record units/meaning in config
- `validation_status` varchar(40): not_available/internal_test_only/external_reference_checked
- `validation_note` text nullable
- `processing_config` JSONB required
- `error_code` varchar(80), `error_message_safe` text nullable
- `created_by` varchar(80) nullable (MVP system/operator label; no auth)

### `analysis_summaries`
- `id` UUID PK
- `analysis_run_id` UUID unique FK
- `study_area_km2`, `detected_flood_area_km2`, `baseline_flood_area_km2`, `mapped_agricultural_area_km2`, `potentially_exposed_agricultural_area_km2`: numeric(14,4), nullable
- `potentially_exposed_agricultural_share_percent` numeric(7,3), nullable
- `valid_pixel_count`, `nodata_pixel_count` bigint nullable
- `summary_metadata` JSONB

### `analysis_metrics`
- `id` UUID PK; `analysis_run_id` UUID FK
- `method_key` varchar(40): custom_ml/otsu_baseline/change_detection_baseline
- `method_name` varchar(120)
- `precision_score`, `recall_score`, `f1_score`, `iou_score` numeric(8,6), nullable
- `true_positive`, `false_positive`, `true_negative`, `false_negative`, `test_pixel_count` bigint nullable
- `test_dataset_asset_id` UUID FK nullable
- `split_strategy` varchar(160) nullable; `evaluated_at` timestamptz nullable; `notes` text nullable
- Unique `(analysis_run_id, method_key)`.

### `analysis_layers`
- `id` UUID PK; `analysis_run_id` UUID FK
- `layer_key` varchar(60): study_area/ml_flood/baseline_flood/agricultural_exposure/permanent_water/validation_reference
- `display_name` varchar(140); `available` boolean default false
- `geometry` geometry(Geometry,4326) nullable
- `storage_uri` text nullable (internal only)
- `feature_count` integer nullable; `area_km2` numeric(14,4) nullable
- `style`, `metadata` JSONB; `created_at` timestamptz
- Unique `(analysis_run_id, layer_key)`.

### `reports`
- `id` UUID PK; `analysis_run_id` UUID FK
- `language` varchar(8): bn/en
- `generation_method` varchar(24): llm/template
- `status` varchar(24): completed/failed
- `title` varchar(180); `body` text
- `source_snapshot` JSONB; `created_at` timestamptz

## 3. Relationships
- study_areas 1→many analysis_runs and dataset_assets.
- analysis_runs 1→1 analysis_summaries.
- analysis_runs 1→many analysis_metrics, analysis_layers, reports.
- analysis_metrics optionally references a dataset_assets test dataset.

## 4. Validation rules
- Areas >= 0; percentages [0,100]; metric scores [0,1]; progress [0,100].
- observation_start <= observation_end.
- Completed run requires completed_at; failed run requires safe error code/message.
- No NaN/Infinity in DB metric fields; use null if unavailable.
- Null means unavailable; zero means measured zero. Never substitute one for the other.
- An unavailable layer must not return fabricated empty polygons.
- Store CRS, pixel resolution, product version, mask threshold, and class mapping in metadata/config.

## 5. Auth and access
MVP has no public user accounts or personal data. Read endpoints are public. Analysis-trigger endpoint, if enabled, must require an operator-only API key. Future roles (out of scope): admin, analyst, viewer.

## 6. Migrations and seed
Use Alembic. Seed one study area and source catalogue. Any prepared/demo analysis must be explicitly marked as prepared/precomputed with source/date; never seed plausible fake metrics or flood area.


## Model and training provenance requirements
For every custom-model analysis run, persist or link to:
- model family/name (`unet` for the MVP primary model), model version, checkpoint artifact reference;
- dataset name/version/license note and label type (hand-labelled or weakly-labelled);
- train/validation/test split manifest and event/geographic separation strategy;
- input channel order, preprocessing and normalization parameters;
- training configuration, random seed, epoch/best-checkpoint metadata, and code version;
- held-out evaluation metrics and evaluation sample count, when available.

Do not store a claim of successful training without a real checkpoint and reproducible training record.
