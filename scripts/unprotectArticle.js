import path from 'path';
import { fileURLToPath } from 'url';
import { setProtectionStatus } from './utils/fileProtection.js';

// ES 모듈에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 출력 디렉토리 설정
const PUBLIC_DIR = path.join(__dirname, '../public');
const ARTICLES_DIR = path.join(PUBLIC_DIR, 'articles');

// 명령행 인수 파싱
const args = process.argv.slice(2);
const urlIndex = args.indexOf('--url');

if (urlIndex === -1 || !args[urlIndex + 1]) {
  console.error('❌ 사용법: npm run unprotect-article -- --url <article-url>');
  console.error('예시: npm run unprotect-article -- --url sign_ai_pre');
  process.exit(1);
}

const articleUrl = args[urlIndex + 1];
const filePath = path.join(ARTICLES_DIR, `${articleUrl}.html`);

console.log(`🔓 아티클 보호 해제: ${articleUrl}`);
console.log(`📁 파일 경로: ${filePath}`);

const success = setProtectionStatus(filePath, false);

if (success) {
  console.log(`✅ "${articleUrl}" 아티클의 보호가 해제되었습니다.`);
  console.log('💡 이제 이 파일은 업데이트 스크립트에 의해 자동으로 수정될 수 있습니다.');
} else {
  console.error(`❌ "${articleUrl}" 아티클 보호 해제에 실패했습니다.`);
  process.exit(1);
}