import React, { useContext, useEffect, useId, useState } from 'react'
import Avatar from '../../assets/MyProfile.png'
import { DashboardContext } from '../../Contexts/DashboardContext';
const Chats = (props) => {
    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    const {Conversations,setConversations,FetchMessages,CurrentChat,notificationCount,setNotificationCount,setCurrentChat,SelectedChatcompare} = useContext(DashboardContext);
    const [Users, setUsers] = useState([]);
    const ServerUrl = import.meta.env.VITE_SERVER_URL
    const FetchConversations = async () => {
        const userid = JSON.parse(localStorage.getItem("user"))?.id;
        const result = await fetch(`${ServerUrl}/api/conversation/fetchConversations/${userid}`)
        const responce = await result.json();
        let notcount= []
        setConversations(responce.map((item, index) => {
            const user = item.filter((user) => user.id !== userid)[0]
            notcount.push({id:user.id,count:0})
            return user
        }));
        setNotificationCount(notcount);
    }
    useEffect(()=>{
        FetchMessages(CurrentChat);
        console.log(CurrentChat);
    },[CurrentChat])

    useEffect(() => {
        // Fetch Chats
        FetchConversations();
    }, [])
    
    return (
        <>
            <div className="Available-Uses mt-36">
                {Conversations.length > 0 && Conversations.map((user,index) => {
                    return <div key={user.id} className='Available-user flex items-center cursor-pointer w-full mt-2 mb-2 p-2 rounded-xl hover:bg-slate-200' onClick={(e) => {setCurrentChat(user) }}>
                        <div className="profile-image ml-2 mr-2">
                            <img src={user.profile} alt="profile" className='rounded-full h-14 w-14' onError={(e) => { e.target.src = Avatar }} />
                        </div>
                        <div className="details ml-2 mr-2">
                            <div className="name font-serif text-lg">{user.name}</div>
                            <div className="username font-serif text-lg">@{user.username}</div>
                        </div>
                        {notificationCount.filter((item) => item.id === user.id)[0]?.count!==0?<div className='notification ml-auto p-1 rounded-full bg-green-600 h-5 w-5 text-center'>
                            {notificationCount.filter((item) => item.id === user.id)[0]?.count}
                        </div>:""}
                    </div>
                })}
            </div>
        </>
    )
}

export default Chats
