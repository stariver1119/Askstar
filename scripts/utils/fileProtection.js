import fs from 'fs';
import path from 'path';

/**
 * HTML 파일에서 보호 상태를 확인합니다.
 * @param {string} filePath - HTML 파일 경로
 * @returns {object} 보호 정보 객체
 */
export function checkProtectionStatus(filePath) {
  if (!fs.existsSync(filePath)) {
    return {
      exists: false,
      isProtected: false,
      lastNotionUpdate: null,
      isGenerated: false
    };
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 메타데이터 추출
    const isGenerated = /<!-- ASKSTAR_GENERATED: true -->/.test(content);
    const protectedMatch = content.match(/<!-- MANUAL_EDIT_PROTECTED: (true|false) -->/);
    const updateMatch = content.match(/<!-- LAST_NOTION_UPDATE: (.+?) -->/);
    
    return {
      exists: true,
      isProtected: protectedMatch ? protectedMatch[1] === 'true' : false,
      lastNotionUpdate: updateMatch ? updateMatch[1] : null,
      isGenerated: isGenerated
    };
  } catch (error) {
    console.error(`파일 보호 상태 확인 오류: ${filePath}`, error);
    return {
      exists: true,
      isProtected: false,
      lastNotionUpdate: null,
      isGenerated: false
    };
  }
}

/**
 * HTML 파일의 보호 상태를 설정합니다.
 * @param {string} filePath - HTML 파일 경로
 * @param {boolean} isProtected - 보호 여부
 */
export function setProtectionStatus(filePath, isProtected) {
  if (!fs.existsSync(filePath)) {
    console.warn(`파일이 존재하지 않습니다: ${filePath}`);
    return false;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 기존 보호 상태 메타데이터 업데이트
    const protectionRegex = /<!-- MANUAL_EDIT_PROTECTED: (true|false) -->/;
    const newProtectionTag = `<!-- MANUAL_EDIT_PROTECTED: ${isProtected} -->`;
    
    if (protectionRegex.test(content)) {
      content = content.replace(protectionRegex, newProtectionTag);
    } else {
      // 메타데이터가 없는 경우 추가
      const insertPoint = content.indexOf('<meta charset="UTF-8">');
      if (insertPoint !== -1) {
        const beforeMeta = content.substring(0, insertPoint);
        const afterMeta = content.substring(insertPoint);
        content = beforeMeta + 
          `<!-- ASKSTAR_GENERATED: true -->\n    ` +
          `${newProtectionTag}\n    ` +
          `<!-- LAST_NOTION_UPDATE: ${new Date().toISOString()} -->\n    ` +
          afterMeta;
      }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ 보호 상태 변경: ${path.basename(filePath)} -> ${isProtected ? '보호됨' : '보호해제'}`);
    return true;
  } catch (error) {
    console.error(`보호 상태 설정 오류: ${filePath}`, error);
    return false;
  }
}

/**
 * 보호된 파일 목록을 반환합니다.
 * @param {string} articlesDir - 아티클 디렉토리 경로
 * @returns {Array} 보호된 파일 목록
 */
export function getProtectedFiles(articlesDir) {
  if (!fs.existsSync(articlesDir)) {
    return [];
  }

  const protectedFiles = [];
  const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.html'));
  
  for (const file of files) {
    const filePath = path.join(articlesDir, file);
    const protection = checkProtectionStatus(filePath);
    
    if (protection.isProtected) {
      protectedFiles.push({
        filename: file,
        url: path.basename(file, '.html'),
        lastNotionUpdate: protection.lastNotionUpdate
      });
    }
  }
  
  return protectedFiles;
}