import {
  AnalysisDetail,
  DataSourcesResponse,
  EvaluationMetricsResponse,
  HealthResponse,
  LayerCatalogueResponse,
  LayerGeoJsonResponse,
  ReportResponse,
  StudyAreaSummary,
} from '../types/api';

export const MOCK_STUDY_AREA: StudyAreaSummary = {
  id: '7b80a221-50e4-4a41-b8cf-862dcf9c4001',
  slug: 'pilot-haor',
  name: 'Hakaluki Haor, Sylhet',
  division: 'Sylhet',
  districts: ['Moulvibazar', 'Sylhet'],
  country_code: 'BD',
  area_km2: 181.15,
  bounds: [91.98, 24.60, 92.12, 24.74],
  is_active: true,
};

export const MOCK_LATEST_ANALYSIS: AnalysisDetail = {
  id: '9f23a887-c812-4cf4-91b6-d2459e4b7891',
  study_area: {
    slug: 'pilot-haor',
    name: 'Hakaluki Haor, Sylhet',
  },
  status: 'completed',
  analysis_label: 'Post-Monsoon Early Inundation Window',
  observation_start: '2026-05-01T06:14:22Z',
  observation_end: '2026-05-13T18:22:05Z',
  created_at: '2026-05-14T02:00:00Z',
  completed_at: '2026-05-14T02:28:40Z',
  progress_percent: 100,
  progress_message: null,
  is_stale: false,
  model: {
    name: 'HaorWatch U-Net Flood Classifier',
    version: '0.1.0-sen1floods11',
  },
  baseline: {
    method: 'otsu_thresholding',
    display_name: 'Otsu SAR Thresholding Baseline',
  },
  permanent_water_mask: {
    applied: false,
    source: 'JRC Global Surface Water v1.4',
    threshold: null,
    note: 'Permanent water mask unapplied for this run due to cloud-free optical composite lag.',
  },
  validation: {
    status: 'internal_test_only',
    note: 'Evaluated against held-out Sen1Floods11 geographic holdout validation set. Ground-truth validation in Sylhet basin is currently unavailable.',
  },
  summary: {
    study_area_km2: 181.15,
    detected_flood_area_km2: 84.62,
    baseline_flood_area_km2: 78.40,
    mapped_agricultural_area_km2: 112.30,
    potentially_exposed_agricultural_area_km2: 31.25,
    potentially_exposed_agricultural_share_percent: 36.93,
    valid_pixel_count: 1811500,
    nodata_pixel_count: 1240,
  },
  available_layers: [
    'study_area',
    'ml_flood',
    'baseline_flood',
    'agricultural_exposure',
  ],
};

export const MOCK_LAYER_CATALOGUE: LayerCatalogueResponse = {
  analysis_id: '9f23a887-c812-4cf4-91b6-d2459e4b7891',
  layers: [
    {
      layer_key: 'study_area',
      display_name: 'Study Area Boundary',
      available: true,
      format: 'geojson',
      area_km2: 181.15,
      feature_count: 1,
      source_date: '2026-05-01',
      model_version: null,
      description: 'Official delineated catchment boundary for Hakaluki Haor.',
    },
    {
      layer_key: 'ml_flood',
      display_name: 'ML-Detected Flood Extent',
      available: true,
      format: 'geojson',
      area_km2: 84.62,
      feature_count: 3,
      source_date: '2026-05-13',
      model_version: '0.1.0-sen1floods11',
      description: 'Flooded pixels classified by custom U-Net model on Sentinel-1 SAR imagery.',
    },
    {
      layer_key: 'baseline_flood',
      display_name: 'Otsu SAR Baseline Flood',
      available: true,
      format: 'geojson',
      area_km2: 78.40,
      feature_count: 2,
      source_date: '2026-05-13',
      model_version: null,
      description: 'Conventional SAR backscatter thresholding using automated Otsu threshold.',
    },
    {
      layer_key: 'agricultural_exposure',
      display_name: 'Potentially Exposed Agricultural Land',
      available: true,
      format: 'geojson',
      area_km2: 31.25,
      feature_count: 2,
      source_date: '2026-05-13',
      model_version: null,
      description: 'Spatial intersection of U-Net detected flood extent with ESA WorldCover cropland classes.',
    },
    {
      layer_key: 'permanent_water',
      display_name: 'Permanent Water Mask (JRC GSW)',
      available: false,
      format: 'geojson',
      area_km2: null,
      feature_count: null,
      source_date: null,
      model_version: null,
      description: 'Permanent water recurrence mask unavailable for this observation run.',
    },
    {
      layer_key: 'validation_reference',
      display_name: 'Independent Validation Reference',
      available: false,
      format: 'geojson',
      area_km2: null,
      feature_count: null,
      source_date: null,
      model_version: null,
      description: 'No synchronized Copernicus EMS or UNOSAT reference available for this acquisition period.',
    },
  ],
};

