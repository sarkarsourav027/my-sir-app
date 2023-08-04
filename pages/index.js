import {useRouter} from "next/router";
import {useFormik} from "formik";
import {getSession, signIn} from "next-auth/react";
import Label from "@/components/InputFields/Label";
import Input from "@/components/InputFields/Input";
import Link from "next/link";
import {FcGoogle} from "react-icons/fc";
import {FaApple} from "react-icons/fa";
import Image from "next/image";
import bannerSignIn from "@/public/assets/img/sing-in.png";
import {toast} from "react-toastify";
import logoIcon from "@/public/assets/img/logo.jpeg";
import * as Yup from "yup";
import PrimaryButton from "@/components/Buttons/PrimaryButton";

export default function Home() {

    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object().shape({
            password: Yup.string()
                .min(6, 'We have minimum 6 characters required')
                .max(50, 'Too Long!')
                .required('Required'),
            email: Yup.string()
                .email()
                .matches(/^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i, 'Invalid email')
                .required('Required'),
        }),
        onSubmit: async (values, {setSubmitting}) => {
            const response = await signIn('credentials', {
                redirect: false,
                email: values.email,
                password: values.password,
                callbackUrl: `${window.location.origin}`,
            });

            console.log(response)

            if (response.ok) {
                await router.push('/dashboard')
            } else {
                toast.error(response.error)
            }

            // if (res.url) await router.push(res.url);
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
                        aria-current="page" href="/sign-up">
                        Sign Up
                    </Link>
                </div>
            </nav>
            <main className="mt-0 lg:mx-14">
                <div className="relative flex items-center p-0 overflow-hidden bg-center bg-cover min-h-75-screen">
                    <div className="container z-10">
                        <div className="flex flex-wrap mt-0 -mx-3">
                            <div className="flex flex-col px-3 mx-auto md:flex-0 shrink-0 md:w-2/4 lg:w-2/4 xl:w-2/4">
                                <div className="flex flex-col mt-28 break-words bg-clip-border">
                                    <div className="p-6 pb-0 mb-0 bg-transparent border-b-0 rounded-t-2xl">
                                        <h3 className="relative z-10 font-bold text-c3 bg-clip-text text-3xl mb-4">
                                            Welcome back
                                        </h3>
                                        <p className="mb-0 text-gray-400">Enter your email and password to sign in</p>
                                    </div>
                                    <div className="flex-auto p-6">
                                        <form onSubmit={formik.handleSubmit}>
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

                                                <button type="submit"
                                                        className="inline-block w-full px-6 py-3 mt-6 mb-0 font-bold text-center text-white uppercase align-middle transition-allbg-gradient-to-tr from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 active:from-orange-700 active:to-orange-600 focus-visible:ring ring-pink-300 rounded-md outline-none transition duration-100 shadow-soft-md bg-x-25 bg-150 leading-pro text-xs ease-soft-in tracking-tight-soft bg-gradient-to-tl from-c1 to-c2 hover:scale-102 hover:shadow-soft-xs active:opacity-85">{formik.isSubmitting ? 'Please wait...' : 'Sign In'}
                                                </button>

                                            </div>
                                        </form>
                                        <div className="mt-4 text-center flex justify-between">
                                            <Link href="/forgot-password"
                                                  className="relative z-10 text-c3 bg-clip-text underline"> Forgot
                                                password</Link>
                                            <p className="leading-normal text-sm">
                                                Dont have an account?
                                                <Link href="/sign-up"
                                                      className="relative z-10 font-semibold text-c3 bg-clip-text underline"> Sign
                                                    up</Link>
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-center">or</span>
                                    <div className="flex justify-center gap-10 mt-3">
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
                            <div className="w-full max-w-full px-3 md:w-6/12 mt-28 flex items-center justify-end">
                                <Image
                                    src={bannerSignIn}
                                    width={530}
                                    height={408}
                                    alt="Picture of the author"
                                />
                            </div>
                        </div>
                    </div>
                </div>
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
