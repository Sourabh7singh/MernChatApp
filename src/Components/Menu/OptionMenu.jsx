import React from 'react'

const OptionMenu = (props) => {
    const { setSection, Section, HandleCreate, setShowMenu } = props.data;
    return (
        <div className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 absolute top-10 right-10">
            <div className="closebtn absolute right-0 top-0 flex justify-end  text-white cursor-pointer" onClick={() => setShowMenu(false)}>
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                </svg>
            </div>
            <ul className="p-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                <li className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => {setSection("Chats"), setShowMenu(false)}}>Chats</li>
                <li className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => {setSection("Groups"),setShowMenu(false)}} >Groups</li>
                <li className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => HandleCreate()} >Create New {`${Section === 'Groups' ? 'Group' : 'Conversation'}`}</li>
                <li className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={()=>{setSection("Profile"),setShowMenu(false)}}>Profile</li>
            </ul>
        </div>
    )
}

export default OptionMenu
