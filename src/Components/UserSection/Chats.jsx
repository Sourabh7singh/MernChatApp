import React, { useEffect, useId, useState } from 'react'
import Avatar from '../../assets/MyProfile.png'
const Chats = (props) => {
    const {setmessages}=props;
    const [Conversations,setConversations]=useState([]);
    const ServerUrl = 'http://localhost:5001'
    useEffect(()=>{
        // Fetch Chats
        const FetchConversations=async()=>{
            const userid = JSON.parse(localStorage.getItem("user")).id;
            const result = await fetch(`http://localhost:5001/api/conversation/fetchConversations/${userid}`)
            const responce = await result.json();
            setConversations(responce.map((item,index)=>{
                return item.filter((user)=>user.id!==userid)[0]
            }));
        }
        FetchConversations();
    },[])
    const FetchMessages=async(user)=>{
        console.log("Fetching Messages",user);
        const responce = await fetch(`${ServerUrl}/api/conversation/fetchMessages`,{
            method:"POST",
            headers:{
                'Content-type':"application/json"
            },
            body:JSON.stringify({senderId:user.id,receiverId:JSON.parse(localStorage.getItem("user")).id})
        }) 
        const Messages = await responce.json();
        setmessages(Messages);
    }
    return (
        <>
            <div className="Available-user-details">
                <div className='text-center font-thin text-lg p-2 m-1'>
                    <h5>Recent Chats</h5>
                </div>
                <div className="Available-Uses">
                    {Conversations.length>0&&Conversations.map((user) => {
                        return <div key={user.id} className='Available-user flex justify-evenly p-2 cursor-pointer m-3' onClick={(e) => { FetchMessages(user) }}>
                            <div className="profile-image w-1/2 flex justify-center items-center">
                                <img src={user.profile} alt="profile" className='rounded-full' height={50} width={50} onError={(e) => {e.target.src = Avatar }}/>
                            </div>
                            <div className="details w-1/2">
                                <div className="username font-serif bold">@{user.username}</div>
                                <div className="name font-serif">{user.name }</div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </>
    )
}

export default Chats
