# Changelog

## 📝 Changelog Rules
- 최신 변경사항이 맨 위에 위치합니다
- 이전 로그는 아래쪽으로 이동합니다
- 날짜 형식: YYYY-MM-DD
- 카테고리: Added, Changed, Fixed, Removed
- 이모지와 상세 설명을 포함합니다

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
