import fs from 'fs';
import path from 'path';

/**
 * 기존 articles.json을 로드합니다.
 * @param {string} dataDir - 데이터 디렉토리 경로
 * @returns {object} 기존 아티클 데이터
 */
export function loadExistingArticles(dataDir) {
  const jsonPath = path.join(dataDir, 'articles.json');
  
  if (!fs.existsSync(jsonPath)) {
    return {
      articles: [],
      buildTime: null,
      totalCount: 0
    };
  }

  try {
    const data = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('⚠️  기존 articles.json 로드 실패, 빈 데이터로 시작합니다:', error.message);
    return {
      articles: [],
      buildTime: null,
      totalCount: 0
    };
  }
}

/**
 * 노션 아티클 데이터를 표준 형식으로 변환합니다.
 * @param {object} page - 노션 페이지 객체
 * @returns {object} 표준화된 아티클 객체
 */
export function normalizeNotionArticle(page) {
  return {
    id: page.id,
    title: page.properties.Name?.title?.[0]?.plain_text || 'Untitled',
    url: page.properties.URL?.rich_text?.[0]?.plain_text || '',
    status: page.properties.Status?.select?.name || 'main',
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time,
  };
}

/**
 * 새로운 아티클을 찾습니다.
 * @param {Array} notionArticles - 노션에서 가져온 아티클 목록
 * @param {Array} existingArticles - 기존 아티클 목록
 * @returns {Array} 새로운 아티클 목록
 */
export function findNewArticles(notionArticles, existingArticles) {
  const existingUrls = new Set(existingArticles.map(article => article.url));
  
  return notionArticles.filter(article => {
    // URL이 없는 아티클은 제외
    if (!article.url) {
      console.warn(`⚠️  아티클 "${article.title}"에 URL이 없습니다. 건너뜁니다.`);
      return false;
    }
    
    // 기존에 없는 URL만 선택
    return !existingUrls.has(article.url);
  });
}

/**
 * 수정된 아티클을 찾습니다.
 * @param {Array} notionArticles - 노션에서 가져온 아티클 목록
 * @param {Array} existingArticles - 기존 아티클 목록
 * @returns {Array} 수정된 아티클 목록
 */
export function findModifiedArticles(notionArticles, existingArticles) {
  const existingMap = new Map();
  existingArticles.forEach(article => {
    existingMap.set(article.url, article);
  });

  return notionArticles.filter(notionArticle => {
    // URL이 없는 아티클은 제외
    if (!notionArticle.url) {
      return false;
    }

    const existing = existingMap.get(notionArticle.url);
    
    // 기존에 없는 아티클은 제외 (새 아티클)
    if (!existing) {
      return false;
    }

    // lastEditedTime 비교 (노션의 시간이 더 최신인 경우)
    const notionTime = new Date(notionArticle.lastEditedTime);
    const existingTime = new Date(existing.lastEditedTime);
    
    return notionTime > existingTime;
  });
}

/**
 * 삭제된 아티클을 찾습니다.
 * @param {Array} notionArticles - 노션에서 가져온 아티클 목록
 * @param {Array} existingArticles - 기존 아티클 목록
 * @returns {Array} 삭제된 아티클 목록
 */
export function findDeletedArticles(notionArticles, existingArticles) {
  const notionUrls = new Set(notionArticles.map(article => article.url).filter(Boolean));
  
  return existingArticles.filter(existing => {
    return !notionUrls.has(existing.url);
  });
}

/**
 * articles.json을 업데이트합니다.
 * @param {string} dataDir - 데이터 디렉토리 경로
 * @param {Array} newArticles - 새로 추가된 아티클
 * @param {Array} updatedArticles - 업데이트된 아티클
 * @param {Array} deletedUrls - 삭제할 아티클 URL 목록
 */
export function updateArticlesJson(dataDir, newArticles = [], updatedArticles = [], deletedUrls = []) {
  const existing = loadExistingArticles(dataDir);
  
  // 기존 아티클을 Map으로 변환
  const articleMap = new Map();
  existing.articles.forEach(article => {
    articleMap.set(article.url, article);
  });

  // 삭제된 아티클 제거
  deletedUrls.forEach(url => {
    articleMap.delete(url);
  });

  // 새 아티클 추가
  newArticles.forEach(article => {
    articleMap.set(article.url, article);
  });

  // 업데이트된 아티클 반영
  updatedArticles.forEach(article => {
    articleMap.set(article.url, article);
  });

  // 최종 데이터 생성
  const articlesData = {
    articles: Array.from(articleMap.values()).sort((a, b) => 
      new Date(b.createdTime) - new Date(a.createdTime)
    ),
    buildTime: new Date().toISOString(),
    totalCount: articleMap.size,
  };

  const jsonPath = path.join(dataDir, 'articles.json');
  fs.writeFileSync(jsonPath, JSON.stringify(articlesData, null, 2), 'utf8');
  
  console.log(`📊 메타데이터 업데이트 완료: ${jsonPath}`);
  return articlesData;
}