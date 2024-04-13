import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Chats from './UserSection/Chats'
import Profile from './UserSection/Profile'
import Groups from './UserSection/Groups'
import MyProfile from '../assets/MyProfile.png'
import {io} from 'socket.io-client'
const Dashboard = () => {
    const ServerUrl = import.meta.env.VITE_SERVER_URL;
    const messageRef = useRef();
    const LoggedInUser = localStorage.getItem("user");
    const navigate = useNavigate();
    useEffect(() => {
        if (!LoggedInUser) {
            navigate("/login")
        }
    }, [])
    const [Section, setSection] = useState('Chats');
    const [socket,setSocket]=useState(null);
    const [messages, setmessages] = useState([]);
    const [CurrentChat, setCurrentChat] = useState(null);
    const [text, setText] = useState("");
    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    useEffect(() => {
        setCurrentChat(null);
    }, [Section]);
    useEffect(()=>{
        setSocket(io(import.meta.env.VITE_SERVER_URL));
        console.log(import.meta.env.VITE_SERVER_URL);
    },[])
    useEffect(()=>{
        socket?.emit('addUser',userId);
        socket?.on("getUsers",users=>{
            console.log("Active Users :>>",users);
        });
        socket?.on("getMessage",(data)=>{
            if(data.senderId===userId){return}
            setmessages(prev=>([...prev,{ senderId: data.senderId, text: data.text, receiverId: data.receiverId, date: Date.now() }]))
            // setmessages([...messages, { senderId: data.senderId, text, receiverId: data.receiverId, date: Date.now() }]);
        })
    },[socket])
    useEffect(() => {
        messageRef.current?.scrollIntoView({ behavior: "smooth" });
    },[messages])
    const convertTo12HourFormat = (utcTime) => {
        const date = new Date(utcTime);
        date.setHours(date.getHours());
        date.setMinutes(date.getMinutes());
        const hours = date.getHours();
        const minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        let hours12 = hours % 12;
        hours12 = hours12 ? hours12 : 12;
        const formattedTime = `${hours12}:${minutes < 10 ? '0' : ''}${minutes}${ampm}`;
        return formattedTime;
    }

    const HandleSubmit = async (e) => {
        e.preventDefault();
        socket.emit('send-message', { senderId: userId, text, receiverId: CurrentChat?.id });
        let Data = {};
        if (messages.length === 0) {
            Data = {
                senderId: userId,
                message: text,
                receiverId: CurrentChat?.id
            }
            setmessages([...messages, { senderId: userId, text, receiverId: CurrentChat?.id, date: Date.now() }]);
        }
        else {
            Data = {
                senderId: userId,
                message: text,
                ConversationId: messages[0].conversationId
            }
            setmessages([...messages, { senderId: userId, text, ConversationId: messages[0].conversationId, date: Date.now() }]);
        }
        await fetch(`${ServerUrl}/api/conversation/sendMessage`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(Data)
        })
        setText("");
    }
    return (
        <div className='h-screen w-full flex justify-center items-center'>
            {/* Left Section */}
            <div className='Main Section bg-gray-300 h-screen overflow-y-scroll w-1/4 relative'>
                <div className='expanded-sidebar p-2 flex justify-between items-center h-20 fixed top-0 left-0 w-1/4 bg-slate-800'>
                    <div className='sidebar-left m-2'>
                        <h2 className='font-serif font-bold text-white'>
                            Web-Chat
                        </h2>
                    </div>
                    <div className='sidebar-right flex items-center'>
                        <div className='chats p-1 cursor-pointer m-2 rounded-full' onClick={() => setSection('Chats')} title='Chats'>
                            <svg fill="#ffffff" xmlns="http://www.w3.org/2000/svg" height="40px" width="40px" viewBox="0 0 100 100" xmlSpace="preserve" stroke="#ffffff" strokeWidth="0.9"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M28.1,48C28,48.7,28,49.3,28,50h-6c0-0.7,0-1.3,0.1-2H28.1z"></path> </g> <g> <g> <path d="M51.5,36h-3c-0.8,0-1.5,0.7-1.5,1.5v13.1c0,0.4,0.2,0.8,0.4,1.1l8.4,8.4c0.6,0.6,1.5,0.6,2.1,0l2.1-2.1 c0.6-0.6,0.6-1.5,0-2.1L53,48.8V37.5C53,36.7,52.3,36,51.5,36z"></path> </g> <g> <path d="M50,22c-14.8,0-26.9,11.5-27.9,26c0,0.3-0.1,0.7-0.1,1h-4.5c-1.3,0-2,1.5-1.2,2.4l7.5,9.1 c0.6,0.7,1.7,0.7,2.3,0l7.5-9.1c0.8-1,0.1-2.4-1.2-2.4H28c0-0.3,0-0.7,0-1c1-11.2,10.5-20,21.9-20c13,0,23.3,11.3,21.9,24.5 C70.8,62,61.8,71,52.2,71.9c-7.1,0.7-13.8-1.9-18.5-7c-0.6-0.7-1.4-1.1-2.2-0.1l-2.4,2.9c-0.5,0.6-0.1,1,0.4,1.5 c5.4,5.7,12.8,8.9,20.8,8.8c14.4-0.2,26.5-11.6,27.5-26C79.1,35.7,66.1,22,50,22z"></path> </g> </g> </g></svg>
                        </div>
                        <div className='groups p-1 m-2 cursor-pointer' onClick={() => setSection("Groups")} title='Groups'>
                            <svg fill="#FFFFFF" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.73,16.663A3.467,3.467,0,0,0,20.5,14.5a3.5,3.5,0,0,0-7,0,3.467,3.467,0,0,0,.77,2.163A6.04,6.04,0,0,0,12,18.69a6.04,6.04,0,0,0-2.27-2.027A3.467,3.467,0,0,0,10.5,14.5a3.5,3.5,0,0,0-7,0,3.467,3.467,0,0,0,.77,2.163A6,6,0,0,0,1,22a1,1,0,0,0,1,1H22a1,1,0,0,0,1-1A6,6,0,0,0,19.73,16.663ZM7,13a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,7,13ZM3.126,21a4,4,0,0,1,7.748,0ZM17,13a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,17,13Zm-3.873,8a4,4,0,0,1,7.746,0ZM7.2,8.4A1,1,0,0,0,8.8,9.6a4,4,0,0,1,6.4,0,1,1,0,1,0,1.6-1.2,6,6,0,0,0-2.065-1.742A3.464,3.464,0,0,0,15.5,4.5a3.5,3.5,0,0,0-7,0,3.464,3.464,0,0,0,.765,2.157A5.994,5.994,0,0,0,7.2,8.4ZM12,3a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,12,3Z" /></svg>                        </div>
                        <div className='profile p-1 m-2 cursor-pointer' onClick={() => setSection('Profile')} title='Profile'>
                            <svg viewBox="0 0 24 24" fill="none" width="24px" height="24px" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.50998C8.71997 7.69998 10.18 6.22998 12 6.22998C13.81 6.22998 15.28 7.69998 15.28 9.50998C15.27 11.28 13.88 12.72 12.12 12.78Z" stroke="#FFFFFF" strokeWidth="1.9200000000000004" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M18.74 19.3801C16.96 21.0101 14.6 22.0001 12 22.0001C9.40001 22.0001 7.04001 21.0101 5.26001 19.3801C5.36001 18.4401 5.96001 17.5201 7.03001 16.8001C9.77001 14.9801 14.25 14.9801 16.97 16.8001C18.04 17.5201 18.64 18.4401 18.74 19.3801Z" stroke="#FFFFFF" strokeWidth="1.9200000000000004" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFFFFF" strokeWidth="1.9200000000000004" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        </div>
                    </div>
                </div>
                {/* Search Bar */}
                <div className='search-bar fixed w-1/4 top-20 h-14 bg-slate-800 pl-2 pr-2'>
                    <input type="text" className='w-full p-3 rounded-2xl' placeholder='Search...' />
                    <div className='cursor-pointer absolute top-2 right-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                {Section === 'Chats' && <Chats data={{ setmessages, setCurrentChat }} />}
                {Section === 'Profile' && <Profile />}
                {Section === 'Groups' && <Groups data={{ setmessages, setCurrentChat }} />}
            </div>
            {/* Main-Chat screen */}
            {CurrentChat ? <div className='Main-chat-Screen bg-gray-500 h-full w-3/4'>
                <div className='User-Details sticky bg-slate-50 top-0 font-mono h-16 flex justify-between items-center'>
                    <div className='User-Name flex items-center m-1'>
                        <div className='User-Profile-Image mr-2 ml-2'>
                            <img src={CurrentChat?.profile} className='rounded-full' alt="" height={50} width={50} onError={(e) => { e.target.src = MyProfile }} />
                        </div>
                        <div className='Group-Details'>
                            <div className='User-Name mr-2 ml-2'>{CurrentChat?.username && "@" + CurrentChat?.username}</div>
                            <div className='User-Name mr-2 ml-2'>{CurrentChat?.groupName && CurrentChat?.groupName}</div>
                            {CurrentChat?.groupName && <div className="members mr-2 ml-2">Members: {CurrentChat.members.length}</div>}
                        </div>
                    </div>
                    <div className="delete m-2 cursor-pointer " title='Delete'>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256">
                            <g fillOpacity="0" fill="#dddddd" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: "normal" }}><path d="M0,256v-256h256v256z" id="bgRectangle"></path></g><g fill="#000000" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: "normal" }}><g transform="scale(10.66667,10.66667)"><path d="M10,2l-1,1h-6v2h1.10938l1.7832,15.25586v0.00781c0.13102,0.98666 0.98774,1.73633 1.98242,1.73633h8.24805c0.99468,0 1.8514,-0.74968 1.98242,-1.73633l0.00195,-0.00781l1.7832,-15.25586h1.10938v-2h-6l-1,-1zM6.125,5h11.75l-1.75195,15h-8.24805z"></path></g></g>
                        </svg>
                    </div>
                </div>
                <div className="ChatScreen overflow-y-scroll" style={{ height: "calc(100vh - 7rem)" }}>
                    {messages.length > 0 && messages.map((msg, index) => {
                        return (
                            <div key={index}>
                            <div className={msg.senderId !== userId ? 'left w-fit bg-lime-500 p-2 m-2' : 'right block ml-auto w-fit bg-lime-500 p-2 m-2'} style={{ borderRadius: msg.senderId !== userId ? "0 20px 20px 20px" : "20px 0 20px 20px", maxWidth: "60%", minWidth: "10%" }}>
                                <div className="name font-mono mb-1 text-xs text-left">{msg.senderId !== userId ? `${Section == 'Groups' ? msg?.name : ""}` : ""}</div>
                                <div className="message ">
                                    <div className="text">{msg.text}</div>
                                    <p className="time text-right text-xs">{convertTo12HourFormat(msg.date)}</p>
                                </div>
                            </div>
                            <div ref={messageRef}></div>
                            </div>
                        )
                    })}
                </div>
                <div className="Send-Message sticky top-full">
                    <form onSubmit={(e) => HandleSubmit(e)}>
                        <input type="text" placeholder="Type your message here..." value={text} onChange={(e) => setText(e.target.value)} className=" p-2 h-12 bg-slate-100 border-0 focus:outline-none focus:ring-0 focus:shadow-none w-full" />
                        <label htmlFor="send" className='cursor-pointer absolute' style={{ right: "10px", top: "50%", transform: "translateY(-50%)" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </label>
                        <button type="submit" id='send' className="d-none" disabled={text.length === 0}></button>
                    </form>
                </div>
            </div> : <div className='Main-chat-Screen bg-gray-500 h-full w-3/4 flex justify-center items-center'>
                <div className='text-3xl font-mono bg-slate-100 p-4 rounded-2xl'>Web-Chat</div></div>}
        </div>
    )
}

export default Dashboard
