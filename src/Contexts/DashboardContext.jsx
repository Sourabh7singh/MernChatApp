import { createContext, useEffect, useState } from "react";

export const DashboardContext = createContext();


const DashboardProvider = ({ children }) => {
    const ServerUrl = import.meta.env.VITE_SERVER_URL;
    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    const [ShowContextMenu, setShowContextMenu] = useState(false);
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
    const [Conversations, setConversations] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [messages, setmessages] = useState([]);
    const [CurrentChat, setCurrentChat] = useState(null);
    const [groups, setGroups] = useState([]);


    // States
    const [Users, setUsers] = useState([]);


    //Functions
    const fetchUsers = async () => {
        const result = await fetch(`${ServerUrl}/api/user/fetchUsers/${userId}`)
        const responce = await result.json();
        setUsers(responce);
    }

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
    const FetchGroups = async () => {
        const userid = JSON.parse(localStorage.getItem("user")).id;
        const result = await fetch(`${ServerUrl}/api/groups/getgroups/${userid}`)
        const responce = await result.json();
        setGroups(responce);
      }

    return (
        <DashboardContext.Provider value={{
            Users,
            setUsers,
            fetchUsers,
            convertTo12HourFormat,
            ShowContextMenu,
            setShowContextMenu,
            coordinates,
            selectedMessage,
            setCoordinates,
            Conversations,
            setConversations,
            FetchMessages,
            messages,
            setmessages,
            CurrentChat,
            setCurrentChat,
            FetchGroups,
            groups,
            setGroups
            }}>
            {children}
        </DashboardContext.Provider>
    )
}

export default DashboardProvider