import { GoogleSpreadsheet } from 'google-spreadsheet';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES 모듈에서 __dirname 사용하기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 환경 변수 로드
dotenv.config();

// 🔥 [필수 수정] 구글 시트 ID를 입력하세요
const SHEET_ID_EN = "1-HFN8jVRuAgU3J5i_ZPGqDrHxOUYyhMs_OyVZIeBlfA";

async function convertToJson() {
    try {
        console.log('🔄 Starting English data conversion...');
        
        // 1. 구글 시트 문서 객체 생성
        const doc = new GoogleSpreadsheet(SHEET_ID_EN);

        // 2. 서비스 계정으로 인증
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY
        });

        // 3. 문서 정보 로드
        await doc.loadInfo();
        console.log('✅ Successfully connected to English Google Sheet:', doc.title);
        
        // 4. 시트 가져오기
        const basicSheet = doc.sheetsByTitle['Basic_Sign_Descriptions'];
        const genderSheet = doc.sheetsByTitle['Gender_Specific_Descriptions'];
        
        if (!basicSheet || !genderSheet) {
            throw new Error('Required sheets (Basic_Sign_Descriptions, Gender_Specific_Descriptions) not found!');
        }
        
        // 5. 데이터 처리
        const data = await processData(basicSheet, genderSheet);
        
        // 6. JSON 파일로 저장
        const outputPath = './src/data/interpretations_en.json';
        
        // 디렉토리가 없으면 생성
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // JSON 파일 저장
        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
        console.log('✅ English JSON file created:', outputPath);
        
    } catch (error) {
        console.error('❌ 변환 실패:', error.message);
        process.exit(1);
    }
}

async function processData(basicSheet, genderSheet) {
    const basicRows = await basicSheet.getRows();
    const genderRows = await genderSheet.getRows();
    
    const data = {
        basic_interpretations: {
            sun: {},
            moon: {},
            ascendant: {}
        },
        gender_specific: {
            male: {},
            female: {}
        }
    };
    
    // Process basic zodiac interpretations
    for (const row of basicRows) {
        const type = row['Sign_Type'];
        const sign = row['Sign'];
        const desc = row['Description'];
        
        if (type === 'Sun') {
            data.basic_interpretations.sun[sign] = desc;
        } else if (type === 'Moon') {
            data.basic_interpretations.moon[sign] = desc;
        } else if (type === 'Ascendant') {
            data.basic_interpretations.ascendant[sign] = desc;
        }
    }
    
    // Process gender-specific interpretations
    for (const row of genderRows) {
        const sign = row['Sign'];
        const gender = row['Gender'];
        const desc = row['Description'];
        
        if (gender === 'Male') {
            data.gender_specific.male[sign] = desc;
        } else if (gender === 'Female') {
            data.gender_specific.female[sign] = desc;
        }
    }
    
    return data;
}

// 스크립트 실행
convertToJson();
