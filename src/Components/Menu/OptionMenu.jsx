import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OptionMenu = (props) => {
    const { HandleCreate, setShowMenu } = props.data;
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <div className="z-10 bg-slate-600 divide-y divide-gray-100 rounded-lg shadow w-44 absolute top-10 right-10">
            <div className="closebtn absolute right-0 top-0 flex justify-end cursor-pointer" onClick={() => setShowMenu(false)}>
                <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                </svg>
            </div>
            <ul className="p-2 text-sm text-gray-700" aria-labelledby="dropdownMenuIconButton">
                <li className="block px-4 text-white py-2 rounded-md hover:bg-gray-900" onClick={() => {navigate("/"); setShowMenu(false);}}>Chats</li>
                <li className="block px-4 text-white py-2 rounded-md hover:bg-gray-900" onClick={() => {navigate("/groups"); setShowMenu(false);}}>Groups</li>
                <li className="block px-4 text-white py-2 rounded-md hover:bg-gray-900" onClick={() => HandleCreate()}>Create New {`${location.pathname === '/groups' ? 'Group' : 'Conversation'}`}</li>
                <li className="block px-4 text-white py-2 rounded-md hover:bg-gray-900" onClick={() => {navigate("/profile"); setShowMenu(false);}}>Profile</li>
                <li className="block px-4 text-white py-2 rounded-md hover:bg-gray-900" onClick={() => {localStorage.removeItem("user"); navigate("/login");}}>Log Out</li>
            </ul>
        </div>
    );
}

export default OptionMenu;
