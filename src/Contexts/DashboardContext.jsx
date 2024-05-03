import { createContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export const DashboardContext = createContext();


const DashboardProvider = ({ children }) => {
    const ServerUrl = import.meta.env.VITE_SERVER_URL;

    // States
    const [Users, setUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    const [ShowContextMenu, setShowContextMenu] = useState(false);
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
    const [Conversations, setConversations] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [messages, setmessages] = useState([]);
    const [loading,setLoading] = useState(false);
    const[ConversationLoading,setConversationLoading] = useState(false);
    const [CurrentChat, setCurrentChat] = useState("");
    const [groups, setGroups] = useState([]);
    const [notificationCount, setNotificationCount] = useState([]);


    //Functions
    const fetchUsers = async () => {
        const result = await fetch(`${ServerUrl}/api/user/fetchUsers/${userId}`)
        const responce = await result.json();
        setUsers(responce);
    }

    const FetchMessages = async (user) => {
        setLoading(true)
        if (!user) return;
        const responce = await fetch(`${ServerUrl}/api/conversation/fetchMessages`, {
            method: "POST",
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify({ senderId: userId, receiverId:CurrentChat?.id })
        })
        const Messages = await responce.json();
        setmessages(Messages);
        setLoading(false);
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

    const FetchConversations = async () => {
        setConversationLoading(true);
        const userid = JSON.parse(localStorage.getItem("user"))?.id;
        const result = await fetch(`${ServerUrl}/api/conversation/fetchConversations/${userid}`)
        const responce = await result.json();
        setConversations(responce.map((item) => {
            const user = item.filter((user) => user.id !== userid)[0]
            return user
        }));
        setConversationLoading(false);
    }

    return (
        <DashboardContext.Provider value={{
            Users,
            ServerUrl,
            setUsers,
            fetchUsers,
            convertTo12HourFormat,
            ShowContextMenu,
            setShowContextMenu,
            setSelectedMessage,
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
            setGroups,
            notificationCount,
            setNotificationCount,
            socket,
            setSocket,
            FetchConversations,
            loading,
            setLoading,
            ConversationLoading,
            setConversationLoading
        }}>
            {children}
        </DashboardContext.Provider>
    )
}

export default DashboardProvider