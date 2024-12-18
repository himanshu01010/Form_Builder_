import { BrowserRouter as Router ,Routes ,Route } from 'react-router-dom'
import FormBuilder from './pages/Form'
import TemplatesPage from './pages/TemplatesPage'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<TemplatesPage/>}/>
        <Route path='/form-builder/:templateId' element={<FormBuilder/>}/> 
      </Routes>
    </Router>
  )
}

export default App
