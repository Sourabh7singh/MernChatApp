import { createContext,  useState } from "react";

export const DashboardContext = createContext();


const DashboardProvider = ({ children }) => {
    const ServerUrl = import.meta.env.VITE_SERVER_URL;


    // States
    const [Users, setUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const userId = localStorage.getItem("userId");
    const [ShowContextMenu, setShowContextMenu] = useState(false);
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
    const [Conversations, setConversations] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [messages, setmessages] = useState([]);
    const [loading,setLoading] = useState(false);
    const[ConversationLoading,setConversationLoading] = useState(false);
    const [GroupLoading,setGroupLoading] = useState(false);
    const [CurrentChat, setCurrentChat] = useState("");
    const [groups, setGroups] = useState([]);
    const [notificationCount, setNotificationCount] = useState([]);
    const [searchUsers, setSearchUsers] = useState("");
    const [ActiveUsers, setActiveUsers] = useState([]);
    
    //Functions
    const token = localStorage.getItem("token");
    const fetchUsers = async () => {
        const result = await fetch(`${ServerUrl}/api/user/fetchUsers`,{
            method: "GET",
            headers: {
                'Content-type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })
        const responce = await result.json();
        setUsers(responce);
    }

    const FetchMessages = async (user) => {
        setLoading(true)
        if (!user) return;
        const responce = await fetch(`${ServerUrl}/api/conversation/fetchMessages`, {
            method: "POST",
            headers: {
                'Content-type': "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ receiverId:CurrentChat?.id })
        })
        const Messages = await responce.json();
        setmessages(Messages.sort());
        setLoading(false);
    }


    const FetchGroups = async () => {
        setGroupLoading(true);
        const userid = JSON.parse(localStorage.getItem("user")).id;
        const result = await fetch(`${ServerUrl}/api/groups/getgroups/${userid}`)
        const responce = await result.json();
        setGroups(responce);
        setGroupLoading(false);
    }

    const FetchConversations = async (localtoken) => {
        const bearer = localtoken || token;
        setConversationLoading(true);
        const result = await fetch(`${ServerUrl}/api/conversation/fetchConversations`,{
            method: "GET",
            headers: {
                'Content-type': "application/json",
                'Authorization': `Bearer ${bearer}`
            }
        })
        const responce = await result.json();
        setConversations(responce);
        setConversationLoading(false);
    }

    return (
        <DashboardContext.Provider value={{
            Users,
            ServerUrl,
            setUsers,
            fetchUsers,
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
            setConversationLoading,
            GroupLoading,
            setGroupLoading,
            searchUsers,
            setSearchUsers,
            ActiveUsers,
            setActiveUsers
        }}>
            {children}
        </DashboardContext.Provider>
    )
}

export default DashboardProvider