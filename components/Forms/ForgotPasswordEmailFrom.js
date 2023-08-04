import React, {useContext, useState} from 'react';
import Label from "@/components/InputFields/Label";
import Input from "@/components/InputFields/Input";
import {toast} from "react-toastify";
import {FormContext} from "@/context/FormProvider";
import PrimaryButton from "@/components/Buttons/PrimaryButton";

function ForgotPasswordEmailFrom({ formStep, nextFormStep }) {

    const [userInfo, setUserInfo] = useState()
    const [email, setEmail] = useState()
    const [otp, setOtp] = useState()
    const [password, setPassword] = useState()

    const { setFormValues } = useContext(FormContext);

    const handleEmailSubmit = async (e) => {
        e.preventDefault()
        const sentFormData = new FormData();

        sentFormData.append("email", email)

        // Perform form submission with formData
        try {
            const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}user/forgotPassword`, {
                method: 'POST',
                body: sentFormData,
            })
            const response = await result.json();

            if (response.status) {

                toast.success(response.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
                setFormValues(response.data);
                nextFormStep();
            } else {

                toast.error(response.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={formStep === 0 ? 'block' : 'hidden'}>
            <h3 className="relative z-10 font-bold text-c3 bg-clip-text">
                Forgot Password
            </h3>
            <p className="mb-4">Enter Email to reset password</p>
            <form role="form" onSubmit={handleEmailSubmit}>
                <div className="mb-4">
                    <Input type="email"
                           lable="Email Address"
                           className="mt-1 w-full"
                           value={email}
                           required
                           onChange={({target}) => setEmail(target.value)}/>
                </div>
                <div className="text-center">
                    <PrimaryButton className="w-full" type="submit">Next</PrimaryButton>
                </div>
            </form>
        </div>
    );
}

export default ForgotPasswordEmailFrom;