// Accurate Hakaluki Haor Coordinates in Sylhet [Lon: 91.98 to 92.12, Lat: 24.60 to 24.74]
// All features formatted as valid GeoJSON MultiPolygons
export const MOCK_GEOJSON_LAYERS: Record<string, LayerGeoJsonResponse> = {
  study_area: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: 'study_area_multi',
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [91.985, 24.610],
                [92.010, 24.602],
                [92.070, 24.605],
                [92.115, 24.640],
                [92.118, 24.695],
                [92.095, 24.735],
                [92.040, 24.738],
                [92.000, 24.710],
                [91.982, 24.660],
                [91.985, 24.610],
              ],
            ],
          ],
        },
        properties: {
          layer_key: 'study_area',
          area_km2: 181.15,
          class_name: 'catchment_boundary',
        },
      },
    ],
  },
  ml_flood: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: 'ml_flood_basin',
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [92.015, 24.625],
                [92.055, 24.620],
                [92.090, 24.645],
                [92.092, 24.685],
                [92.070, 24.715],
                [92.035, 24.710],
                [92.010, 24.675],
                [92.015, 24.625],
              ],
            ],
            [
              [
                [92.030, 24.710],
                [92.065, 24.712],
                [92.080, 24.728],
                [92.050, 24.732],
                [92.025, 24.724],
                [92.030, 24.710],
              ],
            ],
            [
              [
                [92.020, 24.610],
                [92.050, 24.612],
                [92.055, 24.622],
                [92.025, 24.624],
                [92.020, 24.610],
              ],
            ],
          ],
        },
        properties: {
          layer_key: 'ml_flood',
          area_km2: 84.62,
          class_name: 'flood',
        },
      },
    ],
  },
  baseline_flood: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: 'baseline_flood_multi',
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [92.020, 24.630],
                [92.060, 24.625],
                [92.085, 24.650],
                [92.088, 24.680],
                [92.065, 24.705],
                [92.030, 24.700],
                [92.015, 24.665],
                [92.020, 24.630],
              ],
            ],
            [
              [
                [92.085, 24.660],
                [92.105, 24.665],
                [92.100, 24.685],
                [92.080, 24.680],
                [92.085, 24.660],
              ],
            ],
          ],
        },
        properties: {
          layer_key: 'baseline_flood',
          area_km2: 78.40,
          class_name: 'flood_baseline',
        },
      },
    ],
  },
  agricultural_exposure: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: 'exposure_multi',
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [92.060, 24.635],
                [92.085, 24.640],
                [92.088, 24.675],
                [92.065, 24.665],
                [92.060, 24.635],
              ],
            ],
            [
              [
                [92.035, 24.700],
                [92.065, 24.705],
                [92.058, 24.720],
                [92.030, 24.715],
                [92.035, 24.700],
              ],
            ],
          ],
        },
        properties: {
          layer_key: 'agricultural_exposure',
          area_km2: 31.25,
          class_name: 'potentially_exposed_agricultural_land',
        },
      },
    ],
  },
};

