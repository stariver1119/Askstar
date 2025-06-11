import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import InputPage from './pages/InputPage'
import ResultPage from './pages/ResultPage'
import { LanguageProvider } from './contexts/LanguageContext'

function App() {
  return (
    <LanguageProvider>
      <Router basename="/Askstar">
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
