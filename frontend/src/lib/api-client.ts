import {
  ApiErrorEnvelope,
  AnalysisDetail,
  AnalysisListResponse,
  DataSourcesResponse,
  EvaluationMetricsResponse,
  HealthResponse,
  LayerCatalogueResponse,
  LayerGeoJsonResponse,
  LayerKey,
  ReportLanguage,
  ReportResponse,
  StudyAreaDetail,
  StudyAreasResponse,
} from '../types/api';
import {
  MOCK_DATA_SOURCES,
  MOCK_EVALUATION_METRICS,
  MOCK_GEOJSON_LAYERS,
  MOCK_HEALTH,
  MOCK_LATEST_ANALYSIS,
  MOCK_LAYER_CATALOGUE,
  MOCK_REPORTS,
  MOCK_STUDY_AREA,
} from './mock-data';

export class ApiError extends Error {
  code: string;
  requestId?: string;
  status: number;

  constructor(code: string, message: string, status: number, requestId?: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.requestId = requestId;
  }
}

// Configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// If explicitly set to false, do not mock; otherwise default to mock-fallback mode
const FORCE_MOCK = import.meta.env.VITE_USE_MOCK_FIXTURES === 'true' || import.meta.env.VITE_USE_MOCK_FIXTURES === undefined;

// Reactive state tracker for whether fixtures are actively being served
let _isUsingFixtures = FORCE_MOCK;
const listeners = new Set<(isUsingFixtures: boolean) => void>();

export function isUsingFixtures(): boolean {
  return _isUsingFixtures;
}

export function subscribeFixtureState(listener: (isUsingFixtures: boolean) => void): () => void {
  listeners.add(listener);
  listener(_isUsingFixtures);
  return () => {
    listeners.delete(listener);
  };
}

function setUsingFixtures(val: boolean) {
  if (_isUsingFixtures !== val) {
    _isUsingFixtures = val;
    listeners.forEach((fn) => fn(val));
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json, application/geo+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!res.ok) {
      let errPayload: ApiErrorEnvelope | null = null;
      try {
        errPayload = await res.json();
      } catch {
        // Not a JSON error payload
      }

      if (errPayload?.error) {
        throw new ApiError(
          errPayload.error.code,
          errPayload.error.message,
          res.status,
          errPayload.error.request_id
        );
      }

      throw new ApiError(
        `HTTP_${res.status}`,
        `Request failed with status ${res.status}: ${res.statusText}`,
        res.status
      );
    }

    setUsingFixtures(false);
    return (await res.json()) as T;
  } catch (err: unknown) {
    // If FORCE_MOCK is true or network unreachable, fall back to schema-accurate fixtures
    if (FORCE_MOCK || (err instanceof TypeError && err.message.includes('fetch'))) {
      setUsingFixtures(true);
      const mockResult = getMockResponse<T>(path);
      if (mockResult !== undefined) {
        return mockResult;
      }
    }
    throw err;
  }
}

