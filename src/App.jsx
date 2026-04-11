import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import './index.css'
import Login from './Components/Login'
import Otp from './Components/Otp'
import CreatePassword from './Components/CreatePassword'
import Groups from './Components/UserSection/Groups'
import Profile from './Components/UserSection/Profile'
import Chats from './Components/UserSection/Chats'
import Overview from './Components/Overview'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path='/login' element={<Login isLogin={true} />} />

          <Route index element={<Dashboard><Chats/></Dashboard>} />

          <Route path='/signup' element={<Login isLogin={false} />} />
          <Route path='/submitotp' element={<Otp/>} />
          <Route path='/createpassword' element={<CreatePassword/>} />
          <Route path='/groups' element={<Dashboard><Groups/></Dashboard>}/>
          <Route path='/profile' element={<Dashboard><Profile/></Dashboard>}/>
          <Route path='/overview' element={<Overview/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
