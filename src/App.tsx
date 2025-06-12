import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import InputPage from './pages/InputPage'
import ResultPage from './pages/ResultPage'
import { LanguageProvider } from './contexts/LanguageContext'

// Get base path from Vite environment or default to '/Askstar/'
const BASE_PATH = import.meta.env.BASE_URL || '/Askstar/'

function App() {
  return (
    <LanguageProvider>
      <Router basename={BASE_PATH}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/input" element={<InputPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </Router>
    </LanguageProvider>
  )
}

export default App
