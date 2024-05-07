import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Chats from './UserSection/Chats'
import Profile from './UserSection/Profile'
import Groups from './UserSection/Groups'
import MyProfile from '../assets/MyProfile.png'
import { io } from 'socket.io-client'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from '../assets/MyProfile.png'
import { DashboardContext } from '../Contexts/DashboardContext'
import OptionMenu from './Menu/OptionMenu'
import SearchUserMenu from './Menu/SearchUserMenu'
import ShowProfile from './Menu/ShowProfile'
const Dashboard = () => {
    const ServerUrl = import.meta.env.VITE_SERVER_URL;
    const { fetchUsers, ShowContextMenu, setShowContextMenu,
        coordinates, setCoordinates, FetchConversations, selectedMessage, setSelectedMessage, Conversations, setConversations
        , messages, setmessages, CurrentChat, setCurrentChat, FetchGroups, setNotificationCount,
        socket, setSocket, loading } = useContext(DashboardContext);
    const messageRef = useRef();
    const LoggedInUser = localStorage.getItem("user");
    const navigate = useNavigate();
    useEffect(() => {
        if (!LoggedInUser) {
            navigate("/login")
        }
    }, [])

    const [Section, setSection] = useState('Chats');

    const [text, setText] = useState("");
    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    const [SelectedGroupUsers, setSelectedGroupUsers] = useState([userId]);
    const [groupName, setGroupName] = useState("");
    const [Addusersmenu, setAddusersmenu] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [ShowuserProfile, setShowuserProfile] = useState(false);
    useEffect(() => {
        setCurrentChat(null);
    }, [Section]);

    useEffect(() => {
        setSocket(io(import.meta.env.VITE_SERVER_URL));
        fetchUsers();
    }, [])

    useEffect(() => {
        socket?.emit('addUser', userId);
        socket?.on("getUsers", users => {
            console.log("Active Users :>>", users);
        })
        socket?.on("getMessage", (data) => {
            if (messages.length === 0) { return };
            if (CurrentChat.id === data.senderId) {
                console.log("Notification from current user", data.text);
                setmessages(prev => ([...prev, data]));
            }
            else {
                toast(`New Message from ${data.name}`, { type: "info" });
            }
        })
        if(Section==="Groups" && CurrentChat){
            let data = {
                groupId: CurrentChat?._id,
                socketId: socket?.id
            }
            socket?.emit("joinGroup",data);
        }
        socket?.on("getGroupMessage", (data) => {
            console.log(data);
            if (CurrentChat._id === data.groupId) {
                if(data?.senderId===userId){return};
                setmessages(prev => ([...prev, data]));
            }
            else {
                toast("New Message")
            }
        })
        return () => { 
            socket?.off("getMessage");
            socket?.off("getGroupMessage");
        }
    }, [socket, messages]);

    useEffect(() => {
        messageRef.current?.scrollIntoView({ behavior: "instant" });
    }, [messages]);
    
    const OpenContextMenu = (e, message) => {
        e.preventDefault();
        setCoordinates({ x: e.clientX, y: e.clientY });
        setShowContextMenu(!ShowContextMenu);
        setSelectedMessage(message);
    }
    const DateConversion = (date) => {
        const date1 = new Date(Date(date));
        const hours = date1.getHours();
        const minutes = date1.getMinutes();
        const meridiem = hours >= 12 ? "PM" : "AM";
        let hours12 = hours % 12;
        hours12 = hours12 ? hours12 : 12;
        const time12hrFormat = `${hours12}:${minutes < 10 ? "0" : ""}${minutes} ${meridiem}`;
        return time12hrFormat;
    }
    const HandleDeleteConversation = async () => {
        if (!CurrentChat) return;
        if (Section === 'Chats') {
            await fetch(`${ServerUrl}/api/conversation/deleteConversation/${CurrentChat?.conversationId}`, { method: "DELETE" })
            setConversations(Conversations.filter((item) => item.conversationId !== CurrentChat?.conversationId))
            toast("Conversation Deleted Successfully");
        }
        else {
            //For Group
        }
    }
    const HandleSubmit = async (e) => {
        e.preventDefault();
        socket.emit('send-message', { senderId: userId, text, receiverId: CurrentChat?.id, date: Date.now() });
        let Data = {};
        if (messages.length === 0) {
            //Call Fetch Conversations too
            FetchConversations();
            Data = {
                senderId: userId,
                message: text,
                receiverId: CurrentChat?.id,
                date: Date.now()
            }
            setmessages([...messages, { senderId: userId, text, receiverId: CurrentChat?.id, date: Date.now() }]);
        }
        else {
            Data = {
                senderId: userId,
                message: text,
                ConversationId: messages[0].conversationId,
                date: Date.now()
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
    const SendGroupMessage = async (e) => {
        e.preventDefault();
        socket.emit("sendGroupMessage", { text, senderId: userId, groupId: CurrentChat?._id, date: Date.now() })
        const responce = await fetch(`${ServerUrl}/api/groups/sendmessage`, {
            method: "POST",
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify({ text, groupId: CurrentChat?._id,senderId: userId, date: Date.now()})
        });
        const result = await responce.json();
        if (!result.Success) {
            toast("Please Try again in some time", { type: "info" });
        }
        else {
            setmessages([...messages, { text, senderId: userId, receiverId: CurrentChat?.id, date: Date.now() }])
            setText("");
        }
        
    }

    const HandleCopyMessage = () => {
        navigator.clipboard.writeText(selectedMessage?.text);
    }
    const HandleDeleteMessage = async () => {
        const responce = await fetch(`${ServerUrl}/api/conversation/deleteMessage`, {
            method: "POST",
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify({ text: selectedMessage?.text, date: selectedMessage?.date })
        });
        const result = await responce.json();
        if (!result.Success) {
            toast("Please Try again in some time", { type: "info" });
        }
        else {
            toast("Message Deleted Successfully", { type: "success" });
            setmessages(messages.filter((message) => message.date !== selectedMessage.date))
            setShowContextMenu(false);
        }
    }
    const CustomContextMenu = () => {
        return (
            <div className='context-menu absolute bg-slate-500 text-lg p-2' style={{ top: `calc(${coordinates.y}px - 70px)`, left: `calc(${coordinates.x}px - 200px)`, width: "200px" }}>
                <ul className='utils list-none'>
                    <li className='bg-slate-800 cursor-pointer rounded-md text-white text-center' style={{ border: "2px solid black" }} onClick={() => { HandleCopyMessage() }}>Copy</li>
                    <li className='bg-slate-800 cursor-pointer rounded-md text-white text-center' style={{ border: "2px solid black" }} onClick={() => { HandleDeleteMessage() }}>Delete</li>
                </ul>
            </div>
        )
    }

    const HandleUserSelection = (user) => {
        if (!SelectedGroupUsers.includes(user)) {
            setSelectedGroupUsers([...SelectedGroupUsers, user]);
        }
    }
    const HandleCreate = () => {
        // Handles both creating new conversaation group as well
        setShowMenu(false);
        if (Section === 'Chats') {
            setAddusersmenu(!Addusersmenu);

        }
        else if (Section === 'Groups') {
            setAddusersmenu(!Addusersmenu);
            //For Group
        }

    }
    const CreateGroup = async () => {
        setAddusersmenu(false);
        const responce = await fetch(`${ServerUrl}/api/groups/createGroup`, {
            method: "POST",
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify({ groupName, members: SelectedGroupUsers, admin: userId })
        })
        const result = await responce.json();
        if (!result.Success) {
            toast("Please Try again in some time");
        }
        else {
            toast("Group Created Successfully");
            FetchGroups();
        }

    }
    return (
        <div className='h-screen w-full flex justify-center items-center'>
            <div>
                <ToastContainer />
            </div>
            {/* Left Section */}
            <div className='Main Section bg-gray-300 h-screen overflow-y-auto w-1/4 min-w-[260px]'>
                <div className='top-section p-2 flex justify-between flex-col items-center min-w-[260px] bg-slate-800 relative'>
                    <div className="Upper flex w-full justify-between">
                        <div className='sidebar-left m-2'>
                            <h2 className='font-serif font-bold text-white'>
                                Web-Chat
                            </h2>
                        </div>
                        <div className='sidebar-right flex items-center'>
                            <button id="dropdownMenuIconButton" onClick={() => { setShowMenu(!showMenu), setAddusersmenu(false) }} className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600" type="button">
                                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                                </svg>
                            </button>
                            {showMenu && <OptionMenu data={{ setSection, Section, HandleCreate, setShowMenu }} />}
                            {Addusersmenu && <SearchUserMenu data={{ Section, HandleUserSelection, CreateGroup, setGroupName, groupName, SelectedGroupUsers, setSelectedGroupUsers, setAddusersmenu }} />}
                        </div>
                    </div>
                    <div className='search-bar w-full m-3 bg-slate-800 pl-2 pr-2 min-w-[260px] relative'>
                        <input type="text" className='w-full p-3 rounded-2xl' placeholder='Search...' />
                        <div className='cursor-pointer absolute' style={{ right: "15px", top: "10px" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                {/* Search Bar */}
                {Section === 'Chats' && <Chats />}
                {Section === 'Profile' && <Profile />}
                {Section === 'Groups' && <Groups data={{ setmessages, setCurrentChat }} />}
            </div>

            {/* Main-Chat screen */}
            {CurrentChat ? <div className='Main-chat-Screen bg-gray-500 h-full w-3/4'>
                {ShowuserProfile && <ShowProfile data={{ CurrentChat }} />}
                <div className='User-Details bg-slate-50 font-mono h-16 flex justify-between items-center'>
                    <div className='User-Name flex items-center m-1 cursor-pointer' title='Show Profile' onClick={(e) => { setShowuserProfile(true) }}>
                        <div className='User-Profile-Image mr-2 ml-2'>
                            <img src={CurrentChat?.profile} className='rounded-full h-[50px] w-[50px]' alt="" onError={(e) => { e.target.src = MyProfile }} />
                        </div>
                        <div className='Group-Details'>
                            <div className='User-Name mr-2 ml-2'>{CurrentChat?.username && "@" + CurrentChat?.username}</div>
                            <div className='User-Name mr-2 ml-2'>{CurrentChat?.groupName && CurrentChat?.groupName}</div>
                            {CurrentChat?.groupName && <div className="members mr-2 ml-2">Members: {CurrentChat.members.length}</div>}
                        </div>
                    </div>
                    <div className="delete m-2 cursor-pointer " title='Delete' onClick={(e) => { HandleDeleteConversation(e) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256">
                            <g fillOpacity="0" fill="#dddddd" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: "normal" }}><path d="M0,256v-256h256v256z" id="bgRectangle"></path></g><g fill="#000000" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: "normal" }}><g transform="scale(10.66667,10.66667)"><path d="M10,2l-1,1h-6v2h1.10938l1.7832,15.25586v0.00781c0.13102,0.98666 0.98774,1.73633 1.98242,1.73633h8.24805c0.99468,0 1.8514,-0.74968 1.98242,-1.73633l0.00195,-0.00781l1.7832,-15.25586h1.10938v-2h-6l-1,-1zM6.125,5h11.75l-1.75195,15h-8.24805z"></path></g></g>
                        </svg>
                    </div>
                </div>
                <div className="ChatScreen overflow-y-scroll" style={{ height: "calc(100vh - 7rem)" }}>
                    {!loading ? messages.map((msg, index) => {
                        return (
                            <div key={index} onContextMenu={(e => OpenContextMenu(e, msg))}>
                                <div className={msg.senderId !== userId ? 'left w-fit bg-lime-500 p-2 m-2' : 'right block ml-auto w-fit bg-lime-500 p-2 m-2'} style={{ borderRadius: msg.senderId !== userId ? "0 20px 20px 20px" : "20px 0 20px 20px", maxWidth: "70%", minWidth: "20%" }}>
                                    <div className="name font-mono mb-1 text-xs text-left">{msg.senderId !== userId ? `${Section == 'Groups' ? msg?.name : ""}` : ""}</div>
                                    <div className="message ">
                                        <div className="text p-2">{msg.text}</div>
                                        <p className="time text-right" style={{ fontSize: "8px" }}>{DateConversion(msg.date)}</p>
                                    </div>
                                </div>
                                <div ref={messageRef}></div>
                            </div>
                        )
                    }) :
                        <div role="status" className=" animate-pulse h-screen w-full">
                            <div className="h-9 bg-gray-200 rounded-full dark:bg-gray-700 left p-2 m-2 w-2/5"></div>
                            <div className="h-9 bg-gray-200 rounded-full dark:bg-gray-700 left p-2 m-2 block ml-auto w-2/5"></div>
                        </div>
                    }
                    {ShowContextMenu && <CustomContextMenu data={{ HandleCopyMessage, HandleDeleteMessage }} />}
                </div>
                {CurrentChat !== "" && <div className="Send-Message relative">
                    <form onSubmit={(e) => {Section == 'Chats' ? HandleSubmit(e) : SendGroupMessage(e)}}>
                        <input type="text" placeholder="Type your message here..." value={text} onChange={(e) => setText(e.target.value)} className=" p-2 h-12 bg-slate-100 border-0 focus:outline-none focus:ring-0 focus:shadow-none w-full" />
                        <label htmlFor="send" className='cursor-pointer absolute' style={{ right: "10px", top: "50%", transform: "translateY(-50%)" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </label>
                        <button type="submit" id='send' className="d-none" disabled={text.length === 0}></button>
                    </form>
                </div>}
            </div> :
                <div className='Main-chat-Screen bg-gray-500 h-full w-3/4 flex justify-center items-center'>
                    <div className='text-3xl font-mono bg-slate-100 p-4 rounded-2xl'>Web-Chat</div></div>}
        </div>
    )
}

export default Dashboard
