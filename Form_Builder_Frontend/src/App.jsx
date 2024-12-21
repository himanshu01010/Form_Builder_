import { BrowserRouter as Router ,Routes ,Route } from 'react-router-dom'
import FormBuilder from './pages/Form'
import TemplatesPage from './pages/TemplatesPage'
import StandaloneFormPreview from './pages/StandaloneFormPreview'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<TemplatesPage/>}/>
        <Route path='/form-builder/:templateId' element={<FormBuilder/>}/> 
        <Route path="/form-preview/:templateId" element={<StandaloneFormPreview />} />
      </Routes>
    </Router>
  )
}

export default App