function getMockResponse<T>(path: string): T | undefined {
  if (path === '/health') {
    return MOCK_HEALTH as unknown as T;
  }
  if (path === '/study-areas') {
    return { items: [MOCK_STUDY_AREA] } as unknown as T;
  }
  if (path.startsWith('/study-areas/') && path.endsWith('/analyses/latest')) {
    return MOCK_LATEST_ANALYSIS as unknown as T;
  }
  if (path.startsWith('/study-areas/') && path.includes('/analyses')) {
    return {
      items: [
        {
          id: MOCK_LATEST_ANALYSIS.id,
          status: MOCK_LATEST_ANALYSIS.status,
          analysis_label: MOCK_LATEST_ANALYSIS.analysis_label,
          observation_start: MOCK_LATEST_ANALYSIS.observation_start,
          observation_end: MOCK_LATEST_ANALYSIS.observation_end,
          created_at: MOCK_LATEST_ANALYSIS.created_at,
          completed_at: MOCK_LATEST_ANALYSIS.completed_at,
        },
      ],
      total: 1,
    } as unknown as T;
  }
  if (path.startsWith('/study-areas/')) {
    const detail: StudyAreaDetail = {
      ...MOCK_STUDY_AREA,
      boundary_geojson: MOCK_GEOJSON_LAYERS.study_area,
      metadata: { pilot: true, catchment: 'Surma-Meghna Basin' },
    };
    return detail as unknown as T;
  }
  if (path.includes('/layers/')) {
    const parts = path.split('/');
    const key = parts[parts.length - 1];
    if (MOCK_GEOJSON_LAYERS[key]) {
      return MOCK_GEOJSON_LAYERS[key] as unknown as T;
    }
    throw new ApiError('LAYER_NOT_AVAILABLE', `Layer ${key} is not available.`, 404);
  }
  if (path.endsWith('/layers')) {
    return MOCK_LAYER_CATALOGUE as unknown as T;
  }
  if (path.endsWith('/metrics')) {
    return MOCK_EVALUATION_METRICS as unknown as T;
  }
  if (path.endsWith('/sources')) {
    return MOCK_DATA_SOURCES as unknown as T;
  }
  if (path.includes('/reports/bn')) {
    return MOCK_REPORTS.bn as unknown as T;
  }
  if (path.includes('/reports/en')) {
    return MOCK_REPORTS.en as unknown as T;
  }
  if (path.startsWith('/analyses/')) {
    return MOCK_LATEST_ANALYSIS as unknown as T;
  }
  return undefined;
}

// Client API Methods strictly bound to docs/api.md

export const apiClient = {
  getHealth: (): Promise<HealthResponse> => {
    return request<HealthResponse>('/health');
  },

  getStudyAreas: (): Promise<StudyAreasResponse> => {
    return request<StudyAreasResponse>('/study-areas');
  },

  getStudyAreaDetail: (slug: string): Promise<StudyAreaDetail> => {
    return request<StudyAreaDetail>(`/study-areas/${encodeURIComponent(slug)}`);
  },

  getLatestAnalysis: (slug: string): Promise<AnalysisDetail> => {
    return request<AnalysisDetail>(`/study-areas/${encodeURIComponent(slug)}/analyses/latest`);
  },

  getAnalysesList: (slug: string, limit = 10): Promise<AnalysisListResponse> => {
    return request<AnalysisListResponse>(`/study-areas/${encodeURIComponent(slug)}/analyses?limit=${limit}`);
  },

  getAnalysisDetail: (analysisId: string): Promise<AnalysisDetail> => {
    return request<AnalysisDetail>(`/analyses/${encodeURIComponent(analysisId)}`);
  },

  getLayerCatalogue: (analysisId: string): Promise<LayerCatalogueResponse> => {
    return request<LayerCatalogueResponse>(`/analyses/${encodeURIComponent(analysisId)}/layers`);
  },

  getLayerGeoJson: (analysisId: string, layerKey: LayerKey): Promise<LayerGeoJsonResponse> => {
    return request<LayerGeoJsonResponse>(`/analyses/${encodeURIComponent(analysisId)}/layers/${encodeURIComponent(layerKey)}`);
  },

  getEvaluationMetrics: (analysisId: string): Promise<EvaluationMetricsResponse> => {
    return request<EvaluationMetricsResponse>(`/analyses/${encodeURIComponent(analysisId)}/metrics`);
  },

  getDataSources: (analysisId: string): Promise<DataSourcesResponse> => {
    return request<DataSourcesResponse>(`/analyses/${encodeURIComponent(analysisId)}/sources`);
  },

  getReport: (analysisId: string, language: ReportLanguage): Promise<ReportResponse> => {
    return request<ReportResponse>(`/analyses/${encodeURIComponent(analysisId)}/reports/${encodeURIComponent(language)}`);
  },
};
