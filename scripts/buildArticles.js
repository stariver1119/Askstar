import { Client } from '@notionhq/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

console.log('🚀 스크립트 시작...');

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

// 노션 블록을 HTML로 변환
function convertBlockToHTML(block) {
  switch (block.type) {
    case 'paragraph':
      const paragraphText = block.paragraph.rich_text.map(text => {
        let content = text.plain_text;
        if (text.annotations.bold) content = `<strong>${content}</strong>`;
        if (text.annotations.italic) content = `<em>${content}</em>`;
        if (text.annotations.code) content = `<code>${content}</code>`;
        if (text.href) content = `<a href="${text.href}" target="_blank">${content}</a>`;
        return content;
      }).join('');
      return `<p class="mb-4 text-gray-700 leading-relaxed">${paragraphText}</p>`;
      
    case 'heading_1':
      const h1Text = block.heading_1.rich_text.map(text => text.plain_text).join('');
      return `<h1 class="text-3xl font-bold text-gray-900 mb-6 mt-8">${h1Text}</h1>`;
      
    case 'heading_2':
      const h2Text = block.heading_2.rich_text.map(text => text.plain_text).join('');
      return `<h2 class="text-2xl font-semibold text-gray-800 mb-4 mt-6">${h2Text}</h2>`;
      
    case 'heading_3':
      const h3Text = block.heading_3.rich_text.map(text => text.plain_text).join('');
      return `<h3 class="text-xl font-medium text-gray-800 mb-3 mt-5">${h3Text}</h3>`;
      
    case 'bulleted_list_item':
      const bulletText = block.bulleted_list_item.rich_text.map(text => text.plain_text).join('');
      return `<li class="mb-2 text-gray-700">${bulletText}</li>`;
      
    case 'numbered_list_item':
      const numberText = block.numbered_list_item.rich_text.map(text => text.plain_text).join('');
      return `<li class="mb-2 text-gray-700">${numberText}</li>`;
      
    case 'quote':
      const quoteText = block.quote.rich_text.map(text => text.plain_text).join('');
      return `<blockquote class="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 text-gray-700 italic">${quoteText}</blockquote>`;
      
    case 'code':
      const codeText = block.code.rich_text.map(text => text.plain_text).join('');
      return `<pre class="bg-gray-100 rounded-lg p-4 mb-4 overflow-x-auto"><code class="text-sm">${codeText}</code></pre>`;
      
    default:
      return '';
  }
}

// 아티클 HTML 템플릿 생성 (투명 배경)
function generateArticleHTML(article, content) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title} - Askstar</title>
    <meta name="description" content="${article.title}">
    <meta property="og:title" content="${article.title}">
    <meta property="og:description" content="${article.title}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://askstar.kr/article/${article.url}">
    <style>
        body { 
            font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif; 
            background: transparent;
            color: rgb(255 255 255 / 0.9);
            line-height: 1.7;
        }
        h1 { 
            color: rgb(196 181 253); 
            font-size: 2rem; 
            font-weight: bold; 
            margin-bottom: 1.5rem; 
            margin-top: 0;
        }
        h2 { 
            color: rgb(196 181 253); 
            font-size: 1.75rem; 
            font-weight: bold; 
            margin-bottom: 1.25rem; 
            margin-top: 2rem;
        }
        h3 { 
            color: rgb(167 139 250); 
            font-size: 1.5rem; 
            font-weight: bold; 
            margin-bottom: 1rem; 
            margin-top: 1.5rem;
        }
        p { 
            color: rgb(255 255 255 / 0.8); 
            margin-bottom: 1rem; 
            font-size: 1.1rem;
        }
        strong { 
            color: rgb(255 255 255 / 0.95); 
            font-weight: 600;
        }
        em { 
            color: rgb(255 255 255 / 0.85);
        }
        ul, ol { 
            color: rgb(255 255 255 / 0.8); 
            margin-bottom: 1rem;
        }
        li { 
            color: rgb(255 255 255 / 0.8); 
            margin-bottom: 0.5rem;
        }
        a { 
            color: rgb(167 139 250); 
            text-decoration: underline;
        }
        blockquote { 
            color: rgb(255 255 255 / 0.8); 
            border-left: 4px solid rgb(167 139 250); 
            padding-left: 1rem; 
            margin: 1.5rem 0; 
            font-style: italic;
        }
    </style>
</head>
<body>
    <div style="padding: 2rem; max-width: none;">
        ${content}
    </div>
</body>
</html>`;
}

// 메인 빌드 함수
async function buildArticles() {
  console.log('🚀 아티클 빌드 시작...');
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
    
    console.log(`📝 조회된 페이지 수: ${response.results.length}`);

    const articles = [];

    // 각 아티클 처리
    for (const page of response.results) {
      const article = {
        id: page.id,
        title: page.properties.Name?.title?.[0]?.plain_text || 'Untitled',
        url: page.properties.URL?.rich_text?.[0]?.plain_text || '',
        createdTime: page.created_time,
        lastEditedTime: page.last_edited_time,
      };

      if (!article.url) {
        console.warn(`⚠️  아티클 "${article.title}"에 URL이 없습니다. 건너뜁니다.`);
        continue;
      }

      console.log(`📝 처리 중: ${article.title} (${article.url})`);

      // 아티클 내용 가져오기
      const blocksResponse = await notion.blocks.children.list({
        block_id: page.id,
      });

      // 블록들을 HTML로 변환
      let content = '';
      let inList = false;
      let listType = '';

      for (const block of blocksResponse.results) {
        if (block.type === 'bulleted_list_item') {
          if (!inList) {
            content += '<ul class="list-disc list-inside mb-4 space-y-1">';
            inList = true;
            listType = 'ul';
          } else if (listType !== 'ul') {
            content += '</ol><ul class="list-disc list-inside mb-4 space-y-1">';
            listType = 'ul';
          }
        } else if (block.type === 'numbered_list_item') {
          if (!inList) {
            content += '<ol class="list-decimal list-inside mb-4 space-y-1">';
            inList = true;
            listType = 'ol';
          } else if (listType !== 'ol') {
            content += '</ul><ol class="list-decimal list-inside mb-4 space-y-1">';
            listType = 'ol';
          }
        } else {
          if (inList) {
            content += listType === 'ul' ? '</ul>' : '</ol>';
            inList = false;
            listType = '';
          }
        }

        content += convertBlockToHTML(block);
      }

      // 리스트가 끝나지 않은 경우 닫기
      if (inList) {
        content += listType === 'ul' ? '</ul>' : '</ol>';
      }

      // HTML 파일 생성
      const html = generateArticleHTML(article, content);
      const filePath = path.join(ARTICLES_DIR, `${article.url}.html`);
      fs.writeFileSync(filePath, html, 'utf8');

      articles.push(article);
      console.log(`✅ 생성 완료: ${filePath}`);
    }

    // 아티클 메타데이터 JSON 파일 생성
    const articlesData = {
      articles,
      buildTime: new Date().toISOString(),
      totalCount: articles.length,
    };

    const jsonPath = path.join(DATA_DIR, 'articles.json');
    fs.writeFileSync(jsonPath, JSON.stringify(articlesData, null, 2), 'utf8');

    console.log(`📊 메타데이터 생성 완료: ${jsonPath}`);
    console.log(`🎉 빌드 완료! 총 ${articles.length}개 아티클이 생성되었습니다.`);

  } catch (error) {
    console.error('❌ 빌드 중 오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트 실행
console.log('🏃 buildArticles 함수 실행 시작...');
buildArticles().catch(error => {
  console.error('❌ 빌드 오류:', error);
  process.exit(1);
});
