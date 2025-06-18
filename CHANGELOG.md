# Changelog

## 📝 Changelog Rules
- 최신 변경사항이 맨 위에 위치합니다
- 이전 로그는 아래쪽으로 이동합니다
- 날짜 형식: YYYY-MM-DD
- 카테고리: Added, Changed, Fixed, Removed
- 이모지와 상세 설명을 포함합니다


[2025-06-18] - 📱 모바일 공유 모달 및 공유 페이지 구현

### Added
- ✅ 모바일 환경에서 결과 공유를 위한 하단 슬라이드 업 모달 구현 (ShareModal)
- ✅ 클립보드 복사 기능 구현 (최신 Clipboard API 및 레거시 방식 모두 지원)
- ✅ 공유된 결과를 표시하는 SharePage 구현 (/share/:resultId 형식의 URL)
- ✅ 공유 관련 유틸리티 함수 구현 (shareUtils.ts)
- ✅ SharedInterpretationCard 컴포넌트 개발로 일관된 UI 제공

### Changed
- 🔄 모든 공유 관련 텍스트를 i18n 시스템에 통합 (resultPageTranslations.json, sharePageTranslations.json)
- 🔄 SharePage 버튼 스타일을 InputPage의 별 색상(bg-star-gold/20)과 통일
- 🔄 SharePage에서 단일 CTA 버튼 사용으로 사용자 경험 개선

### Fixed
- 🔧 ShareModal i18n 키 오류 수정 (share.share_via → shareModal.title)
- 🔧 SharePage 미사용 변수 및 함수 제거로 빌드 오류 해결

### Technical Improvements
- 모바일 우선 접근법으로 모든 UI 컴포넌트 설계
- 클립보드 API 호환성을 위한 이중 구현 (navigator.clipboard 및 document.execCommand)
- 24시간 후 공유 결과 만료 처리 로직 구현

---

[2025-06-17] - 🔍 SEO 최적화 및 검색 엔진 인덱싱 개선

### Added
- ✅ 사이트맵(sitemap.xml) 생성 및 통합
- ✅ robots.txt 파일 추가로 검색 엔진 크롤링 최적화
- ✅ Google AdSense를 위한 ads.txt 파일 추가
- ✅ 메타 태그 최적화: 설명, 키워드, 로봇, 정식 URL 추가
- ✅ Open Graph 태그 추가로 소셜 미디어 공유 최적화
- ✅ JSON-LD 구조화 데이터 추가로 검색 결과 강화

### Changed
- 🔄 HTML lang 속성을 'ko'로 변경하여 한국어 사이트임을 명시
- 🔄 폰트 스택 최적화: 한국어는 Nanum Gothic, 영어는 Playfair Display 사용
- 🔄 메인 로고 폰트를 Playfair Display(serif)로 유지하도록 CSS 규칙 추가
- 🔄 메타 설명 및 타이틀 텍스트 개선 ('별에 묻다' 브랜딩 강화)

### Technical Improvements
- lang 속성 기반 언어별 폰트 적용을 위한 CSS :lang() 선택자 활용
- 구조화된 데이터로 검색 결과 풍부한 스니펫 지원
- 검색 엔진 및 소셜 미디어 최적화를 위한 메타데이터 구조화

---


[2025-06-17] - 🔒 보안 점검 및 UI 미세 조정

### 보안 점검 (Security Audit)
- ✅ axios 및 google-spreadsheet 패키지 보안 취약점 점검
- ✅ 기본 Content Security Policy (CSP) 메타 태그 추가
- ✅ InputPage 입력 유효성 검사 및 과도한 입력 방지 확인
- ✅ 개인정보 처리 방식 감사 (세션 내 메모리에만 저장, 서버 저장 없음)
- ✅ InputPage에 개인정보 처리 관련 안내문 추가 (한/영)

### UI 미세 조정 (UI Refinements)
- ✅ 메인 페이지 설명 텍스트 줄바꿈 렌더링 문제 해결 (whitespace-pre-line 적용)
- ✅ 메인 페이지 "시작하기" 버튼 InputPage로 연결
- ✅ 메인 페이지 설명 텍스트 투명도 조정 (60%)
- ✅ 메인 페이지 제목과 설명 간격 축소
- ✅ HTML 타이틀 태그에 i18n 적용 (동적 언어 변경 지원)

### 기술적 개선 (Technical Improvements)
- React 컴포넌트에서 document.title 동적 업데이트 구현
- useDocumentTitle 커스텀 훅 개발로 언어 변경 시 타이틀 자동 업데이트
- 메인 페이지 설명 텍스트 스타일링 최적화

---

[2025-06-17] - 🔒 Security Audit & UI Fine-tuning

### Security Audit
- ✅ Audited axios and google-spreadsheet packages for security vulnerabilities
- ✅ Added basic Content Security Policy (CSP) meta tag
- ✅ Verified input validation on InputPage to prevent excessive input
- ✅ Audited personal data handling (stored only in session memory, no server storage)
- ✅ Added privacy notice to InputPage in both Korean and English

