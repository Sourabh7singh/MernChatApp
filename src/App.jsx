import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import './index.css'
import Login from './Components/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={
            <Dashboard />
          } />
          <Route path='/login' element={<Login isLogin={true} />} />
          <Route path='/signup' element={<Login isLogin={false} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
