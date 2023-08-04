import Link from "next/link";
import {getSession, signIn} from "next-auth/react";
import {toast} from "react-toastify";
import Input from "@/components/InputFields/Input";
import {FaApple} from "react-icons/fa";
import {FcGoogle} from "react-icons/fc";
import {useRouter} from "next/router";
import {useFormik} from "formik";
import * as Yup from "yup";
import Image from "next/image";
import logoIcon from "@/public/assets/img/logo.jpeg";
import bgImage from "@/public/assets/img/bg-sing-up.webp";
import PrimaryButton from "@/components/Buttons/PrimaryButton";

export default function SignUp() {

    const router = useRouter();

    const routeName = router.pathname;
    const formik = useFormik({
        initialValues: {
            password: '',
            email: '',
            fullname: '',
            device_type: ''
        },
        validationSchema: Yup.object().shape({
            fullname: Yup.string()
                .required('Required'),
            password: Yup.string()
                .min(6, 'We have minimum 6 characters required')
                .max(50, 'Too Long!')
                .required('Required'),
            email: Yup.string().email().matches(/^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i,'Invalid email').required('Required'),
        }),
        onSubmit: async (values, {setSubmitting}) => {

            const sentFormData = new FormData();

            sentFormData.append("fullname", values.fullname)
            sentFormData.append("email", values.email)
            sentFormData.append("password", values.password)
            sentFormData.append("device_type", "WEB")

            const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}user/registration`, {
                method: 'POST',
                body: sentFormData,
            })

            const response = await result.json();

            if (response.status) {
                const res = await signIn('credentials', {
                    redirect: false,
                    email: values.email,
                    password: values.password,
                });


                if (res.ok) {
                    await router.push('/dashboard')
                }
            } else {

                toast.error(response.message.email, {
                    autoClose: 5000,
                })
            }


            setSubmitting(false);
        },
    });


    const handleGoogleSignIn = async () => {
        const res = await signIn('google', {callbackUrl: "/dashboard"})
    }

    const handleAppleSignIn = async () => {
        const res = await signIn('apple', {callbackUrl: "/dashboard"})
    }

    return (
        <div className="bg-white mb-8">
            <nav className="mt-5 fixed z-50 lg:px-14 w-full">
                <div className="flex items-center justify-between px-4 py-2 rounded-full shadow-xl bg-white">
                    <Link
                        className="flex items-center justify-between py-2.375 text-sm mr-4 ml-4 font-bold lg:ml-0"
                        href="/">
                        <Image className="rounded-full mr-3"
                               src={logoIcon}
                               width={32}
                               height={32}
                               alt="Picture of the author"
                        />
                        stocks invoices receipts
                    </Link>
                    <Link
                        className="bg-orange-500 rounded-full px-8 py-2 text-white font-normal transition-all duration-250 ease-soft-in-out"
                        aria-current="page" href="/">
                        Sign In
                    </Link>
                </div>
            </nav>
            <main className="mt-0 transition-all duration-200 ease-soft-in-out">
                <section className="min-h-screen mb-32">
                    <div className=" p-2 ">
                        <div className=" bg-cover rounded-3xl"
                             style={{
                                 backgroundImage: `url(${bgImage.src})`,
                                 width: '100%',
                             }}
                        >
                            <div className="w-full z-10  pt-24 pb-56 rounded-3xl backdrop-brightness-50">
                                <div className="">
                                    <div
                                        className="w-full max-w-full px-3 mx-auto mt-0 text-center lg:flex-0 shrink-0 lg:w-5/12">
                                        <h1 className="mt-12 mb-2 text-white text-5xl font-bold">Welcome!</h1>
                                        <p className="text-white">Start creating professional invoices for your business, keep track of your receivables, product inventory and much more.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container">
                        <div className="flex flex-wrap -mx-3 -mt-48 md:-mt-56 lg:-mt-48">
                            <div
                                className="w-full max-w-full px-3 mx-auto mt-0 md:flex-0 shrink-0 md:w-7/12 lg:w-5/12 xl:w-4/12">
                                <div
                                    className="relative z-0 flex flex-col min-w-0 break-words bg-white border-0 shadow-lg rounded-2xl bg-clip-border">
                                    <div className="p-6 mb-0 text-center bg-white border-b-0 rounded-t-2xl">
                                        <h5>Register with</h5>
                                    </div>
                                    <div className="flex-auto px-6 pt-6">
                                        <form onSubmit={formik.handleSubmit}>
                                            <label
                                                className="mb-2 ml-1 font-bold text-xs text-slate-700">Full Name</label>
                                            <div className="mb-4">
                                                <input type="text" id= "fullname" className="focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:outline-none focus:transition-shadow" placeholder="Full  Name" value={formik.values.fullname} onChange={formik.handleChange}/>
                                                {formik.errors.fullname ?
                                                    <div className="text-red-600">{formik.errors.fullname}</div> : null}
                                            </div>
                                            <label
                                                className="mb-2 ml-1 font-bold text-xs text-slate-700">Email Address </label>
                                            <div className="mb-4">
                                                <input type="email" id= "email" className="focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:outline-none focus:transition-shadow" placeholder="Email Address" value={formik.values.email} onChange={formik.handleChange}/>
                                                {formik.errors.email ?
                                                    <div className="text-red-600">{formik.errors.email}</div> : null}
                                            </div>
                                            <label className="mb-2 ml-1 font-bold text-xs text-slate-700">Password</label>
                                            <div className="mb-4">
                                                <input type="password"  id= "password" className="focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:outline-none focus:transition-shadow" placeholder="Password" value={formik.values.password} onChange={formik.handleChange}/>
                                                {formik.errors.password ?
                                                    <div className="text-red-600">{formik.errors.password}</div> : null}
                                            </div>

                                            <div className="text-center">
                                                <PrimaryButton
                                                    type="submit"
                                                    className="w-full"
                                                >
                                                    {formik.isSubmitting ? 'Please wait...' : 'Sign Up'}
                                                </PrimaryButton>
                                            </div>

                                            <div
                                                className=" px-1 pt-0 bg-transparent border-t-0 border-t-solid rounded-b-2xl lg:px-2 mt-8">
                                                <p className="mx-auto mb-6 leading-normal text-sm">
                                                    Already have an account?
                                                    <Link href="/"
                                                          className="relative z-10 font-semibold text-c3 bg-clip-text underline"> Sign
                                                        in</Link>
                                                </p>
                                            </div>
                                        </form>
                                    </div>

                                    <span className="text-center">or</span>
                                    <div className="flex justify-center gap-10 my-8">
                                        <button
                                            className="bg-white border border-c5 rounded px-5 py-2 text-4xl text-black"
                                            onClick={handleGoogleSignIn}>
                                            <FcGoogle className="h-6 w-6"/>
                                        </button>
                                        <button
                                            className="bg-white border border-c5 rounded px-5 py-2 text-4xl text-black"
                                            onClick={handleAppleSignIn}>
                                            <FaApple className="h-6 w-6"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export async function getServerSideProps(perms) {
    const session = await getSession(perms)

    if (session) {
        return {redirect: {destination: '/dashboard', permanent: false,},}
    }

    return {props: session || {}}
}