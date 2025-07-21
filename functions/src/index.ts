import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Client } from '@notionhq/client';
import * as cors from 'cors';

// Firebase Admin 초기화
admin.initializeApp();

// CORS 설정
const corsHandler = cors({ origin: true });

// 노션 클라이언트 초기화
const notion = new Client({
  auth: functions.config().notion?.api_key || process.env.NOTION_API_KEY,
});

// 아티클 데이터베이스 ID
const ARTICLE_DATABASE_ID = '237de4ac-0fc5-80e5-a0a5-c05f32b94eef';

// 아티클 타입 정의
interface Article {
  id: string;
  title: string;
  url: string;
  content?: string;
  createdTime: string;
  lastEditedTime: string;
}

// 노션 블록을 HTML로 변환하는 함수
function convertBlockToHTML(block: any): string {
  switch (block.type) {
    case 'paragraph':
      const paragraphText = block.paragraph.rich_text.map((text: any) => {
        let content = text.plain_text;
        if (text.annotations.bold) content = `<strong>${content}</strong>`;
        if (text.annotations.italic) content = `<em>${content}</em>`;
        if (text.annotations.code) content = `<code>${content}</code>`;
        if (text.href) content = `<a href="${text.href}" target="_blank">${content}</a>`;
        return content;
      }).join('');
      return `<p class="mb-4 text-gray-700 leading-relaxed">${paragraphText}</p>`;
      
    case 'heading_1':
      const h1Text = block.heading_1.rich_text.map((text: any) => text.plain_text).join('');
      return `<h1 class="text-3xl font-bold text-gray-900 mb-6 mt-8">${h1Text}</h1>`;
      
    case 'heading_2':
      const h2Text = block.heading_2.rich_text.map((text: any) => text.plain_text).join('');
      return `<h2 class="text-2xl font-semibold text-gray-800 mb-4 mt-6">${h2Text}</h2>`;
      
    case 'heading_3':
      const h3Text = block.heading_3.rich_text.map((text: any) => text.plain_text).join('');
      return `<h3 class="text-xl font-medium text-gray-800 mb-3 mt-5">${h3Text}</h3>`;
      
    case 'bulleted_list_item':
      const bulletText = block.bulleted_list_item.rich_text.map((text: any) => text.plain_text).join('');
      return `<li class="mb-2 text-gray-700">${bulletText}</li>`;
      
    case 'numbered_list_item':
      const numberText = block.numbered_list_item.rich_text.map((text: any) => text.plain_text).join('');
      return `<li class="mb-2 text-gray-700">${numberText}</li>`;
      
    case 'quote':
      const quoteText = block.quote.rich_text.map((text: any) => text.plain_text).join('');
      return `<blockquote class="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 text-gray-700 italic">${quoteText}</blockquote>`;
      
    case 'code':
      const codeText = block.code.rich_text.map((text: any) => text.plain_text).join('');
      return `<pre class="bg-gray-100 rounded-lg p-4 mb-4 overflow-x-auto"><code class="text-sm">${codeText}</code></pre>`;
      
    default:
      return '';
  }
}

// 새 아티클 목록 조회 함수
export const getNewArticles = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      // 요청 메서드 확인
      if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
      }

      // 레이트 리미팅 (간단한 구현)
      const clientIP = req.ip;
      const now = Date.now();
      
      // 노션에서 아티클 목록 조회
      const response = await notion.databases.query({
        database_id: ARTICLE_DATABASE_ID,
        sorts: [
          {
            property: 'Created',
            direction: 'descending',
          },
        ],
      });

      const articles: Article[] = response.results.map((page: any) => ({
        id: page.id,
        title: page.properties.Name?.title?.[0]?.plain_text || 'Untitled',
        url: page.properties.URL?.rich_text?.[0]?.plain_text || '',
        createdTime: page.created_time,
        lastEditedTime: page.last_edited_time,
      }));

      res.json({
        articles,
        timestamp: new Date().toISOString(),
        totalCount: articles.length,
      });

    } catch (error) {
      console.error('Error fetching new articles:', error);
      res.status(500).json({ 
        error: 'Failed to fetch articles',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
});

// 특정 아티클 내용 조회 함수
export const getArticleContent = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      // 요청 메서드 확인
      if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
      }

      const { url: articleUrl } = req.query;
      
      if (!articleUrl || typeof articleUrl !== 'string') {
        res.status(400).json({ error: 'Article URL is required' });
        return;
      }

      // URL로 아티클 찾기
      const response = await notion.databases.query({
        database_id: ARTICLE_DATABASE_ID,
        filter: {
          property: 'URL',
          rich_text: {
            equals: articleUrl,
          },
        },
      });

      if (response.results.length === 0) {
        res.status(404).json({ error: 'Article not found' });
        return;
      }

      const page = response.results[0] as any;
      
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

      const article: Article = {
        id: page.id,
        title: page.properties.Name?.title?.[0]?.plain_text || 'Untitled',
        url: page.properties.URL?.rich_text?.[0]?.plain_text || '',
        content,
        createdTime: page.created_time,
        lastEditedTime: page.last_edited_time,
      };

      res.json(article);

    } catch (error) {
      console.error('Error fetching article content:', error);
      res.status(500).json({ 
        error: 'Failed to fetch article content',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
});
