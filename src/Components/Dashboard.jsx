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
    const { Users, fetchUsers, convertTo12HourFormat, ShowContextMenu, setShowContextMenu,
        setUsers,
        coordinates, setCoordinates, FetchConversations, selectedMessage, setSelectedMessage, Conversations, setConversations
        , FetchMessages, messages, setmessages, CurrentChat, setCurrentChat, FetchGroups, setNotificationCount,
        socket, setSocket, SelectedChatcompare,loading } = useContext(DashboardContext);
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
                console.log("Notification from other user");
                toast("New Message")
            }
        })
        return () => { socket?.off("getMessage") }
    }, [socket, messages]);

    useEffect(() => {
        messageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])
    const OpenContextMenu = (e, message) => {
        e.preventDefault();
        setCoordinates({ x: e.clientX, y: e.clientY });
        setShowContextMenu(!ShowContextMenu);
        setSelectedMessage(message);
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
                receiverId: CurrentChat?._id,
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
            toast("Please Try again in some time");
        }
        else {
            toast("Message Deleted Successfully");
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

                    {/* <div className='chats p-1 cursor-pointer m-2 rounded-full' onClick={() => setSection('Chats')} title='Chats'>
                            <svg fill="#ffffff" xmlns="http://www.w3.org/2000/svg" height="40px" width="40px" viewBox="0 0 100 100" xmlSpace="preserve" stroke="#ffffff" strokeWidth="0.9"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M28.1,48C28,48.7,28,49.3,28,50h-6c0-0.7,0-1.3,0.1-2H28.1z"></path> </g> <g> <g> <path d="M51.5,36h-3c-0.8,0-1.5,0.7-1.5,1.5v13.1c0,0.4,0.2,0.8,0.4,1.1l8.4,8.4c0.6,0.6,1.5,0.6,2.1,0l2.1-2.1 c0.6-0.6,0.6-1.5,0-2.1L53,48.8V37.5C53,36.7,52.3,36,51.5,36z"></path> </g> <g> <path d="M50,22c-14.8,0-26.9,11.5-27.9,26c0,0.3-0.1,0.7-0.1,1h-4.5c-1.3,0-2,1.5-1.2,2.4l7.5,9.1 c0.6,0.7,1.7,0.7,2.3,0l7.5-9.1c0.8-1,0.1-2.4-1.2-2.4H28c0-0.3,0-0.7,0-1c1-11.2,10.5-20,21.9-20c13,0,23.3,11.3,21.9,24.5 C70.8,62,61.8,71,52.2,71.9c-7.1,0.7-13.8-1.9-18.5-7c-0.6-0.7-1.4-1.1-2.2-0.1l-2.4,2.9c-0.5,0.6-0.1,1,0.4,1.5 c5.4,5.7,12.8,8.9,20.8,8.8c14.4-0.2,26.5-11.6,27.5-26C79.1,35.7,66.1,22,50,22z"></path> </g> </g> </g></svg>
                        </div>
                        <div className='groups p-1 m-2 cursor-pointer' title='Groups'>
                            <svg fill="#FFFFFF" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.73,16.663A3.467,3.467,0,0,0,20.5,14.5a3.5,3.5,0,0,0-7,0,3.467,3.467,0,0,0,.77,2.163A6.04,6.04,0,0,0,12,18.69a6.04,6.04,0,0,0-2.27-2.027A3.467,3.467,0,0,0,10.5,14.5a3.5,3.5,0,0,0-7,0,3.467,3.467,0,0,0,.77,2.163A6,6,0,0,0,1,22a1,1,0,0,0,1,1H22a1,1,0,0,0,1-1A6,6,0,0,0,19.73,16.663ZM7,13a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,7,13ZM3.126,21a4,4,0,0,1,7.748,0ZM17,13a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,17,13Zm-3.873,8a4,4,0,0,1,7.746,0ZM7.2,8.4A1,1,0,0,0,8.8,9.6a4,4,0,0,1,6.4,0,1,1,0,1,0,1.6-1.2,6,6,0,0,0-2.065-1.742A3.464,3.464,0,0,0,15.5,4.5a3.5,3.5,0,0,0-7,0,3.464,3.464,0,0,0,.765,2.157A5.994,5.994,0,0,0,7.2,8.4ZM12,3a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,12,3Z" /></svg>                        </div>
                        <div className='profile p-1 m-2 cursor-pointer' onClick={() => setSection('Profile')} title='Profile'>
                            <svg viewBox="0 0 24 24" fill="none" width="24px" height="24px" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.50998C8.71997 7.69998 10.18 6.22998 12 6.22998C13.81 6.22998 15.28 7.69998 15.28 9.50998C15.27 11.28 13.88 12.72 12.12 12.78Z" stroke="#FFFFFF" strokeWidth="1.9200000000000004" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M18.74 19.3801C16.96 21.0101 14.6 22.0001 12 22.0001C9.40001 22.0001 7.04001 21.0101 5.26001 19.3801C5.36001 18.4401 5.96001 17.5201 7.03001 16.8001C9.77001 14.9801 14.25 14.9801 16.97 16.8001C18.04 17.5201 18.64 18.4401 18.74 19.3801Z" stroke="#FFFFFF" strokeWidth="1.9200000000000004" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFFFFF" strokeWidth="1.9200000000000004" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        </div>
                        <div className="Create-Conversation text-[30px]" style={{ border: "2px solid transparent", height: "30px", width: "30px", textAlign: "center", borderRadius: "50%", cursor: "pointer", backgroundColor: "green", color: "white", fontWeight: "bold" }}>
                            <div onClick={() => { setAddusersmenu(!Addusersmenu) }}>+</div>
                            {Addusersmenu &&
                                <div className="Addusers-Menu absolute bg-gray-600 max-h-[600px] overflow-y-auto left-full top-4/5 z-10">
                                    <div className='flex text-center font-thin text-lg p-2 m-1 justify-between items-center' style={{ borderBottom: "2px solid black" }}>
                                        <h5>Start New Conversation</h5>
                                        {Section === 'Groups' && <div className="create-coversation cursor-pointer" title='Create' onClick={() => { CreateGroup() }}>
                                            <svg fill="#FFFFFF" viewBox="0 0 20 20" className='h-6 w-6' xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M10,1a9,9,0,1,0,9,9A9,9,0,0,0,10,1Zm0,16.4A7.4,7.4,0,1,1,15.52,5.09L9,11.59,5.68,8.29,4.28,9.71,9,14.41l7.61-7.63A7.29,7.29,0,0,1,17.4,10,7.41,7.41,0,0,1,10,17.4Z"></path> </g> </g></svg>
                                        </div>}
                                    </div>
                                    {Section === 'Groups' && 
                                    </div>}
                                    <div className='text-center font-thin text-lg p-2 m-1'>
                                        {Section === 'Chats' && Users && Users.map((user) => {
                                            return <div className='text-center font-thin text-lg p-2 m-1 flex items-center cursor-pointer' key={user.id} onClick={(e) => { setCurrentChat(user), setAddusersmenu(!Addusersmenu) }}>
                                                <div className='UserProfile m-2 min-h-10 min-w-10'>
                                                    <img src={user.profile} alt="profile" className='rounded-full h-10 w-10' onError={(e) => { e.target.src = Avatar }} />
                                                </div>
                                                <span className='font-light m-2'>{user.username}</span>
                                            </div>
                                        })}
                                        {Section === 'Groups' && Users && Users.map((user) => {
                                            return <div className={`text-center font-thin text-lg p-2 m-1 flex items-center cursor-pointer  rounded-2xl hover:bg-slate-600 ${SelectedGroupUsers.includes(user.id) ? "bg-slate-700" : "bg-slate-900"}`} key={user.id} onClick={(e) => HandleUserSelection(user)}>
                                                <div className='UserProfile m-2 min-h-10 min-w-10'>
                                                    <img src={user.profile} alt="profile" className='rounded-full h-10 w-10' onError={(e) => { e.target.src = Avatar }} />
                                                </div>
                                                <span className='font-light m-2'>{user.username}</span>
                                            </div>
                                        })}

                                    </div>
                                </div>
                            }
                        </div> */}

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
                {ShowuserProfile && <ShowProfile data={{CurrentChat}} />}
                <div className='User-Details bg-slate-50 font-mono h-16 flex justify-between items-center'>
                    <div className='User-Name flex items-center m-1 cursor-pointer' title='Show Profile' onClick={(e) => { setShowuserProfile(true) }}>
                        <div className='User-Profile-Image mr-2 ml-2'>
                            <img src={CurrentChat?.profile} className='rounded-full' alt="" height={50} width={50} onError={(e) => { e.target.src = MyProfile }} />
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
                                        <p className="time text-right" style={{ fontSize: "8px" }}>{convertTo12HourFormat(msg.date)}</p>
                                        {/* <div className='time align-baseline pt-1'> */}
                                            {/* <p className="time text-right text-xs">{msg?.date?.slice(0, 10)}</p> */}
                                        {/* </div> */}
                                    </div>
                                </div>
                                <div ref={messageRef}></div>
                            </div>
                        )
                    }) :
                        <div role="status" className=" animate-pulse h-screen w-full">
                            <div className="h-9 bg-gray-200 rounded-full dark:bg-gray-700 left p-2 m-2 w-2/5"></div>
                            <div className="h-9 bg-gray-200 rounded-full dark:bg-gray-700 left p-2 m-2 block ml-auto w-2/5"></div>
                            {/* <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div> */}
                        </div>
                    }
                    {ShowContextMenu && <CustomContextMenu data={{ HandleCopyMessage, HandleDeleteMessage }} />}
                </div>
                {CurrentChat !== "" && <div className="Send-Message relative">
                    <form onSubmit={(e) => HandleSubmit(e)}>
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
