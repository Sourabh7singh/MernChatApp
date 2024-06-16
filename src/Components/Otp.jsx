import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Otp = () => {
    const [timerCount, setTimer] = useState(60);
    const [OTPinput, setOTPinput] = useState(["", "", "", ""]);
    const [disable, setDisable] = useState(true);
    const user = JSON.parse(localStorage.getItem("user")) || localStorage.getItem("user");
    const ServerUrl = import.meta.env.VITE_SERVER_URL;
    const navigate = useNavigate();
    const inputRefs = useRef([]);

    const resendOTP = async() => {
        const result = await fetch(`${ServerUrl}/api/user/resetpassword/${user.id}`);
        const responce = await result.json();
        if(!responce.Success) return toast(responce.msg, { type: "error" });
        toast(responce.msg, { type: "success" });
    };

    const verfiyOTP = async() => {
        if (OTPinput.join("") === "") return toast("Please enter OTP", { type: "error" });
        let code = OTPinput.join("");
        // Verify OTP logic here
        const result = await fetch(`${ServerUrl}/api/user/verifyotp`,{
            method: "POST",
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify({ id: user.id, code })
        })
        const responce = await result.json();
        if(!responce.Success) return toast(responce.msg, { type: "error" });
        setOTPinput(["", "", "", ""]);
        toast("OTP verified", { type: "success" });
        localStorage.setItem("token", responce.token);
        navigate("/createpassword");
    };

    useEffect(() => {
        let interval = setInterval(() => {
            setTimer((lastTimerCount) => {
                lastTimerCount <= 1 && clearInterval(interval);
                if (lastTimerCount <= 1) setDisable(false);
                if (lastTimerCount <= 0) return lastTimerCount;
                return lastTimerCount - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [disable]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/^[0-9]$/.test(value) || value === "") {
            const newOTP = [...OTPinput];
            newOTP[index] = value;
            setOTPinput(newOTP);
            if (value !== "" && index < OTPinput.length - 1) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !OTPinput[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    return (
        <div className="App h-screen">
            <ToastContainer />
            <div className="header">
                <h1 className="text-3xl font-bold w-full text-center bg-slate-700 text-white p-4">Web-Chat OTP Verification</h1>
            </div>
            <div className="w-full bg-gray-50 p-6">
                <div className="bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
                    <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                            <div className="font-semibold text-3xl">
                                <p>Email Verification</p>
                            </div>
                            <div className="flex flex-row text-sm font-medium text-gray-400">
                                <p>We have sent a code to your email {user.email}</p>
                            </div>
                        </div>
                        <div>
                            <form>
                                <div className="flex flex-col space-y-16">
                                    <div className="flex flex-row gap-2 items-center justify-between mx-auto w-full max-w-xs">
                                        {OTPinput.map((_, index) => (
                                            <div key={index} className="w-16 h-16">
                                                <input
                                                    ref={(el) => (inputRefs.current[index] = el)}
                                                    maxLength="1"
                                                    className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                                                    type="numberic"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    value={OTPinput[index]}
                                                    onChange={(e) => handleChange(e, index)}
                                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col space-y-5">
                                        <div>
                                            <a
                                                onClick={() => verfiyOTP()}
                                                className="flex flex-row cursor-pointer items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                                            >
                                            Verify Account
                                            </a>
                                        </div>
                                        <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                                            <p>Didn't receive code?</p>
                                            <a
                                                className="flex flex-row items-center"
                                                style={{
                                                    color: disable ? "gray" : "blue",
                                                    cursor: disable ? "none" : "pointer",
                                                    textDecorationLine: disable ? "none" : "underline",
                                                }}
                                                onClick={() => resendOTP()}
                                            >
                                            {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Otp;