### UI Refinements
- ✅ Fixed main page description line break rendering issue (applied whitespace-pre-line)
- ✅ Connected main page "Get Started" button to InputPage
- ✅ Adjusted main page description text opacity (60%)
- ✅ Reduced spacing between main page title and description
- ✅ Implemented i18n for HTML title tag (supports dynamic language switching)

### Technical Improvements
- Implemented dynamic document.title updates in React components
- Developed useDocumentTitle custom hook for automatic title updates on language change
- Optimized main page description text styling

---

[2025-06-15] - ✨ 로딩 페이지 구현

### Added
- ✅ InputPage와 ResultPage 사이에 로딩 페이지 추가
- ✅ 단계별 메시지가 표시되는 진행 표시줄 구현 (3단계)
- ✅ 로딩 메시지 다국어 지원 (i18n)
- ✅ 별이 빛나는 배경에 맞는 로딩 페이지 디자인

### Changed
- 🔄 로딩 시간을 초기 5초에서 최종 8초로 조정
- 🔄 로딩 바 디자인: 금색/노란색 바탕에 그라디언트 선행 가장자리 적용
- 🔄 로딩 메시지 위치를 로딩 바 내부로 이동
- 🔄 레이아웃을 수직 구조로 변경 (제목 위, 로딩 바 아래)

### Technical Improvements
- 로딩 바 애니메이션 최적화 (60fps, 16ms 업데이트 주기)
- 로딩 바 분절 현상 해결을 위한 선행 가장자리 기법 적용
- CSS 그라디언트와 SVG 반짝임 효과의 레이어링 최적화
- 반응형 디자인으로 모바일/데스크톱 환경 모두 지원

---

[2025-06-14] - 🌐 도메인 설정 및 파비콘 구현

### Added
- ✅ 프로젝트 도메인 구매 및 설정
- ✅ 커스텀 파비콘 디자인 및 추가 (`public/askstar-icon.png`)
- ✅ 다중 기기 호환성을 위한 파비콘 태그 추가

### Changed
- 🔄 GitHub Pages와 커스텀 도메인 연결 설정
- 🔄 DNS 설정 및 CNAME 파일 구성
- 🔄 기존 SVG 파비콘에서 PNG 파비콘으로 변경

### Technical Improvements
- 모바일 크롬 호환성을 위한 다양한 파비콘 태그 추가 (apple-touch-icon, Android sizes, msapplication)
- 웹사이트 브랜딩 및 아이덴티티 강화

[2025-06-13] - 📝 Result Page UI Details & Mobile Menu Toggle

### Added
- ✅ Result Page UI Details
- ✅ Mobile Menu Toggle

### Changed
- 🔄 Result Page UI Details
- 🔄 Mobile Menu Toggle

### Fixed
- 🐛 Result Page UI Details
- 🐛 Mobile Menu Toggle

### Changed
- 🔄 InputPage UI 개선
- 라벨명 미부여 및 i18n 통합 안된 부분 개선
- INPUT Field 크기 및 그리드 레이아웃 최적화
- 날짜/시간 구분자('/', ':') 추가로 가독성 향상
- 오류 메시지 알림 방식 및 위치 개선
- ResultPage UI 개선
- '궁합 보러가기', '결과 공유하기' 버튼에 준비중 표시 추가
- 버튼 호버 시 말풍선으로 "다음 업데이트로 준비중입니다" 안내 메시지 표시
- TextBalloon 컴포넌트 구현으로 일관된 사용자 경험 제공
- MainPage 개선
- 네비게이터 모바일 버전 업데이트
- 석삼자(태양궁, 달궁, 상승궁) 토글화 구현
- 버그 수정
- 태양궁 계산 시 발생하던 1일 오차 문제 해결

### Technical Improvements
- i18n 통합 시스템 강화
- 다국어 지원을 위한 번역 파일 구조화
- 반응형 디자인 개선으로 다양한 디바이스 지원 강화

---

[2025-06-12] - 🔄 3rd Palace Analysis Algorithm Update & Input Page Refinement

### Changed
- 🔄 Updated 3rd palace analysis algorithm for improved accuracy
- 🔄 Refined InputPage error handling and validation logic

### Fixed
- 🐛 Fixed city field validation to make it required for form submission
- 🐛 Improved error message display to only show after user interaction
- 🐛 Fixed Start Analysis button state to remain disabled until all fields are valid

---

[2025-06-11] - 🚀 Optimization, Build & Distribution

### Changed
- 🔧 Optimized application performance for production
- 🔄 Updated 3 palace analysis algorithm for better results

### Added
- 📦 Built and Deploy production version

---

[2025-06-09] -   ✨ 결과 해석 페이지 개발 및 성별 특화 해석 기능 추가

