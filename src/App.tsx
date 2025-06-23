import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import InputPage from './pages/InputPage'
import LoadingPage from './pages/LoadingPage'
import ResultPage from './pages/ResultPage'
import SharePage from './pages/SharePage'
import AboutPage from './pages/AboutPage'
import { LanguageProvider } from './contexts/LanguageContext'
import { useDocumentTitle } from './hooks/useDocumentTitle'

// Get base path from Vite environment or default to '/'
const BASE_PATH = import.meta.env.BASE_URL || '/'

function App() {
  return (
    <LanguageProvider>
      <TitleUpdater />
      <Router basename={BASE_PATH}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/input" element={<InputPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/share/:resultId" element={<SharePage />} />
        </Routes>
      </Router>
    </LanguageProvider>
  )
}

// Component to handle document title updates
function TitleUpdater() {
  useDocumentTitle('pageTitle');
  return null;
}

export default App
