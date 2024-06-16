import React, { useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const CreatePassword = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const ServerUrl = import.meta.env.VITE_SERVER_URL;
    const navigate = useNavigate();
    const CheckValidity = async () => {
        if (!token) {
            navigate("/submitotp");
        }
        const result = await fetch(`${ServerUrl}/api/user/${user.id}/verifytoken/${token}`)
        // console.log(result);
        const responce = await result.json();
        if (!responce.Success) {
            navigate("/submitotp");
        }
    }
    useEffect(() => {
        CheckValidity();
    }, [])
    const HandlePasswordChange = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast("Password does not match", { type: "error" });
        }
        const result = await fetch(`${ServerUrl}/api/user/${user.id}/changepassword/${token}`, {
            method: "POST",
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify({ password })
        })
        const responce = await result.json();
        if (responce.Success) {
            toast("Password changed successfully, you'll be redirected to login page automatically in 5 seconds", { type:"success"});
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setTimeout(()=>{
                navigate("/");
            },5000);
        }
    }
    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <ToastContainer/>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"/>
                        WebChat App
                </a>
                <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
                    <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Change Password
                    </h2>
                    <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={HandlePasswordChange}>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                            <input type={`${showPassword ? "text" : "password"}`} name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                             value={password} onChange={(e) => setPassword(e.target.value)}
                             required=""/>
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                            <input type={`${showPassword ? "text" : "password"}`} name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            required=""/>
                        </div>
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input id="Showpassword" aria-describedby="showpassword" type="checkbox" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"/>
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="Showpassword" className="font-light text-gray-500 dark:text-gray-300">Show Password</label>
                            </div>
                        </div>
                        <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Reset passwod</button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default CreatePassword
