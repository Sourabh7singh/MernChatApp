import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import './index.css'
import Login from './Components/Login'
import Otp from './Components/Otp'
import CreatePassword from './Components/CreatePassword'
import Groups from './Components/UserSection/Groups'
import Profile from './Components/UserSection/Profile'
import Chats from './Components/UserSection/Chats'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={
            <Dashboard><Chats/></Dashboard>
          } />
          <Route path='/login' element={<Login isLogin={true} />} />
          <Route path='/signup' element={<Login isLogin={false} />} />
          <Route path='/submitotp' element={<Otp/>} />
          <Route path='/createpassword' element={<CreatePassword/>} />
          <Route path='/groups' element={<Dashboard><Groups/></Dashboard>}/>
          <Route path='/profile' element={<Dashboard><Profile/></Dashboard>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
