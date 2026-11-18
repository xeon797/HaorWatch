import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { LayerKey, ReportLanguage } from '../types/api';

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.getHealth(),
    refetchInterval: 30000,
  });
}

export function useStudyAreas() {
  return useQuery({
    queryKey: ['study-areas'],
    queryFn: () => apiClient.getStudyAreas(),
  });
}

export function useStudyAreaDetail(slug: string | undefined) {
  return useQuery({
    queryKey: ['study-area', slug],
    queryFn: () => (slug ? apiClient.getStudyAreaDetail(slug) : null),
    enabled: !!slug,
  });
}

export function useLatestAnalysis(slug: string | undefined = 'pilot-haor') {
  return useQuery({
    queryKey: ['analyses', 'latest', slug],
    queryFn: () => apiClient.getLatestAnalysis(slug),
    enabled: !!slug,
  });
}

export function useLayerCatalogue(analysisId: string | undefined) {
  return useQuery({
    queryKey: ['analyses', analysisId, 'layers'],
    queryFn: () => (analysisId ? apiClient.getLayerCatalogue(analysisId) : null),
    enabled: !!analysisId,
  });
}

export function useLayerGeoJson(analysisId: string | undefined, layerKey: LayerKey, enabled = true) {
  return useQuery({
    queryKey: ['analyses', analysisId, 'layers', layerKey],
    queryFn: () => (analysisId ? apiClient.getLayerGeoJson(analysisId, layerKey) : null),
    enabled: !!analysisId && enabled,
    staleTime: Infinity, // GeoJSON geometries are static once processed
  });
}

export function useEvaluationMetrics(analysisId: string | undefined) {
  return useQuery({
    queryKey: ['analyses', analysisId, 'metrics'],
    queryFn: () => (analysisId ? apiClient.getEvaluationMetrics(analysisId) : null),
    enabled: !!analysisId,
  });
}

export function useDataSources(analysisId: string | undefined) {
  return useQuery({
    queryKey: ['analyses', analysisId, 'sources'],
    queryFn: () => (analysisId ? apiClient.getDataSources(analysisId) : null),
    enabled: !!analysisId,
  });
}

export function useReport(analysisId: string | undefined, language: ReportLanguage) {
  return useQuery({
    queryKey: ['analyses', analysisId, 'report', language],
    queryFn: () => (analysisId ? apiClient.getReport(analysisId, language) : null),
    enabled: !!analysisId,
  });
}
