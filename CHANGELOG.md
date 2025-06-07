# Changelog

## 📝 Changelog Rules
- 최신 변경사항이 맨 위에 위치합니다
- 이전 로그는 아래쪽으로 이동합니다
- 날짜 형식: YYYY-MM-DD
- 카테고리: Added, Changed, Fixed, Removed
- 이모지와 상세 설명을 포함합니다

---

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
