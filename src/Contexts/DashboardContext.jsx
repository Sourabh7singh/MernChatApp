import { createContext, useEffect, useState } from "react";

export const DashboardContext = createContext();


const DashboardProvider = ({ children }) => {
    const ServerUrl = import.meta.env.VITE_SERVER_URL;
    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    const [ShowContextMenu, setShowContextMenu] = useState(false);
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
    const [selectedMessage, setSelectedMessage] = useState(null);

    // States
    const [Users, setUsers] = useState([]);


    //Functions
    const fetchUsers = async () => {
        const result = await fetch(`${ServerUrl}/api/user/fetchUsers/${userId}`)
        const responce = await result.json();
        setUsers(responce);
    }
    const convertTo12HourFormat = (utcTime) => {
        const date = new Date(utcTime);
        date.setHours(date.getHours());
        date.setMinutes(date.getMinutes());
        const hours = date.getHours();
        const minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        let hours12 = hours % 12;
        hours12 = hours12 ? hours12 : 12;
        const formattedTime = `${hours12}:${minutes < 10 ? '0' : ''}${minutes}${ampm}`;
        return formattedTime;
    }

    const OpenContextMenu = (e, message) => {
        e.preventDefault();
        setCoordinates({ x: e.clientX, y: e.clientY });
        setShowContextMenu(!ShowContextMenu);
        setSelectedMessage(message);
    }
    const CustomContextMenu = () => {
        return (
            <div className='context-menu absolute bg-slate-500 text-lg p-2' style={{ top: `calc(${coordinates.y}px - 70px)`, left: `calc(${coordinates.x}px - 200px)`, width: "200px" }}>
                <ul className='utils list-none'>
                    <li className='bg-slate-800 cursor-pointer rounded-md text-white text-center' style={{ border: "2px solid black" }} onClick={() => { HandleCopyMessage() }}>Copy</li>
                    <li className='bg-slate-800 cursor-pointer rounded-md text-white text-center' style={{ border: "2px solid black" }} onClick={() => { HandleDeleteMessage() }}>Delete</li>
                </ul>
            </div>
        )
    }
    return (
        <DashboardContext.Provider value={{
            Users,
            fetchUsers,
            convertTo12HourFormat,
            OpenContextMenu,
            ShowContextMenu,
            setShowContextMenu,
            coordinates,
            selectedMessage,
            setCoordinates,
            CustomContextMenu
            }}>
            {children}
        </DashboardContext.Provider>
    )
}

export default DashboardProvider