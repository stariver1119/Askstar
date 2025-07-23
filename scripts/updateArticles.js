import { Client } from '@notionhq/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { loadExistingArticles, normalizeNotionArticle, findModifiedArticles, updateArticlesJson } from './utils/articleComparator.js';
import { generateArticleHTML, convertBlocksToContent } from './utils/htmlGenerator.js';
import { checkProtectionStatus } from './utils/fileProtection.js';

console.log('🔄 아티클 업데이트 스크립트 시작...');

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

// 명령행 인수 파싱
const args = process.argv.slice(2);
const options = {
  force: args.includes('--force'),
  url: args.includes('--url') ? args[args.indexOf('--url') + 1] : null,
  ignoreProtection: args.includes('--ignore-protection'),
};

console.log('⚙️ 실행 옵션:', options);

// 디렉토리 생성
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 메인 업데이트 함수
async function updateArticles() {
  console.log('🔄 아티클 업데이트 시작...');
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

    // 기존 아티클 데이터 로드
    console.log('📖 기존 아티클 데이터 로드 중...');
    const existingData = loadExistingArticles(DATA_DIR);
    console.log(`📊 기존 아티클 수: ${existingData.articles.length}개`);

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

    let articlesToUpdate = [];

    if (options.url) {
      // 특정 URL만 업데이트
      const targetArticle = notionArticles.find(article => article.url === options.url);
      if (!targetArticle) {
        console.error(`❌ URL "${options.url}"에 해당하는 아티클을 찾을 수 없습니다.`);
        process.exit(1);
      }
      articlesToUpdate = [targetArticle];
      console.log(`🎯 특정 아티클 업데이트: ${targetArticle.title} (${targetArticle.url})`);
    } else if (options.force) {
      // 강제 업데이트 (기존에 있는 모든 아티클)
      const existingUrls = new Set(existingData.articles.map(article => article.url));
      articlesToUpdate = notionArticles.filter(article => 
        article.url && existingUrls.has(article.url)
      );
      console.log(`💪 강제 업데이트: ${articlesToUpdate.length}개 아티클`);
    } else {
      // 수정된 아티클만 찾기
      articlesToUpdate = findModifiedArticles(notionArticles, existingData.articles);
      console.log(`🔍 수정된 아티클 ${articlesToUpdate.length}개를 발견했습니다.`);
    }

    if (articlesToUpdate.length === 0) {
      console.log('🎉 업데이트할 아티클이 없습니다.');
      return;
    }

    console.log('📝 업데이트할 아티클 목록:');
    articlesToUpdate.forEach(article => {
      console.log(`   - ${article.title} (${article.url})`);
    });

    const processedArticles = [];
    const skippedArticles = [];

    // 각 아티클 처리
    for (const article of articlesToUpdate) {
      const filePath = path.join(ARTICLES_DIR, `${article.url}.html`);
      
      // 보호 상태 확인
      const protection = checkProtectionStatus(filePath);
      
      if (protection.isProtected && !options.ignoreProtection) {
        console.log(`🛡️  보호된 파일 건너뜀: ${article.title} (${article.url})`);
        skippedArticles.push(article);
        continue;
      }

      console.log(`📝 업데이트 중: ${article.title} (${article.url})`);

      // 기존 파일 삭제 (있다면)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️  기존 파일 삭제: ${path.basename(filePath)}`);
      }

      // 아티클 내용 가져오기
      const blocksResponse = await notion.blocks.children.list({
        block_id: article.id,
      });

      // 블록들을 HTML로 변환
      const content = convertBlocksToContent(blocksResponse.results);

      // HTML 파일 생성
      const html = generateArticleHTML(article, content);
      fs.writeFileSync(filePath, html, 'utf8');

      processedArticles.push(article);
      console.log(`✅ 업데이트 완료: ${filePath}`);
    }

    // articles.json 업데이트
    if (processedArticles.length > 0) {
      updateArticlesJson(DATA_DIR, [], processedArticles);
    }

    // 결과 요약
    console.log('\n📊 업데이트 결과:');
    console.log(`   ✅ 업데이트됨: ${processedArticles.length}개`);
    console.log(`   🛡️  보호로 인해 건너뜀: ${skippedArticles.length}개`);
    
    if (skippedArticles.length > 0) {
      console.log('\n🛡️  보호된 파일 목록:');
      skippedArticles.forEach(article => {
        console.log(`   - ${article.title} (${article.url})`);
      });
      console.log('\n💡 보호된 파일을 업데이트하려면 --ignore-protection 옵션을 사용하세요.');
    }

    console.log(`🎉 아티클 업데이트 완료!`);

  } catch (error) {
    console.error('❌ 업데이트 중 오류 발생:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// 스크립트 실행
console.log('🏃 updateArticles 함수 실행 시작...');
updateArticles().catch(error => {
  console.error('❌ 업데이트 오류:', error);
  process.exit(1);
});