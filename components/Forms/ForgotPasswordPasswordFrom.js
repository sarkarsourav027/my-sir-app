import React, {useState} from 'react';
import {toast} from "react-toastify";
import Input from "@/components/InputFields/Input";
import {useFormData} from "@/context/FormProvider";
import {useRouter} from "next/router";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import {useFormik} from "formik";
import * as Yup from "yup";
import {signIn} from "next-auth/react";

function ForgotPasswordPasswordFrom({formStep, nextFormStep}) {

    const {data} = useFormData();
    const [errors, setErrors] = useState({});

    const router = useRouter();
    const [password, setPassword] = useState()

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        if (password === "") {
            errors.password = 'OTP is required';
        }else{
            if (password.length < 6){
                errors.password = 'We have minimum 6 characters required';
            }
        }
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }
        const sentFormData = new FormData();

        sentFormData.append("user_id", data.profile.user_id)
        sentFormData.append("password", password)


        // Perform form submission with formData
        try {
            const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}user/resetPassword`, {
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
                await router.push('/')
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

    const formik = useFormik({
        initialValues: {
            password: '',
        },
        validationSchema: Yup.object().shape({
            password: Yup.string()
                .min(6, 'We have minimum 6 characters required')
                .max(50, 'Too Long!')
                .required('Required'),
        }),
        onSubmit: async (values, {setSubmitting}) => {

            const sentFormData = new FormData();
            sentFormData.append("password", values.password)
            sentFormData.append("user_id", data.profile.user_id)

            const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}user/resetPassword`, {
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
                await router.push('/')
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

            console.log(response)

            setSubmitting(false);
        },
    });

    return (
        <div className={formStep === 2 ? 'block' : 'hidden'}>
            <h3 className="relative z-10 font-bold text-c3 bg-clip-text">
                Forgot Password
            </h3>
            <p className="mb-4">Set your new password</p>
            <form onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                    <Input
                        type="password"
                        lable="New Password"
                        className="mt-1 w-full"
                        name="password"
                        id="password"
                        required={true}
                        value={formik.values.password} onChange={formik.handleChange}
                    />
                    {formik.errors.password ?
                        <div className="text-red-600">{formik.errors.password}</div> : null}
                </div>
                <div className="text-center">
                    <PrimaryButton className="w-full" type="submit">Submit</PrimaryButton>
                </div>
            </form>
        </div>
    );
}

export default ForgotPasswordPasswordFrom;