import { nanoid } from 'nanoid';
import type { ZodiacSign } from '../components/ZodiacIcon';

// 공유 가능한 결과 데이터 모델
export interface ShareableResult {
  id: string;
  userData: {
    name: string;
    gender: string;
    sunSign: ZodiacSign;
    moonSign: ZodiacSign;
    risingSign: ZodiacSign;
  };
  interpretations: {
    sun: string;
    moon: string;
    rising: string;
  };
  createdAt: number;
  expiresAt: number;
}

// 로컬 스토리지 키
const SHARED_RESULTS_KEY = 'askstar_shared_results';

// 24시간을 밀리초로 변환 (24 * 60 * 60 * 1000)
const EXPIRATION_TIME = 86400000;

// 공유 결과 생성 함수
export const createShareableResult = (userData: ShareableResult['userData'], interpretations: ShareableResult['interpretations']): ShareableResult => {
  const now = Date.now();
  
  return {
    id: nanoid(10), // 10자리 ID 생성
    userData,
    interpretations,
    createdAt: now,
    expiresAt: now + EXPIRATION_TIME
  };
};

// 공유 결과 저장 함수
export const saveShareableResult = (result: ShareableResult): void => {
  try {
    // 기존 결과 불러오기
    const existingResults = getShareableResults();
    
    // 새 결과 추가
    existingResults.push(result);
    
    // 만료된 결과 필터링
    const validResults = cleanExpiredResults(existingResults);
    
    // 저장
    localStorage.setItem(SHARED_RESULTS_KEY, JSON.stringify(validResults));
  } catch (error) {
    console.error('Failed to save shareable result:', error);
  }
};

// 공유 결과 불러오기 함수
export const getShareableResults = (): ShareableResult[] => {
  try {
    const results = localStorage.getItem(SHARED_RESULTS_KEY);
    return results ? JSON.parse(results) : [];
  } catch (error) {
    console.error('Failed to get shareable results:', error);
    return [];
  }
};

// ID로 특정 공유 결과 불러오기
export const getShareableResultById = (id: string): ShareableResult | null => {
  try {
    const results = getShareableResults();
    const result = results.find(r => r.id === id);
    
    // 결과가 없거나 만료된 경우
    if (!result || result.expiresAt < Date.now()) {
      return null;
    }
    
    return result;
  } catch (error) {
    console.error('Failed to get shareable result by ID:', error);
    return null;
  }
};

// 만료된 결과 정리 함수
export const cleanExpiredResults = (results: ShareableResult[]): ShareableResult[] => {
  const now = Date.now();
  return results.filter(result => result.expiresAt > now);
};

// 공유 URL 생성 함수
export const createShareUrl = (resultId: string): string => {
  // 현재 도메인 기반으로 URL 생성
  const baseUrl = window.location.origin;
  const basePath = import.meta.env.BASE_URL || '/';
  return `${baseUrl}${basePath}share/${resultId}`;
};
