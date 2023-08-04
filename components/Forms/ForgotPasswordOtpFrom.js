import React, {useState} from 'react';
import {toast} from "react-toastify";
import Label from "@/components/InputFields/Label";
import Input from "@/components/InputFields/Input";
import {useFormData} from "@/context/FormProvider";
import PrimaryButton from "@/components/Buttons/PrimaryButton";

function ForgotPasswordOtpFrom({ formStep, nextFormStep }) {

    const { data } = useFormData();
    const [otp, setOtp] = useState()
    const [errors, setErrors] = useState({});

    const handleOtpSubmit = async (e) => {
        e.preventDefault()
        if (otp === "") {
            errors.otp = 'OTP is required';
        }
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }
        console.log(otp)
        console.log(errors)
        const sentFormData = new FormData();
        sentFormData.append("email", data.profile.email)
        sentFormData.append("code", otp)


        // Perform form submission with formData
        try {
            const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}user/verification`, {
                method: 'POST',
                body: sentFormData,
            })
            const response = await result.json();

            console.log(response)

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
        <div className={formStep === 1 ? 'block' : 'hidden'}>
            <h3 className="relative z-10 font-bold text-c3 bg-clip-text">
                Forgot Password
            </h3>
            <p className="mb-4">Enter your OTP to reset password</p>
            <form role="form" onSubmit={handleOtpSubmit}>
                <div className="mb-4">
                    <Input type="text"
                           lable="OTP"
                           className="mt-1 w-full"
                           value={otp}
                           minlength="4"
                           maxlength="4"
                           required
                           onChange={({target}) => setOtp(target.value)}/>
                        {errors.otp && <div className="text-red-600">{errors.otp}</div>}
                </div>
                <div className="text-center">
                    <PrimaryButton className="w-full" type="submit">Next</PrimaryButton>
                </div>
            </form>
        </div>
    );
}

export default ForgotPasswordOtpFrom;