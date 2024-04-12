import React, { useEffect, useState } from 'react'
import MyProfile from '../../assets/MyProfile.png'
const Profile = () => {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const [user,setUser]=useState({});
    const ServerUrl = import.meta.env.VITE_SERVER_URL;
    const FetchUser =async()=>{
        const responce = await fetch(`${ServerUrl}/api/user/fetchUser/${userId}`);
        const user = await responce.json();
        setUser(user);
    }
    useEffect(()=>{
        FetchUser();
    },[])
    return (
        // Redesign completely
        <>
            <div className='My-details flex justify-center items-center pt-2 pb-2 border-b-2 border-slate-400 mt-36'>
                <div className="profile-Image w-1/2 h-full">
                    <img src={user?.profile} className='h-16 w-16 rounded-full m-auto' alt="Profile Image" onError={(e) => { e.target.src = MyProfile }} />
                </div>
                <div className="Details pt-2 pb-2 w-1/2">
                    <div className="name font-mono">{user?.name}</div>
                    <div className="username font-mono">{user?.username}</div>
                </div>
            </div>

        </>
    )
}

export default Profile
