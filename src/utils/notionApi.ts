import { Client } from '@notionhq/client';

// 노션 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_API_KEY || import.meta.env.VITE_NOTION_API_KEY,
});

// 아티클 데이터베이스 ID (환경변수에서 관리)
const ARTICLE_DATABASE_ID = '237de4ac-0fc5-80e5-a0a5-c05f32b94eef';

// 아티클 타입 정의
export interface Article {
  id: string;
  title: string;
  url: string;
  content?: string;
  createdTime: string;
  lastEditedTime: string;
  published: boolean;
}

// 노션 데이터베이스에서 아티클 목록 조회
export async function getArticleList(): Promise<Article[]> {
  try {
    const response = await notion.databases.query({
      database_id: ARTICLE_DATABASE_ID,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'Created',
          direction: 'descending',
        },
      ],
    });

    return response.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Title?.title?.[0]?.plain_text || 'Untitled',
      url: page.properties.URL?.rich_text?.[0]?.plain_text || '',
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
      published: page.properties.Published?.checkbox || false,
    }));
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
}

// 특정 아티클의 상세 내용 조회
export async function getArticleContent(pageId: string): Promise<string> {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
    });

    // 블록들을 텍스트로 변환 (간단한 구현)
    let content = '';
    for (const block of response.results) {
      content += convertBlockToText(block as any);
    }

    return content;
  } catch (error) {
    console.error('Error fetching article content:', error);
    throw error;
  }
}

// 노션 블록을 텍스트로 변환하는 헬퍼 함수
function convertBlockToText(block: any): string {
  switch (block.type) {
    case 'paragraph':
      return block.paragraph.rich_text.map((text: any) => text.plain_text).join('') + '\n\n';
    case 'heading_1':
      return '# ' + block.heading_1.rich_text.map((text: any) => text.plain_text).join('') + '\n\n';
    case 'heading_2':
      return '## ' + block.heading_2.rich_text.map((text: any) => text.plain_text).join('') + '\n\n';
    case 'heading_3':
      return '### ' + block.heading_3.rich_text.map((text: any) => text.plain_text).join('') + '\n\n';
    case 'bulleted_list_item':
      return '- ' + block.bulleted_list_item.rich_text.map((text: any) => text.plain_text).join('') + '\n';
    case 'numbered_list_item':
      return '1. ' + block.numbered_list_item.rich_text.map((text: any) => text.plain_text).join('') + '\n';
    default:
      return '';
  }
}

// URL로 아티클 찾기
export async function getArticleByUrl(url: string): Promise<Article | null> {
  try {
    const response = await notion.databases.query({
      database_id: ARTICLE_DATABASE_ID,
      filter: {
        and: [
          {
            property: 'URL',
            rich_text: {
              equals: url,
            },
          },
          {
            property: 'Published',
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    });

    if (response.results.length === 0) {
      return null;
    }

    const page = response.results[0] as any;
    const content = await getArticleContent(page.id);

    return {
      id: page.id,
      title: page.properties.Title?.title?.[0]?.plain_text || 'Untitled',
      url: page.properties.URL?.rich_text?.[0]?.plain_text || '',
      content,
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
      published: page.properties.Published?.checkbox || false,
    };
  } catch (error) {
    console.error('Error fetching article by URL:', error);
    throw error;
  }
}
