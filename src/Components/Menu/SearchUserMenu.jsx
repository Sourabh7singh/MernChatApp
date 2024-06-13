import React, { useContext, useEffect, useState } from 'react'
import { DashboardContext } from '../../Contexts/DashboardContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SearchUserMenu = (props) => {
    const [FetchedUsers, setFetchedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const { ServerUrl, setCurrentChat } = useContext(DashboardContext);
    const { Section, HandleUserSelection, CreateGroup, setGroupName, groupName, SelectedGroupUsers, setSelectedGroupUsers, setAddusersmenu } = props.data;
    const FetchUsers = async () => {
        if (search === "") {
            return toast("Please Enter something", {
                type: "info"
            });
        }
        const users = await fetch(`${ServerUrl}/api/user/searchusers?search=${search}&userId=${JSON.parse(localStorage.getItem("user")).id}`);
        const result = await users.json();
        if (result.length === 0) {
            return toast("No Users Found", {
                type: "info"
            });
        }
        setFetchedUsers(result);
    }
    useEffect(() => {
        setFetchedUsers([]);
        setSelectedGroupUsers([]);
    }, [Section]);
    return (
        <div className="z-10 bg-slate-600 divide-y divide-gray-100 rounded-lg shadow w-[250px] absolute top-10 right-0">
            {
                Section === 'Chats' &&
                <div className='SearchUser'>
                    <div className='flex justify-between m-2'>
                        <label htmlFor="user" className="block mb-2 text-sm font-medium text-white">Search For a user</label>
                        <div className='cursor-pointer' style={{ right: "15px", top: "10px" }} onClick={() => FetchUsers()}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#ffffff">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className='m-2'>
                        <input type="text" name="email" id="user" className="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block" placeholder="Enter Name or Username" required value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <div className='overflow-y-scroll max-h-40'>
                        {FetchedUsers && FetchedUsers.map((user, index) => {
                            return <div className={`text-center font-thin p-2 m-1 flex items-center cursor-pointer  rounded-2xl hover:bg-slate-600 bg-slate-900 `} key={index} onClick={() => { setCurrentChat(user), setAddusersmenu(false) }}>
                                <span className='font-light m-2 text-white'>{user.username}</span>
                            </div>
                        })}
                    </div>
                </div>

            }
            {
                Section === 'Groups' && <div className="pt-2 text-sm flex justify-between items-center">
                    <h6 className='text-center text-white pl-2'>Create Group</h6>
                    <div className="done cursor-pointer pr-2" title='done?' onClick={() => { CreateGroup() }}>
                        <svg viewBox="0 0 24 24" fill="none" height={20} width={20} xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 10L12.2581 12.4436C12.6766 12.7574 13.2662 12.6957 13.6107 12.3021L20 5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"></path> <path d="M21 12C21 13.8805 20.411 15.7137 19.3156 17.2423C18.2203 18.7709 16.6736 19.9179 14.893 20.5224C13.1123 21.1268 11.187 21.1583 9.38744 20.6125C7.58792 20.0666 6.00459 18.9707 4.85982 17.4789C3.71505 15.987 3.06635 14.174 3.00482 12.2945C2.94329 10.415 3.47203 8.56344 4.51677 6.99987C5.56152 5.4363 7.06979 4.23925 8.82975 3.57685C10.5897 2.91444 12.513 2.81996 14.3294 3.30667" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"></path> </g></svg>
                    </div>
                </div>
            }
            {
                Section === 'Groups' &&
                <div className='relative'>
                    <div className='text-center font-thin text-lg p-2 m-1'>
                        <input type="text" placeholder='Enter the name of the group' id='group' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  w-full' value={groupName} onChange={(e) => { setGroupName(e.target.value) }} />
                    </div>
                    <div className='SearchUser font-thin m-1 p-2'>
                        <div className='flex justify-between'>
                            <label htmlFor="Groupuser" className="block mb-2 text-sm font-medium text-white">Search a users to add</label>
                            <div className='cursor-pointer w-4' style={{ right: "15px", top: "10px" }} onClick={() => FetchUsers()}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#ffffff">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        <input type="text" placeholder='Enter the name of the group' id='Groupuser' className=' bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full' value={search} onChange={(e) => { setSearch(e.target.value) }} />
                    </div>
                    <div className="selectedusers">
                        {SelectedGroupUsers.length > 0 && <div className="selected-users">
                            <span className='font-light m-2 text-center block text-white'>Selected Users</span>
                            {SelectedGroupUsers && SelectedGroupUsers.map((user, index) => {
                                return <span className="selected-user text-white inline-block justify-evenly items-center text-center font-thin text-sm p-2 m-1 cursor-pointer rounded-2xl hover:bg-slate-600 bg-slate-800" key={index}>
                                    {user.name}
                                    <svg className="ml-1 inline text-gray-800 cursor-pointer w-[20px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" onClick={() => setSelectedGroupUsers(SelectedGroupUsers.filter((item) => item !== user))}>
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                                    </svg>
                                </span>
                            })
                            }
                            <hr />
                        </div>
                        }
                    </div>
                    <div className='overflow-y-scroll max-h-40'>
                        {FetchedUsers && FetchedUsers.map((user, index) => {
                            return <div className={`text-center font-thin p-2 m-1 flex items-center cursor-pointer  rounded-2xl hover:bg-slate-600 ${SelectedGroupUsers.includes(user.id) ? "bg-slate-700" : "bg-slate-900"}`} key={index} onClick={(e) => HandleUserSelection(user)}>
                                <span className='font-light m-2 text-white'>{user.username}</span>
                            </div>
                        })}
                    </div>
                </div>

            }
        </div >
    )
}

export default SearchUserMenu
