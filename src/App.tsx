import Home from './components/Home'
import { LanguageProvider } from './contexts/LanguageContext'

function App() {
  return (
    <LanguageProvider>
      <Home />
    </LanguageProvider>
  )
}

export default App
