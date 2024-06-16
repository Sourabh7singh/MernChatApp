import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import './index.css'
import Login from './Components/Login'
import Otp from './Components/Otp'
import CreatePassword from './Components/CreatePassword'

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
          <Route path='/submitotp' element={<Otp/>} />
          <Route path='/createpassword' element={<CreatePassword/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
