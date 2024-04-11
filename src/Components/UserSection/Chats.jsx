import React, { useEffect, useId, useState } from 'react'
import Avatar from '../../assets/MyProfile.png'
const Chats = (props) => {
    const {setmessages,setCurrentChat}=props.data;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const [Conversations,setConversations]=useState([]);
    const [Addusersmenu,setAddusersmenu]=useState(false);
    const [Users,setUsers]=useState([]);
    const ServerUrl = 'http://localhost:5001'
    const FetchConversations=async()=>{
        const userid = JSON.parse(localStorage.getItem("user")).id;
        const result = await fetch(`http://localhost:5001/api/conversation/fetchConversations/${userid}`)
        const responce = await result.json();
        setConversations(responce.map((item,index)=>{
            return item.filter((user)=>user.id!==userid)[0]
        }));
    }
    const fetchUsers = async()=>{
        const result = await fetch(`${ServerUrl}/api/user/fetchUsers/${userId}`)
        const responce = await result.json();
        setUsers(responce);
    }
    useEffect(()=>{

        // Fetch Chats
        fetchUsers();
        FetchConversations();
    },[])
    const FetchMessages=async(user)=>{
        setAddusersmenu(false);
        setCurrentChat(user);
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
                <div className='flex justify-between items-center font-thin text-lg p-2 m-1'>
                    <div className='font-light'>Recent Chats</div>
                    <div className="Create-Conversation text-[30px] realtive" onClick={()=>{setAddusersmenu(!Addusersmenu)}} style={{border:"2px solid transparent",height:"30px",width:"30px",textAlign:"center",borderRadius:"50%",cursor:"pointer",backgroundColor:"green",color:"white",fontWeight:"bold"}}>
                        +
                        {Addusersmenu && <div className="Addusers-Menu absolute bg-gray-600 z-50 max-h-[300px] overflow-y-auto">
                            <div className='text-center font-thin text-lg p-2 m-1'>
                                <h5>Start New Conversation</h5>
                            </div>
                            <div className='text-center font-thin text-lg p-2 m-1'>
                                {Users && Users.map((user) => {
                                    return <div className='text-center font-thin text-lg p-2 m-1 flex justify-between items-center cursor-pointer' key={user.id} onClick={(e) => {FetchMessages(user)}}>
                                        <div className='UserProfile m-1'>
                                            <img src={user.profile} alt="profile" className='rounded-full' height={40} width={40} onError={(e) => {e.target.src = Avatar }}/>
                                        </div>
                                        <span className='font-light m-1'>{user.username}</span>
                                    </div>
                                })}
                            </div>
                        </div>}
                    </div>
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
