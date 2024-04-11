import React, { useEffect, useState } from 'react'
import Avatar from '../../assets/MyProfile.png'
const Groups = (props) => {
  const {setmessages,setCurrentChat}=props.data;
  const [groups,setGroups]=useState([]);
  const ServerUrl = 'http://localhost:5001'
  useEffect(()=>{
      // Fetch Chats
      const FetchConversations=async()=>{
          const userid = JSON.parse(localStorage.getItem("user")).id;
          const result = await fetch(`${ServerUrl}/api/groups/getgroups/${userid}`)
          const responce = await result.json();
          setGroups(responce);
      }
      FetchConversations();
  },[])
  const FetchGroupMessages=async(group)=>{
      setCurrentChat(group);
      const responce = await fetch(`${ServerUrl}/api/groups/getmessages/${group._id}`)
      const Messages = await responce.json();
      setmessages(Messages);
  }
  return (
    <>
      <div className="Available-Groups-details">
        <div className='text-center font-thin text-lg p-2 m-1'>
          <h5>Groups</h5>
        </div>
        <div className="Available-Group">
          {groups.length > 0 && 
          groups.map((group) => {
            return <div key={group._id} className='Available-Groups flex justify-evenly p-2 cursor-pointer m-3' onClick={(e) => { FetchGroupMessages(group) }}>
              <div className="Groups-Image w-1/2 flex justify-center items-center">
                <img src={group.profile} alt="profile" className='rounded-full' height={50} width={50} onError={(e) => { e.target.src = Avatar }} />
              </div>
              <div className="details w-1/2">
                <div className="Group font-serif bold">{group.groupName}</div>
              </div>
            </div>
          })}
        </div>
      </div>
    </>
  )
}

export default Groups