### Added
- ✅ 사용자의 태양, 달, 상승궁 별자리에 대한 기본 해석을 보여주는 결과 페이지 구현
- ✅ 성별에 따른 특화된 별자리 해석 기능 추가 (남성/여성 특화 해석)
- ✅ 한국어와 영어 두 언어에 대한 성별 특화 해석 지원
- ✅ 별자리 아이콘 및 해석 카드 컴포넌트 개발
- ✅ 애니메이션 효과를 적용한 결과 표시 UI 개선

### Changed
- 🔄 별자리 해석 데이터 구조 최적화
- 🔄 성별 특화 해석을 위한 데이터 접근 로직 개선

### Fixed
- 🐛 언어 전환 시 해석 텍스트가 올바르게 업데이트되지 않는 문제 해결
- 🐛 성별 특화 해석이 없는 경우 기본 해석으로 대체되도록 수정

---

[2025-06-08] - Added input page with user form and implemented internationalization (i18n) system

### Added
- Implemented internationalization (i18n) system with support for Korean and English languages
- Added a dedicated translation data file for better maintainability
- Created Input Page with user information form (name, gender, zodiac signs)
- Implemented Custom Select component with animation effects
- Added StarryBackground shared component for consistent UI between pages
- Connected Home page to Input page with proper navigation
- Implemented form validation for required fields

---

[2025-06-07] - SVG Icon Components Implementation
✨ Added

12 Zodiac Sign Icon Components: Complete React TypeScript implementation

AriesIcon.tsx - Aries zodiac icon
TaurusIcon.tsx - Taurus zodiac icon
GeminiIcon.tsx - Gemini zodiac icon
CancerIcon.tsx - Cancer zodiac icon
LeoIcon.tsx - Leo zodiac icon
VirgoIcon.tsx - Virgo zodiac icon
LibraIcon.tsx - Libra zodiac icon
ScorpioIcon.tsx - Scorpio zodiac icon
SagittariusIcon.tsx - Sagittarius zodiac icon
CapricornIcon.tsx - Capricorn zodiac icon
AquariusIcon.tsx - Aquarius zodiac icon
PiscesIcon.tsx - Pisces zodiac icon


Icon Components Index: components/icons/index.ts for unified exports
TypeScript Support: Full React.FC<SVGProps<SVGSVGElement>> type definitions

🔧 Technical Features

Customizable Properties: Size, color, className, and all SVG attributes
Tree-shaking Optimized: Individual component files for optimal bundling
Consistent Naming: [ZodiacName]Icon.tsx convention
Responsive Design: Scalable vector graphics for all screen sizes

💻 Usage Example
typescriptimport { AriesIcon, LeoIcon } from '@/components/icons';

// Basic usage
<AriesIcon />

// Customized usage
<LeoIcon size={32} className="text-red-500" />
📁 File Structure
components/
├── icons/
│   ├── AriesIcon.tsx
│   ├── TaurusIcon.tsx
│   ├── GeminiIcon.tsx
│   ├── CancerIcon.tsx
│   ├── LeoIcon.tsx
│   ├── VirgoIcon.tsx
│   ├── LibraIcon.tsx
│   ├── ScorpioIcon.tsx
│   ├── SagittariusIcon.tsx
│   ├── CapricornIcon.tsx
│   ├── AquariusIcon.tsx
│   ├── PiscesIcon.tsx
│   └── index.ts
🎯 Benefits

Performance: Optimized SVG rendering with React components
Maintainability: Centralized icon management
Scalability: Easy to add new zodiac-related icons
Developer Experience: Full TypeScript IntelliSense support


## [2025-05-24] - Multilingual Static Data Generation System

### ✨ Added
- 🌍 **Multilingual Data System**
  - Korean interpretation data (84 items)
  - English interpretation data (84 items)
  - Google Sheets to JSON conversion pipeline
  - Automated data generation scripts
  - Language-specific data loading utilities

### 🎯 Overview
- Converted from API-based to static JSON approach for performance
- Built Korean & English interpretation data pipeline
- Created modular data structure for 1,728 combinations

### 📊 Data Generated
- Korean interpretations: 84 items (36 basic + 48 gender-specific)
- English interpretations: 84 items (36 basic + 48 gender-specific)  
- JSON format optimized for fast loading

### 🔧 Scripts Added
- `scripts/convertSheetToJson_ko.js` (Korean data conversion)
- `scripts/convertSheetToJson_en.js` (English data conversion)
- `scripts/convertAllLanguages.js` (unified execution)
- `src/data/index.js` (language loading utility)

### 🌍 i18n Implementation
- English-first with Korean support structure
- Easy to add more languages in future
- Google Sheets backend for easy content management

### 📋 Technical Details
- Google Sheets API integration for data management
- Modular JSON structure for 1,728 possible combinations
- Support for Sun, Moon, Ascendant signs with gender-specific interpretations
- Automated build process integration

### 🚀 Next Steps
- Complete English script integration and test full pipeline
- Frontend language selection implementation
- Translation quality improvements

---

## [Previous Updates]
*Previous changelog entries will be added below this line*
