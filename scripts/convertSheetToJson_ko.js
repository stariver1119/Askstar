import 'dotenv/config';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertToJson() {
  try {
    // 🔥 [필수 수정] 여기에 당신의 구글 시트 ID를 입력하세요
    const SHEET_ID = "1VuPKVy7Kn1d5bjvG1jo3MFBt0MK1UCutCVFBaR4ZwUU";
    
    // 1. 구글 시트 접근
    const doc = new GoogleSpreadsheet(SHEET_ID);
    
    // 2. 인증 - 🔥 [필수 수정] 환경변수 또는 직접 입력
    await doc.useServiceAccountAuth({
      client_email: "moonshill@askstar-projec.iam.gserviceaccount.com", // 🔥 수정 필요
      private_key: process.env.GOOGLE_PRIVATE_KEY // 환경 변수에서 가져옴
    });
    
    // 3. 시트 정보 로드
    await doc.loadInfo();
    console.log('✅ 구글 시트 연결 성공:', doc.title);
    
    // 4. 각 시트에서 데이터 읽기
    // 🔥 [확인 필요] 시트 이름이 정확한지 확인하세요
    const basicSheet = doc.sheetsByTitle['기본_별자리_설명'];
    const genderSheet = doc.sheetsByTitle['성별_특화_설명'];
    
    if (!basicSheet || !genderSheet) {
      throw new Error('❌ 시트를 찾을 수 없습니다. 시트 이름을 확인하세요.');
    }
    
    // 5. 데이터 변환 및 구조화
    console.log('🔄 데이터 변환 중...');
    const jsonData = await processData(basicSheet, genderSheet);
    
    // 6. JSON 파일로 저장
    // 🔥 [경로 수정 가능] 저장할 경로를 확인하세요
    const outputPath = './src/data/interpretations_ko.json';
    
    // 디렉토리가 없으면 생성
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
    console.log('✅ JSON 파일 생성 완료:', outputPath);
    
  } catch (error) {
    console.error('❌ 변환 실패:', error.message);
    process.exit(1);
  }
}

async function processData(basicSheet, genderSheet) {
  // 구글 시트 데이터 읽기
  const basicRows = await basicSheet.getRows();
  const genderRows = await genderSheet.getRows();
  
  console.log(`📊 기본 해석 데이터: ${basicRows.length}개`);
  console.log(`📊 성별 특화 데이터: ${genderRows.length}개`);
  
  // 빈 JSON 구조 생성
  const result = {
    basic_interpretations: {
      sun: {},
      moon: {},
      ascendant: {}
    },
    gender_specific: {
      male: { sun: {}, moon: {} },
      female: { sun: {}, moon: {} }
    }
  };
  
  // 기본 해석 데이터 변환
  basicRows.forEach(row => {
    // 🔥 [컬럼명 확인] 구글 시트의 컬럼명과 일치하는지 확인하세요
    const type = row['궁_타입'];    // 첫 번째 열
    const sign = row['별자리'];     // 두 번째 열  
    const desc = row['설명'];       // 세 번째 열
    
    if (type === '태양궁') {
      result.basic_interpretations.sun[sign] = desc;
    } else if (type === '달궁') {
      result.basic_interpretations.moon[sign] = desc;
    } else if (type === '어센던트') {
      result.basic_interpretations.ascendant[sign] = desc;
    }
  });
  
  // 성별 특화 데이터 변환
  genderRows.forEach(row => {
    // 🔥 [컬럼명 확인] 구글 시트의 컬럼명과 일치하는지 확인하세요
    const gender = row['성별'];     // 첫 번째 열
    const type = row['궁_타입'];    // 두 번째 열
    const sign = row['별자리'];     // 세 번째 열
    const desc = row['설명'];       // 네 번째 열
    
    const genderKey = gender === '남성' ? 'male' : 'female';
    const typeKey = type === '태양궁' ? 'sun' : 'moon';
    
    result.gender_specific[genderKey][typeKey][sign] = desc;
  });
  
  return result;
}

// 스크립트 실행
convertToJson();
