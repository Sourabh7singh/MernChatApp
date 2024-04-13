import React, { useEffect, useId, useState } from 'react'
import Avatar from '../../assets/MyProfile.png'
const Chats = (props) => {
    const { setmessages, setCurrentChat } = props.data;
    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    const [Conversations, setConversations] = useState([]);
    const [Users, setUsers] = useState([]);
    const ServerUrl = import.meta.env.VITE_SERVER_URL
    const FetchConversations = async () => {
        const userid = JSON.parse(localStorage.getItem("user"))?.id;
        const result = await fetch(`${ServerUrl}/api/conversation/fetchConversations/${userid}`)
        const responce = await result.json();
        setConversations(responce.map((item, index) => {
            return item.filter((user) => user.id !== userid)[0]
        }));
    }
    useEffect(() => {
        // Fetch Chats
        FetchConversations();
    }, [])
    const FetchMessages = async (user) => {
        setCurrentChat(user);
        const responce = await fetch(`${ServerUrl}/api/conversation/fetchMessages`, {
            method: "POST",
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify({ senderId: user.id, receiverId: JSON.parse(localStorage.getItem("user")).id })
        })
        const Messages = await responce.json();
        setmessages(Messages);
    }
    return (
        <>
            {/* <div className='flex justify-between items-center font-thin text-lg p-2 m-1 mt-32'>
                <div className='font-light'>Recent Chats</div>
                
            </div> */}
            <div className="Available-Uses mt-36">
                {Conversations.length > 0 && Conversations.map((user) => {
                    return <div key={user.id} className='Available-user flex items-center cursor-pointer w-full mt-2 mb-2 p-2 rounded-xl hover:bg-slate-200' onClick={(e) => { FetchMessages(user) }}>
                        <div className="profile-image ml-2 mr-2">
                            <img src={user.profile} alt="profile" className='rounded-full h-14 w-14' onError={(e) => { e.target.src = Avatar }} />
                        </div>
                        <div className="details ml-2 mr-2">
                            <div className="name font-serif text-lg">{user.name}</div>
                            <div className="username font-serif text-lg">@{user.username}</div>
                        </div>
                    </div>
                })}
            </div>
        </>
    )
}

export default Chats
