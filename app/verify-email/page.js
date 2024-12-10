"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../context/languagecontext";
import { useSearchParams } from "next/navigation";

const VerifyEmailPage = () => {
    const { translations } = useLanguage();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const router = useRouter();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false); // New state for loading
    const [resendLoading, setResendLoading] = useState(false); // State for resend button loading


    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!email) {
            setError("Email is not found in the URL. Please try registering again.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:4000/auth/confirm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, code }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Your email has been verified!");
                localStorage.setItem("token", data.token);
               router.push("/")
                window.location.href = "/";
            } else {
                setError(data.message || "Error verifying email");
            }
        } catch (error) {
            setError("Network error, please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleResendCode = async () => {
        setResendLoading(true);

        try {
            const response = await fetch("http://localhost:4000/auth/resend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: localStorage.getItem("email"),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("A new confirmation code has been sent to your email!");
            } else {
                setError(data.message || "Error resending code");
            }
        } catch (error) {
            setError("Network error, please try again");
        } finally {
            setResendLoading(false); // Reset resend button loading state
        }
    };

    return (
        <div className="text-white p-4 flex items-center justify-center">
            <div className="rounded-md p-[50px] bg-[#737373] space-y-10 w-[50%]">
                <div className="space-y-2">
                    <div className="text-2xl font-semibold">{translations.verifyEmail}</div>
                    <div className="font-semibold">{translations.enterCode}</div>
                </div>

                <form className="space-y-4" onSubmit={handleVerify}>
                    <div className="space-y-1">
                        <div>{translations.verificationCode}</div>
                        <input
                            type="text"
                            placeholder={translations.enterVerificationCode}
                            className="w-[90%] h-10 rounded-md p-2 text-black"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>

                    {error && <div className="text-red-500">{error}</div>}
                    {success && <div className="text-green-500">{success}</div>}

                    <div className="py-4">
                        <button
                            type="submit"
                            className="flex justify-center  bg-black text-white font-bold  rounded-md h-10 w-[90%] items-center shadow-md hover:text-white/80 hover:transform hover:translate-x-[1px] hover:-translate-y-[1px] duration-200"
                           
                        >
                            {loading ? "Verifying..." : translations.verifyCode}
                        </button>
                    </div>

                    <div className="flex justify-center gap-2">
                        {translations.didNotReceiveCode}
                        <button
                            onClick={handleResendCode}
                            className="text-blue-500"
                         
                        >
                            {resendLoading ? "Resending..." : translations.resendCode}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
