import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import InputPage from './pages/InputPage'
import { LanguageProvider } from './contexts/LanguageContext'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/input" element={<InputPage />} />
        </Routes>
      </Router>
    </LanguageProvider>
  )
}

export default App
