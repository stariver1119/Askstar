import { Client } from '@notionhq/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { normalizeNotionArticle, updateArticlesJson } from './utils/articleComparator.js';
import { generateArticleHTML, convertBlocksToContent } from './utils/htmlGenerator.js';

console.log('🔄 전체 아티클 재빌드 시작...');

// ES 모듈에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 환경변수 로딩 중...');
// 환경변수 로드
dotenv.config({ path: path.join(__dirname, '../.env') });
console.log('✅ 환경변수 로딩 완료');

// 노션 클라이언트 초기화
console.log('🔑 노션 API 키 확인:', process.env.NOTION_API_KEY ? '존재함' : '없음');
console.log('📝 노션 클라이언트 초기화 중...');
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});
console.log('✅ 노션 클라이언트 초기화 완료');

// 아티클 데이터베이스 ID
const ARTICLE_DATABASE_ID = '237de4ac-0fc5-80e5-a0a5-c05f32b94eef';

// 출력 디렉토리 설정
const PUBLIC_DIR = path.join(__dirname, '../public');
const ARTICLES_DIR = path.join(PUBLIC_DIR, 'articles');
const DATA_DIR = path.join(PUBLIC_DIR, 'data');

// 디렉토리 생성
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 기존 아티클 파일들을 모두 삭제
function clearExistingArticles() {
  if (fs.existsSync(ARTICLES_DIR)) {
    const files = fs.readdirSync(ARTICLES_DIR).filter(file => file.endsWith('.html'));
    console.log(`🗑️  기존 HTML 파일 ${files.length}개 삭제 중...`);
    
    files.forEach(file => {
      const filePath = path.join(ARTICLES_DIR, file);
      fs.unlinkSync(filePath);
      console.log(`   - ${file} 삭제됨`);
    });
  }
  
  // articles.json도 삭제
  const jsonPath = path.join(DATA_DIR, 'articles.json');
  if (fs.existsSync(jsonPath)) {
    fs.unlinkSync(jsonPath);
    console.log('📊 기존 articles.json 삭제됨');
  }
}

// 메인 재빌드 함수
async function rebuildAll() {
  console.log('🔄 전체 재빌드 시작...');
  console.log('📁 출력 디렉토리:', ARTICLES_DIR);
  console.log('📊 데이터 디렉토리:', DATA_DIR);
  console.log('🔑 노션 API 키 존재:', !!process.env.NOTION_API_KEY);
  console.log('🗂️ 데이터베이스 ID:', ARTICLE_DATABASE_ID);

  try {
    // 디렉토리 생성
    console.log('📁 디렉토리 생성 중...');
    ensureDirectoryExists(ARTICLES_DIR);
    ensureDirectoryExists(DATA_DIR);
    console.log('✅ 디렉토리 생성 완료');

    // 기존 파일들 삭제
    clearExistingArticles();

    // 노션에서 아티클 목록 가져오기
    console.log('📚 노션에서 아티클 목록 조회 중...');
    const response = await notion.databases.query({
      database_id: ARTICLE_DATABASE_ID,
      sorts: [
        {
          property: 'Created',
          direction: 'descending',
        },
      ],
    });
    
    console.log(`📝 노션에서 조회된 페이지 수: ${response.results.length}`);

    // 노션 아티클을 표준 형식으로 변환
    const notionArticles = response.results.map(normalizeNotionArticle);
    
    // URL이 없는 아티클 필터링
    const validArticles = notionArticles.filter(article => {
      if (!article.url) {
        console.warn(`⚠️  아티클 "${article.title}"에 URL이 없습니다. 건너뜁니다.`);
        return false;
      }
      return true;
    });

    console.log(`📝 처리할 아티클 수: ${validArticles.length}개`);

    const processedArticles = [];

    // 모든 아티클 처리
    for (const article of validArticles) {
      console.log(`📝 처리 중: ${article.title} (${article.url})`);

      // 아티클 내용 가져오기
      const blocksResponse = await notion.blocks.children.list({
        block_id: article.id,
      });

      // 블록들을 HTML로 변환
      const content = convertBlocksToContent(blocksResponse.results);

      // HTML 파일 생성
      const html = generateArticleHTML(article, content);
      const filePath = path.join(ARTICLES_DIR, `${article.url}.html`);
      fs.writeFileSync(filePath, html, 'utf8');

      processedArticles.push(article);
      console.log(`✅ 생성 완료: ${filePath}`);
    }

    // articles.json 새로 생성
    updateArticlesJson(DATA_DIR, processedArticles);

    console.log(`🎉 전체 재빌드 완료! ${processedArticles.length}개 아티클이 생성되었습니다.`);

  } catch (error) {
    console.error('❌ 재빌드 중 오류 발생:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// 사용자 확인
console.log('⚠️  경고: 이 작업은 모든 기존 아티클 파일을 삭제하고 다시 생성합니다.');
console.log('💡 수동으로 편집된 파일들이 모두 사라집니다.');
console.log('🚀 계속하려면 Enter를 누르세요. 취소하려면 Ctrl+C를 누르세요.');

process.stdin.once('data', () => {
  console.log('🏃 rebuildAll 함수 실행 시작...');
  rebuildAll().catch(error => {
    console.error('❌ 재빌드 오류:', error);
    process.exit(1);
  });
});

process.stdin.resume();