// 다국어 해석 데이터 로딩 유틸리티

// 동적 import를 위한 함수
export async function getInterpretations(language = 'ko') {
  try {
    switch (language) {
      case 'en':
        const interpretations_en = await import('./interpretations_en.json');
        return interpretations_en.default;
      case 'ko':
      default:
        const interpretations_ko = await import('./interpretations_ko.json');
        return interpretations_ko.default;
    }
  } catch (error) {
    console.warn(`언어 '${language}'의 데이터를 로드할 수 없습니다. 한국어로 대체합니다.`);
    const interpretations_ko = await import('./interpretations_ko.json');
    return interpretations_ko.default;
  }
}

// 사용 가능한 언어 목록
export const AVAILABLE_LANGUAGES = ['ko', 'en'];

// 기본 언어 설정
export const DEFAULT_LANGUAGE = 'ko';
