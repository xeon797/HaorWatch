/**
 * HaorWatch AI — Canonical API Type Definitions
 * Strictly matches docs/api.md and docs/schema.md
 */

export interface ApiErrorEnvelope {
  error: {
    code: string;
    message: string;
    request_id?: string;
  };
}

export interface HealthResponse {
  status: 'ok' | string;
  service: string;
  version: string;
  timestamp: string;
}

export type BoundingBox = [west: number, south: number, east: number, north: number];

export interface StudyAreaSummary {
  id: string;
  slug: string;
  name: string;
  division: string | null;
  districts: string[];
  country_code: string;
  area_km2: number | null;
  bounds: BoundingBox;
  is_active: boolean;
}

export interface StudyAreasResponse {
  items: StudyAreaSummary[];
}

export interface StudyAreaDetail extends StudyAreaSummary {
  boundary_geojson?: GeoJSON.GeoJsonObject | null;
  metadata?: Record<string, unknown>;
}

export type AnalysisStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'not_available';

export type ValidationStatusCode = 'not_available' | 'internal_test_only' | 'external_reference_checked';

export interface AnalysisModelMeta {
  name: string;
  version: string | null;
}

export interface AnalysisBaselineMeta {
  method: string;
  display_name: string;
}

export interface PermanentWaterMaskMeta {
  applied: boolean;
  source: string | null;
  threshold: number | null;
  note: string | null;
}

export interface ValidationMeta {
  status: ValidationStatusCode;
  note: string | null;
}

export interface AnalysisSummaryData {
  study_area_km2: number | null;
  detected_flood_area_km2: number | null;
  baseline_flood_area_km2: number | null;
  mapped_agricultural_area_km2: number | null;
  potentially_exposed_agricultural_area_km2: number | null;
  potentially_exposed_agricultural_share_percent: number | null;
  valid_pixel_count: number | null;
  nodata_pixel_count: number | null;
}

export type LayerKey =
  | 'study_area'
  | 'ml_flood'
  | 'baseline_flood'
  | 'agricultural_exposure'
  | 'permanent_water'
  | 'validation_reference';

export interface AnalysisDetail {
  id: string;
  study_area: {
    slug: string;
    name: string;
  };
  status: AnalysisStatus;
  analysis_label: string;
  observation_start: string | null;
  observation_end: string | null;
  created_at: string;
  completed_at: string | null;
  progress_percent: number | null;
  progress_message: string | null;
  is_stale: boolean;
  model: AnalysisModelMeta;
  baseline: AnalysisBaselineMeta;
  permanent_water_mask: PermanentWaterMaskMeta;
  validation: ValidationMeta;
  summary: AnalysisSummaryData;
  available_layers: LayerKey[];
}

export interface AnalysisListItem {
  id: string;
  status: AnalysisStatus;
  analysis_label: string;
  observation_start: string | null;
  observation_end: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface AnalysisListResponse {
  items: AnalysisListItem[];
  total: number;
}

export interface LayerCatalogueItem {
  layer_key: LayerKey;
  display_name: string;
  available: boolean;
  format: 'geojson' | string;
  area_km2: number | null;
  feature_count: number | null;
  source_date: string | null;
  model_version: string | null;
  description: string;
}

export interface LayerCatalogueResponse {
  analysis_id: string;
  layers: LayerCatalogueItem[];
}

export interface GeoJsonFeatureProperties {
  layer_key: LayerKey;
  area_km2: number | null;
  class_name?: string;
  [key: string]: unknown;
}

export interface LayerGeoJsonResponse {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    id?: string | number;
    geometry: GeoJSON.Geometry;
    properties: GeoJsonFeatureProperties;
  }>;
}

export interface ConfusionMatrix {
  true_positive: number | null;
  false_positive: number | null;
  true_negative: number | null;
  false_negative: number | null;
}

export interface EvaluationMethod {
  method_key: string;
  method_name: string;
  precision: number | null;
  recall: number | null;
  f1: number | null;
  iou: number | null;
  confusion_matrix: ConfusionMatrix;
  evaluated_at: string | null;
  notes: string | null;
}

export interface TestDatasetMeta {
  name: string;
  version: string | null;
  split_strategy: string | null;
  test_pixel_count: number | null;
}

export interface EvaluationMetricsResponse {
  analysis_id: string;
  validation_status: ValidationStatusCode;
  positive_class: string;
  test_dataset: TestDatasetMeta;
  methods: EvaluationMethod[];
  limitations: string[];
}

export type SourceStatus = 'used' | 'unavailable' | 'reference_only';

export interface DataSourceItem {
  dataset_key: string;
  display_name: string;
  provider: string;
  role: string;
  version: string | null;
  acquired_at: string | null;
  period_start: string | null;
  period_end: string | null;
  resolution_m: number | null;
  crs: string | null;
  source_url: string | null;
  status: SourceStatus;
  notes: string | null;
}

export interface DataSourcesResponse {
  analysis_id: string;
  sources: DataSourceItem[];
}

export type ReportLanguage = 'bn' | 'en';

export interface ReportResponse {
  analysis_id: string;
  language: ReportLanguage;
  generation_method: 'template' | 'llm' | string;
  status: string;
  title: string;
  body: string;
  created_at: string;
  data_as_of: string | null;
  caveats: string[];
}
