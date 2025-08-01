import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Toast from './components/elements/Toast'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
      <Toast />
    </div>
  )
}

export default App