import Link from "next/link";
import {useState} from "react";
import Image from 'next/image';
import bannerSignIn from "@/public/assets/img/sing-in.png";
import ForgotPasswordEmailFrom from "@/components/Forms/ForgotPasswordEmailFrom";
import ForgotPasswordOtpFrom from "@/components/Forms/ForgotPasswordOtpFrom";
import ForgotPasswordPasswordFrom from "@/components/Forms/ForgotPasswordPasswordFrom";
import {FormProvider} from "@/context/FormProvider";
import logoIcon from "@/public/assets/img/logo.jpeg";

export default function SignIn() {

    const [formStep, setFormStep] = useState(0);

    const nextFormStep = () => setFormStep((currentStep) => currentStep + 1);

    const prevFormStep = () => setFormStep((currentStep) => currentStep - 1);

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
                        Stocks invoices receipts
                    </Link>
                    <Link
                        className="bg-orange-500 rounded-full px-8 py-2 text-white font-normal transition-all duration-250 ease-soft-in-out"
                        href="/"
                    >
                        Sign In
                    </Link>
                </div>
            </nav>
            <main className="mt-0 lg:mx-14">
                <div className="relative flex items-center p-0 overflow-hidden bg-center bg-cover min-h-75-screen">
                    <div className="container z-10">
                        <div className="flex flex-wrap mt-0 -mx-3">
                            <div className="flex flex-col px-3 mx-auto md:flex-0 shrink-0 md:w-2/4 lg:w-2/4 xl:w-2/4">
                                <div className="flex flex-col mt-28 break-words bg-clip-border">
                                    <div className="flex-auto p-6">
                                        <FormProvider>
                                            {formStep >= 0 && (
                                                <ForgotPasswordEmailFrom formStep={formStep} nextFormStep={nextFormStep}/>
                                            )}

                                            {formStep >= 1 && (
                                                <ForgotPasswordOtpFrom formStep={formStep} nextFormStep={nextFormStep}/>
                                            )}

                                            {formStep >= 2 && (
                                                <ForgotPasswordPasswordFrom formStep={formStep} nextFormStep={nextFormStep}/>
                                            )}
                                        </FormProvider>
                                    </div>
                                    <div
                                        className="px-1 pt-0 text-center bg-transparent border-t-0 border-t-solid rounded-b-2xl ">
                                        <p className="leading-normal text-sm">
                                            Dont have an account?
                                            <Link href="/sign-up"
                                                  className="relative z-10 font-semibold text-c3 bg-clip-text underline"> Sign
                                                up</Link>
                                        </p>
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