export const MOCK_EVALUATION_METRICS: EvaluationMetricsResponse = {
  analysis_id: '9f23a887-c812-4cf4-91b6-d2459e4b7891',
  validation_status: 'internal_test_only',
  positive_class: 'flood',
  test_dataset: {
    name: 'Sen1Floods11 Held-Out Test Split',
    version: '1.1-hand-labelled',
    split_strategy: 'Geographic Holdout (Bolivia, Ghana, India, USA events)',
    test_pixel_count: 4423680,
  },
  methods: [
    {
      method_key: 'custom_ml',
      method_name: 'HaorWatch U-Net Flood Model',
      precision: 0.884,
      recall: 0.832,
      f1: 0.857,
      iou: 0.750,
      confusion_matrix: {
        true_positive: 1084200,
        false_positive: 142100,
        true_negative: 3012480,
        false_negative: 184900,
      },
      evaluated_at: '2026-05-13T12:00:00Z',
      notes: 'Custom 2D U-Net trained on Sentinel-1 VV/VH amplitude rasters with combined BCE-Dice loss.',
    },
    {
      method_key: 'otsu_baseline',
      method_name: 'Otsu SAR Thresholding Baseline',
      precision: 0.741,
      recall: 0.796,
      f1: 0.767,
      iou: 0.622,
      confusion_matrix: {
        true_positive: 1037200,
        false_positive: 362400,
        true_negative: 2792180,
        false_negative: 231900,
      },
      evaluated_at: '2026-05-13T12:00:00Z',
      notes: 'Bimodal Otsu thresholding calculated globally across calibrated Sentinel-1 VV backscatter.',
    },
  ],
  limitations: [
    'Public training labels from Sen1Floods11 originate from global flood events and may not fully capture local wetland vegetation and floating macrophytes specific to Sylhet haor ecosystems.',
    'Sentinel-1 C-band SAR backscatter can be influenced by wind-induced water surface roughness and emergent vegetation canopy.',
    'Validation metrics represent benchmark test sets and do not constitute certified local ground truth in Hakaluki Haor.',
  ],
};

export const MOCK_DATA_SOURCES: DataSourcesResponse = {
  analysis_id: '9f23a887-c812-4cf4-91b6-d2459e4b7891',
  sources: [
    {
      dataset_key: 'sentinel1_sar',
      display_name: 'Sentinel-1 C-SAR GRD',
      provider: 'European Space Agency (Copernicus)',
      role: 'Primary input imagery for SAR flood detection and backscatter analysis',
      version: 'Level-1 GRD IW',
      acquired_at: '2026-05-13T11:42:18Z',
      period_start: '2026-05-01',
      period_end: '2026-05-13',
      resolution_m: 10.0,
      crs: 'EPSG:4326 / UTM Zone 46N',
      source_url: 'https://dataspace.copernicus.eu',
      status: 'used',
      notes: 'Preprocessed with precise orbit ephemerides, thermal noise removal, radiometric calibration, and terrain correction.',
    },
    {
      dataset_key: 'jrc_gsw',
      display_name: 'JRC Global Surface Water',
      provider: 'European Commission Joint Research Centre',
      role: 'Permanent water recurrence mask to isolate seasonal inundation',
      version: 'v1.4 (1984–2021)',
      acquired_at: '2026-01-01T00:00:00Z',
      period_start: null,
      period_end: null,
      resolution_m: 30.0,
      crs: 'EPSG:4326',
      source_url: 'https://global-surface-water.appspot.com',
      status: 'unavailable',
      notes: 'Permanent water recurrence mask unapplied for this run.',
    },
    {
      dataset_key: 'esa_worldcover',
      display_name: 'ESA WorldCover 10m',
      provider: 'European Space Agency / VITO',
      role: 'Cropland land-cover classification for potential agricultural exposure assessment',
      version: 'v200 (2021)',
      acquired_at: '2021-12-31T00:00:00Z',
      period_start: null,
      period_end: null,
      resolution_m: 10.0,
      crs: 'EPSG:4326',
      source_url: 'https://esa-worldcover.org',
      status: 'used',
      notes: 'Mapped cropland class (value 40). Notice: Cropland classification is land-cover based and does not differentiate specific seasonal rice crops (such as Boro).',
    },
    {
      dataset_key: 'copernicus_ems',
      display_name: 'Copernicus EMS Rapid Mapping',
      provider: 'Copernicus Emergency Management Service',
      role: 'External validation reference map',
      version: null,
      acquired_at: null,
      period_start: null,
      period_end: null,
      resolution_m: null,
      crs: null,
      source_url: null,
      status: 'unavailable',
      notes: 'No synchronized Copernicus EMS activation or UNOSAT product was available for this specific observation date.',
    },
  ],
};

