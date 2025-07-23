/**
 * 노션 블록을 HTML로 변환합니다.
 * @param {object} block - 노션 블록 객체
 * @returns {string} HTML 문자열
 */
export function convertBlockToHTML(block) {
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

/**
 * 아티클 HTML 템플릿을 생성합니다.
 * @param {object} article - 아티클 객체
 * @param {string} content - HTML 콘텐츠
 * @param {object} options - 추가 옵션 (isProtected 등)
 * @returns {string} 완성된 HTML
 */
export function generateArticleHTML(article, content, options = {}) {
  const { isProtected = false } = options;
  
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <!-- ASKSTAR_GENERATED: true -->
    <!-- MANUAL_EDIT_PROTECTED: ${isProtected} -->
    <!-- LAST_NOTION_UPDATE: ${article.lastEditedTime} -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title} - Askstar</title>
    <meta name="description" content="${article.title}">
    <meta name="article-status" content="${article.status || 'main'}">
    <meta name="article-id" content="${article.id}">
    <meta name="last-updated" content="${article.lastEditedTime}">
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

/**
 * 블록들을 HTML 콘텐츠로 변환합니다.
 * @param {Array} blocks - 노션 블록 배열
 * @returns {string} 변환된 HTML 콘텐츠
 */
export function convertBlocksToContent(blocks) {
  let content = '';
  let inList = false;
  let listType = '';

  for (const block of blocks) {
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

  return content;
}