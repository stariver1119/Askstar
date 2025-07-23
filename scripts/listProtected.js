import path from 'path';
import { fileURLToPath } from 'url';
import { getProtectedFiles } from './utils/fileProtection.js';

// ES 모듈에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 출력 디렉토리 설정
const PUBLIC_DIR = path.join(__dirname, '../public');
const ARTICLES_DIR = path.join(PUBLIC_DIR, 'articles');

console.log('🛡️  보호된 아티클 목록 조회 중...');
console.log(`📁 디렉토리: ${ARTICLES_DIR}`);

const protectedFiles = getProtectedFiles(ARTICLES_DIR);

if (protectedFiles.length === 0) {
  console.log('✅ 현재 보호된 아티클이 없습니다.');
} else {
  console.log(`\n🛡️  보호된 아티클 ${protectedFiles.length}개:`);
  console.log('─'.repeat(80));
  
  protectedFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file.url}`);
    console.log(`   📝 파일명: ${file.filename}`);
    if (file.lastNotionUpdate) {
      const updateDate = new Date(file.lastNotionUpdate).toLocaleString('ko-KR');
      console.log(`   📅 마지막 노션 업데이트: ${updateDate}`);
    }
    console.log();
  });

  console.log('💡 보호를 해제하려면: npm run unprotect-article -- --url <article-url>');
}

console.log('\n🔍 보호 상태 확인 완료.');