export const MOCK_REPORTS: Record<'bn' | 'en', ReportResponse> = {
  bn: {
    analysis_id: '9f23a887-c812-4cf4-91b6-d2459e4b7891',
    language: 'bn',
    generation_method: 'template',
    status: 'completed',
    title: 'হাকালুকি হাওর এলাকায় উপগ্রহ-ভিত্তিক বন্যা ও কৃষিজমির সম্ভাব্য সংস্পর্শ প্রতিবেদন',
    body: `মে ২০২৬-এর সেন্টিনেল-১ এসএআর (Sentinel-1 SAR) উপগ্রহ চিত্র বিশ্লেষণে হাকালুকি হাওর অধ্যয়ন এলাকায় আনুমানিক ৮৪.৬২ বর্গকিলোমিটার এলাকা প্লাবিত হিসেবে শনাক্ত হয়েছে। প্রচলিত ওটসু (Otsu) বেসলাইন পদ্ধতিতে প্রাপ্ত ৭৮.৪০ বর্গকিলোমিটারের তুলনায় কাস্টম ইউ-নেট মডেলটি জলমগ্ন এলাকার সুস্পষ্ট বিস্তার নির্দেশ করে।

ইএসএ ওয়ার্ল্ডকভার (ESA WorldCover) কৃষিজমি মানচিত্রের সাথে সমন্বয়ের মাধ্যমে আনুমানিক ৩১.২৫ বর্গকিলোমিটার কৃষিজমি প্লাবনের সংস্পর্শে আসার সম্ভাবনা চিহ্নিত হয়েছে, যা শনাক্তকৃত মোট প্লাবিত এলাকার প্রায় ৩৬.৯৩%।

সতর্কতা: এই পরিসংখ্যান উপগ্রহ চিত্রভিত্তিক কৃষিজমির ভৌগোলিক সংস্পর্শ মাত্র। এটি মাঠপর্যায়ের নিশ্চিত ফসলের ক্ষতি, বোরো ধানের প্রকৃত ফলনহানি বা আর্থিক ক্ষয়ক্ষতির প্রত্যক্ষ পরিমাপ নয়। এছাড়া এটি কোনো তাৎক্ষণিক বন্যা পূর্বাভাস বা দুর্যোগ সতর্কবার্তা নয়।`,
    created_at: '2026-05-14T02:30:00Z',
    data_as_of: '2026-05-13T18:22:05Z',
    caveats: [
      'এই ফলাফল উপগ্রহ চিত্র বিশ্লেষণজাত সম্ভাব্য কৃষিজমির সংস্পর্শ নির্দেশ করে; মাঠপর্যায়ের নিশ্চিত ফসলের ক্ষতি বা ফলনহানি নয়।',
      'ইএসএ ওয়ার্ল্ডকভার কৃষিজমি মানচিত্র ফসলের প্রজাতি (যেমন বোরো ধান) নির্দিষ্ট করে না।',
      'এটি একটি উপগ্রহ পর্যবেক্ষণভিত্তিক বিশ্লেষণ; কোনো রিয়েল-টাইম পূর্বাভাস বা সরকারি জরুরি সতর্কবার্তা নয়।',
    ],
  },
  en: {
    analysis_id: '9f23a887-c812-4cf4-91b6-d2459e4b7891',
    language: 'en',
    generation_method: 'template',
    status: 'completed',
    title: 'Hakaluki Haor: Satellite Flood Extent & Potential Agricultural Exposure Briefing',
    body: `Analysis of Sentinel-1 Synthetic Aperture Radar (SAR) imagery acquired between 01 May and 13 May 2026 delineates an estimated 84.62 km² of detected flood extent within the Hakaluki Haor pilot study area. Compared with the conventional Otsu SAR backscatter baseline (78.40 km²), the custom U-Net model demonstrates coherent delineation of shallow inundation boundaries.

Overlay with ESA WorldCover 10m land-cover data indicates that approximately 31.25 km² of mapped agricultural land intersects with detected flood waters, representing 36.93% of the total detected flood extent.

Notice: This metric represents estimated spatial exposure of land-cover mapped cropland to satellite-detected inundation. It must not be interpreted as verified field damage, crop mortality, or economic yield loss. This platform provides historical and observational analysis and does not constitute real-time flood warning or predictive forecasting.`,
    created_at: '2026-05-14T02:30:00Z',
    data_as_of: '2026-05-13T18:22:05Z',
    caveats: [
      'Identified cropland overlap denotes potentially exposed agricultural area, not verified crop loss or mortality.',
      'ESA WorldCover identifies generalized cropland classes and does not distinguish standing Boro paddy varieties.',
      'Observational satellite assessment only — does not provide real-time forecasting or flood warning alerts.',
    ],
  },
};

export const MOCK_HEALTH: HealthResponse = {
  status: 'ok',
  service: 'haorwatch-api',
  version: '0.1.0',
  timestamp: new Date().toISOString(),
};
