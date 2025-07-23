import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Article {
  id: string;
  title: string;
  url: string;
  createdTime: string;
  lastEditedTime: string;
}

interface SyncResponse {
  articles: Article[];
  timestamp: string;
  totalCount: number;
}

export default function AdminSyncPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1119') {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('비밀번호가 올바르지 않습니다.');
    }
  };

  const syncNewArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Firebase Functions를 통해 새 아티클 조회
      const response = await fetch('/api/getNewArticles');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SyncResponse = await response.json();
      setSyncResult(data);
      setLastSyncTime(new Date().toLocaleString('ko-KR'));

      // 기존 정적 아티클 목록과 비교하여 새 글 확인
      try {
        const staticResponse = await fetch('/data/articles.json');
        if (staticResponse.ok) {
          const staticData = await staticResponse.json();
          const staticUrls = staticData.articles.map((article: Article) => article.url);
          const newArticles = data.articles.filter(article => !staticUrls.includes(article.url));
          
          if (newArticles.length > 0) {
            console.log(`발견된 새 글: ${newArticles.length}개`);
          } else {
            console.log('새 글이 없습니다.');
          }
        }
      } catch (staticError) {
        console.warn('정적 아티클 데이터를 불러올 수 없습니다:', staticError);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">관리자 인증</h1>
            <p className="text-gray-600">비밀번호를 입력해주세요</p>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="비밀번호 입력"
                required
              />
            </div>
            
            {passwordError && (
              <div className="text-red-600 text-sm">{passwordError}</div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              로그인
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm">
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <header className="mb-8">
          <nav className="mb-6">
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
              ← 홈으로 돌아가기
            </Link>
            <span className="mx-2 text-gray-400">|</span>
            <Link to="/article" className="text-blue-600 hover:text-blue-800 font-medium">
              아티클 목록
            </Link>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">관리자 아티클 동기화</h1>
          <p className="text-gray-600">노션 데이터베이스에서 새로운 아티클을 확인하고 동기화합니다.</p>
        </header>

        {/* 동기화 컨트롤 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">아티클 동기화</h2>
            {lastSyncTime && (
              <span className="text-sm text-gray-500">
                마지막 동기화: {lastSyncTime}
              </span>
            )}
          </div>

          <button
            onClick={syncNewArticles}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              loading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                동기화 중...
              </div>
            ) : (
              '새 글 확인 및 동기화'
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="text-red-500 mr-2">⚠️</div>
                <div>
                  <h3 className="text-red-800 font-medium">동기화 오류</h3>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 동기화 결과 */}
        {syncResult && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">동기화 결과</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{syncResult.totalCount}</div>
                <div className="text-sm text-blue-800">총 아티클 수</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {new Date(syncResult.timestamp).toLocaleTimeString('ko-KR')}
                </div>
                <div className="text-sm text-green-800">동기화 시간</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">실시간</div>
                <div className="text-sm text-purple-800">데이터 상태</div>
              </div>
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-3">아티클 목록</h3>
            <div className="space-y-3">
              {syncResult.articles.map((article) => (
                <div 
                  key={article.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{article.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">URL: /article/{article.url}</p>
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <span>생성: {new Date(article.createdTime).toLocaleDateString('ko-KR')}</span>
                        <span>수정: {new Date(article.lastEditedTime).toLocaleDateString('ko-KR')}</span>
                      </div>
                    </div>
                    <Link
                      to={`/article/${article.url}`}
                      className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                    >
                      보기
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 안내 사항 */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-yellow-600 mr-2">💡</div>
            <div>
              <h3 className="text-yellow-800 font-medium">사용 안내</h3>
              <ul className="text-yellow-700 text-sm mt-1 space-y-1">
                <li>• 이 페이지는 관리자 전용입니다.</li>
                <li>• 새 글 확인 버튼을 클릭하면 노션 데이터베이스에서 최신 아티클을 가져옵니다.</li>
                <li>• 동적으로 로드된 새 글은 다음 빌드 시 정적 파일로 변환됩니다.</li>
                <li>• 과도한 사용을 피하고 필요할 때만 동기화하세요.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>&copy; 2025 Askstar. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
