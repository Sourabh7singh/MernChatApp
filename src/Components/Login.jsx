import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Login = (props) => {
  const ServerUrl = import.meta.env.VITE_SERVER_URL;
  const [isLoading, setloading] = useState(false);
  const [Responce, setResponce] = useState(false);
  const navigate = useNavigate();
  const { isLogin } = props;
  const [user, setUser] = useState({
    ...(!isLogin && { name: "", email: "" }),
    username: "",
    password: "",
  })
  const HandleSubmit = async (e) => {
    setloading(true)
    e.preventDefault();
    let url = "";
    if (isLogin) {
      url = `${ServerUrl}/api/user/login`;
    }
    else {
      url = `${ServerUrl}/api/user/signup;`
    }
    const result = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(user)
    })
    const responce = await result.json();
    setResponce(responce)
    setloading(false);
    toast(responce.msg)
    if (responce.Success) {
      localStorage.setItem("user", JSON.stringify(responce.user))
      navigate("/")
    }
  }
  return (
    <div className='h-screen w-full flex justify-center items-center bg-slate-400'>
      <div>
        <ToastContainer />
      </div>
      <div className="w-screen max-w-md">
        <form className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4" >
          {!isLogin && <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Enter Your full Name
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Name" value={user.name} onChange={(e) => { setUser({ ...user, name: e.target.value }) }} />
          </div>}
          {!isLogin && <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emal">
              Enter Your Email-Address
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" value={user.email} onChange={(e) => { setUser({ ...user, email: e.target.value }) }} />
          </div>}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" value={user.username} onChange={(e) => { setUser({ ...user, username: e.target.value }) }} />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" value={user.password} onChange={(e) => { setUser({ ...user, password: e.target.value }) }} />
            <p className="text-red-500 text-xs italic">Please choose a password.</p>
          </div>
          <div className="flex items-center justify-between p-2">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={(e) => HandleSubmit(e)} onSubmit={(e) => HandleSubmit(e)} disabled={isLoading}>
              {isLogin ? "Login" : "Sign-in"}
            </button>
          </div>
          <div className="flex items-center justify-between p-2 text-center">
            <Link className="font-bold py-2 px-4 rounded underline" to={isLogin ? "/signup" : "/login"}>
              {isLogin ? "Don't have an account?" : "Already have an account Login?"}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
