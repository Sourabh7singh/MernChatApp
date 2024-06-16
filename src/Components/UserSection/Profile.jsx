import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const [base64Image, setBase64Image] = useState('');
    const ServerUrl = import.meta.env.VITE_SERVER_URL;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const FetchUser = async () => {
        const response = await fetch(`${ServerUrl}/api/user/fetchUser/${userId}`);
        const userData = await response.json();
        setUser(userData);
        setName(userData.name);
        setEmail(userData.email);
    }

    useEffect(() => {
        FetchUser();
    }, []);
    const ChangePassword =async () => {
        const result = await fetch(`${ServerUrl}/api/user/resetpassword/${userId}`);
        const responce = await result.json();
        if (!responce.Success) return toast(responce.msg, { type: "error" });
        navigate("/submitotp");
    }
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setBase64Image(reader.result);
            setUser({ ...user, profile: reader.result });
        };

        reader.readAsDataURL(selectedFile);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${ServerUrl}/api/user/updateProfile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: userId, image: base64Image })
            });
            const result = await response.json();
            if (result.Success) {
                toast('Profile picture updated successfully', { type: 'success' });
                FetchUser();
            }
            else {
                toast('Failed to update profile picture', { type: 'error' });
            }
        } catch (error) {
            console.error('Error updating profile picture:', error);
        }
    };

    return (
        <div className='w-full gap-4 flex flex-col justify-center items-center pt-4'>
            <div className="relative profileImage flex justify-center items-center" title='Change Profile pic'>
                <img src={user.profile} className='h-32 w-32 rounded-full m-auto' alt="Profile Image" />
                <label htmlFor="profilePicUpload">
                    <svg width="30px" height="30px" className='absolute bottom-0 right-0 cursor-pointer bg-white rounded-full m-2' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 16C13.6569 16 15 14.6569 15 13C15 11.3431 13.6569 10 12 10C10.3431 10 9 11.3431 9 13C9 14.6569 10.3431 16 12 16Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 16.8V9.2C3 8.0799 3 7.51984 3.21799 7.09202C3.40973 6.71569 3.71569 6.40973 4.09202 6.21799C4.51984 6 5.0799 6 6.2 6H7.25464C7.37758 6 7.43905 6 7.49576 5.9935C7.79166 5.95961 8.05705 5.79559 8.21969 5.54609C8.25086 5.49827 8.27836 5.44328 8.33333 5.33333C8.44329 5.11342 8.49827 5.00346 8.56062 4.90782C8.8859 4.40882 9.41668 4.08078 10.0085 4.01299C10.1219 4 10.2448 4 10.4907 4H13.5093C13.7552 4 13.8781 4 13.9915 4.01299C14.5833 4.08078 15.1141 4.40882 15.4394 4.90782C15.5017 5.00345 15.5567 5.11345 15.6667 5.33333C15.7216 5.44329 15.7491 5.49827 15.7803 5.54609C15.943 5.79559 16.2083 5.95961 16.5042 5.9935C16.561 6 16.6224 6 16.7454 6H17.8C18.9201 6 19.4802 6 19.908 6.21799C20.2843 6.40973 20.5903 6.71569 20.782 7.09202C21 7.51984 21 8.0799 21 9.2V16.8C21 17.9201 21 18.4802 20.782 18.908C20.5903 19.2843 20.2843 19.5903 19.908 19.782C19.4802 20 18.9201 20 17.8 20H6.2C5.0799 20 4.51984 20 4.09202 19.782C3.71569 19.5903 3.40973 19.2843 3.21799 18.908C3 18.4802 3 17.9201 3 16.8Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </label>
                <input
                    type="file"
                    id="profilePicUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
            <form onSubmit={handleSubmit} className='gap-4 flex flex-col justify-center items-center'>
                <input type="name" placeholder="Name" className="input p-2 m-2 rounded-lg" value={name} disabled />
                <input type="email" placeholder="Email" className="input p-2 m-2 rounded-lg" value={email} disabled />
                <input type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' value="Submit" />
            </form>
            <div className="ml-3 text-sm">
                <span htmlFor="Showpassword" className="font-light text-gray-500 dark:text-gray-300 cursor-pointer hover:underline" onClick={() => ChangePassword()}>Change Password</span>
            </div>
        </div>
    );
}

export default Profile;