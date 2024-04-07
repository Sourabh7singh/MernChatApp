import React from 'react'
import MyProfile from '../../assets/MyProfile.png'
const Profile = () => {
    const user = {
        name: "Saurabh singh",
        username: "Saurabh@1311"
    }
    return (
        <>
            <div className='My-details flex justify-center items-center pt-2 pb-2 border-b-2 border-slate-400'>
                <div className="profile-Image w-1/2 h-full">
                    <img src="https://pic.photos/200" className='h-16 w-16 rounded-full m-auto' alt="Profile Image" onError={(e) => { e.target.src = MyProfile }} />
                </div>
                <div className="Details pt-2 pb-2 w-1/2">
                    <div className="name font-mono">{user.name}</div>
                    <div className="username font-mono">{user.username}</div>
                </div>
            </div>

        </>
    )
}

export default Profile
