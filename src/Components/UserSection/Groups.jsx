import React, { useContext, useEffect, useState } from 'react'
import Avatar from '../../assets/MyProfile.png'
import { DashboardContext } from '../../Contexts/DashboardContext';
const Groups = (props) => {
  const { setmessages, setCurrentChat } = props.data;
  const {FetchGroups,groups}=useContext(DashboardContext);
  const ServerUrl = import.meta.env.VITE_SERVER_URL;
  useEffect(() => {
    FetchGroups();
    // Fetch Chats
  }, [])
  const FetchGroupMessages = async (group) => {
    setCurrentChat(group);
    const responce = await fetch(`${ServerUrl}/api/groups/getmessages/${group._id}`)
    const Messages = await responce.json();
    setmessages(Messages);
  }
  return (
    <>
      <div className="Available-Groups-details mt-36">
        {/* <div className="Available-Group">
          {groups.length > 0 && 
          groups.map((group) => {
            return <div key={group._id} className='Available-Groups flex p-2 cursor-pointer ' onClick={(e) => { FetchGroupMessages(group) }}>
              <div className="Groups-Image w-1/2 flex justify-center items-center">
                <img src={group.profile} alt="profile" className='rounded-full' height={50} width={50} onError={(e) => { e.target.src = Avatar }} />
              </div>
              <div className="details w-1/2">
                <div className="Group font-serif bold">{group.groupName}</div>
              </div>
            </div>
          })}
        </div> */}
        <div className="Available-Uses mt-36">
          {groups.length > 0 &&
            groups.map((group) => {
              return <div key={group._id} className='Available-user flex items-center cursor-pointer w-full mt-2 mb-2 p-2 rounded-xl hover:bg-slate-200' onClick={(e) => { FetchGroupMessages(group) }}>
                <div className="Groups-Image ml-2 mr-2">
                  <img src={group.profile} alt="profile" className='rounded-full h-14 w-14' onError={(e) => { e.target.src = Avatar }} />
                </div>
                <div className="details ml-2 mr-2">
                  <div className="Group font-serif text-lg">{group.groupName}</div>
                </div>
              </div>
            })}
        </div>
      </div>
    </>
  )
}

export default Groups
