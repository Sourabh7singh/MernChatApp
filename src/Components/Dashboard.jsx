import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Chats from './UserSection/Chats'
import Profile from './UserSection/Profile'
import Groups from './UserSection/Groups'
const Dashboard = () => {
    const navigate = useNavigate();
    const [Section,setSection]=useState('Chats');
    const [messages,setmessages]=useState([])
    const LoggedInUser = localStorage.getItem("user");
    useEffect(() => {
        if (!LoggedInUser) {
            navigate("/login")
        }
    }, [])
    
    return (
        <div className='h-screen w-full flex justify-center items-center'>
            {/* Side bar */}
            <div className='expanded-sidebar bg-white h-full p-2 w-28'>
                <div className='open-close mt-2 mb-2'>
                    <h2 className='font-serif font-bold'>
                        Web-Chat
                    </h2>
                </div>
                <div className='chats p-1 m-2 cursor-pointer' onClick={() => setSection('Chats')}>
                    <svg width="25px" height="25px" className=' block m-auto' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.719 12A10.719 10.719 0 0 1 1.28 12h.838a9.916 9.916 0 1 0 1.373-5H8v1H2V2h1v4.2A10.71 10.71 0 0 1 22.719 12zM16 13h-4V7h-1v7h5z" /><path fill="none" d="M0 0h24v24H0z" /></svg>
                    <p className='bold text-center w-full'>Chats</p>
                </div>
                <div className='groups p-1 m-2 cursor-pointer' onClick={() => setSection("Groups")}>
                    <svg fill="#000000" width="25px" className=' block m-auto' height="25px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.73,16.663A3.467,3.467,0,0,0,20.5,14.5a3.5,3.5,0,0,0-7,0,3.467,3.467,0,0,0,.77,2.163A6.04,6.04,0,0,0,12,18.69a6.04,6.04,0,0,0-2.27-2.027A3.467,3.467,0,0,0,10.5,14.5a3.5,3.5,0,0,0-7,0,3.467,3.467,0,0,0,.77,2.163A6,6,0,0,0,1,22a1,1,0,0,0,1,1H22a1,1,0,0,0,1-1A6,6,0,0,0,19.73,16.663ZM7,13a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,7,13ZM3.126,21a4,4,0,0,1,7.748,0ZM17,13a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,17,13Zm-3.873,8a4,4,0,0,1,7.746,0ZM7.2,8.4A1,1,0,0,0,8.8,9.6a4,4,0,0,1,6.4,0,1,1,0,1,0,1.6-1.2,6,6,0,0,0-2.065-1.742A3.464,3.464,0,0,0,15.5,4.5a3.5,3.5,0,0,0-7,0,3.464,3.464,0,0,0,.765,2.157A5.994,5.994,0,0,0,7.2,8.4ZM12,3a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,12,3Z" /></svg>
                    <p className='bold text-center w-full'>Groups</p>
                </div>
                <div className='profile p-1 m-2 cursor-pointer' onClick={() => setSection('Profile')}>
                    <svg fill="#000000" height="25px" className=' block m-auto' width="25px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xmlSpace="preserve"><path id="user--profile_1_" d="M16,31.36C7.53,31.36,0.64,24.47,0.64,16S7.53,0.64,16,0.64S31.36,7.53,31.36,16	S24.47,31.36,16,31.36z M6.349,27c2.579,2.266,5.957,3.64,9.651,3.64c3.693,0,7.072-1.374,9.65-3.64h-0.01 c0-4.341-2.941-8.161-7.153-9.29c-0.144-0.038-0.248-0.16-0.265-0.307c-0.018-0.146,0.058-0.289,0.188-0.358	c1.678-0.897,2.72-2.635,2.72-4.534c0-2.84-2.306-5.151-5.14-5.151s-5.141,2.311-5.141,5.151c0,1.899,1.042,3.637,2.72,4.534	c0.13,0.069,0.205,0.212,0.188,0.358s-0.122,0.269-0.264,0.307C9.292,18.835,6.36,22.655,6.36,27H6.349z M19.435,17.25	c3.913,1.377,6.646,4.973,6.905,9.104c2.655-2.651,4.3-6.314,4.3-10.354c0-8.073-6.567-14.64-14.64-14.64	C7.927,1.36,1.36,7.927,1.36,16c0,4.04,1.645,7.703,4.3,10.354c0.258-4.135,2.982-7.729,6.883-9.104	c-1.506-1.094-2.415-2.846-2.415-4.739c0-3.237,2.629-5.871,5.86-5.871c3.232,0,5.861,2.633,5.861,5.871	C21.85,14.404,20.941,16.156,19.435,17.25z" /><rect id="_Transparent_Rectangle" style={{ fill: "none" }} width="25" height="25" /></svg>
                    <p className='bold text-center w-full'>Profile</p>
                </div>
            </div>
            {/* Users Section */}
            <div className='Available-Users-Section bg-gray-300 h-full w-1/5 overflow-y-scroll'>
                {Section==='Chats'&&<Chats setmessages={setmessages}/>}
                {Section==='Profile'&&<Profile/>}
                {Section==='Groups'&&<Groups/>}
            </div>
            {/* Main-Chat screen */}
            <div className='Main-chat-Screen bg-gray-500 h-full' style={{width:`calc(80% - 112px)`}}>
                <div className='User-Details sticky bg-slate-50 top-0 font-mono h-24'>
                    {messages.length>0 && messages.map((msg,index)=>{
                        return <div key={index}>{msg.text}</div>
                    })}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
