import React from 'react'
import Avatar from '../../assets/MyProfile.png'
const ShowProfile = (props) => {
    const {CurrentChat} = props.data;
  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-50 flex flex-col items-center justify-center bg-slate-600 rounded-lg'>
      <div className='h-24 w-24'>
        <img src={CurrentChat?.profile} className='w-full h-full rounded-full' alt="" onError={(e)=>{e.target.src=Avatar}}/>
      </div>
      <div className='text-white font-sans m-4'>
        <div className='name '>Name: {CurrentChat.name?CurrentChat.name:CurrentChat.groupName}</div>
        {CurrentChat.groupName?<div className='username'>Members: {CurrentChat?.members?.length}</div>:<div className='username'>Username: {CurrentChat?.username}</div>}
        {CurrentChat.groupName?<div className='Members'>{CurrentChat?.members.map((member)=>{return member.name+","})}</div>:null}
      </div>
    </div>
  )
}

export default ShowProfile
