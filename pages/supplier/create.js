import AppLayout from "@/components/Layouts/AppLayout";
import React from "react";
import Link from "next/link";
import {ErrorMessage, Field, Form, Formik} from "formik";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import Input from "@/components/InputFields/Input";
import {getSession} from "next-auth/react";

export default function Supplier() {
    const [openTab, setOpenTab] = React.useState(1);
    return (
        <AppLayout>
            <div className="flex flex-wrap relative">
                <div className="w-full">
                    <ul
                        className="flex flex-col lg:flex-row lg:border-b-2 lg:border-c6 top-3 lg:top-0 sticky z-50 bg-white w-full"
                        role="tablist"
                    >
                        <li className="text-center">
                            <Link
                                className={
                                    "lg:w-72 text-base font-bold px-5 py-5 block leading-normal " +
                                    (openTab === 1
                                        ? "text-c3 rounded lg:rounded-0 lg:border-b-2 lg:border-c3 bg-white shadow-01xl lg:shadow-none border-2 lg:border-0"
                                        : "text-c5 ")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(1);
                                }}
                                data-toggle="tab"
                                href="#link1"
                                role="tablist"
                            >
                                Add Suppliers
                            </Link>
                        </li>
                        <li className="text-center">
                            <Link
                                className={
                                    "lg:w-72 text-base font-bold px-5 py-5 block leading-normal " +
                                    (openTab === 2
                                        ? "text-c3 rounded lg:rounded-0 lg:border-b-2 lg:border-c3 bg-white shadow-01xl lg:shadow-none border-2 lg:border-0"
                                        : "text-c5 ")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(2);
                                }}
                                data-toggle="tab"
                                href="#link2"
                                role="tablist"
                            >
                                Suppliers
                            </Link>
                        </li>

                    </ul>
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded">
                        <div className="flex-auto">
                            <div className="tab-content tab-space">
                                <Formik
                                    initialValues={{email: '', password: ''}}
                                    validate={values => {
                                        const errors = {};
                                        if (!values.email) {
                                            errors.email = 'Required';
                                        } else if (
                                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                                        ) {
                                            errors.email = 'Invalid email address';
                                        }
                                        return errors;
                                    }}
                                    onSubmit={(values, {setSubmitting}) => {
                                        setTimeout(() => {
                                            alert(JSON.stringify(values, null, 2));
                                            setSubmitting(false);
                                        }, 400);
                                    }}
                                >
                                    {({isSubmitting}) => (
                                        <Form>
                                            <Input type="email" name="email"/>
                                            <ErrorMessage name="email" component="div"/>
                                            <Input type="password" name="password"/>
                                            <ErrorMessage name="password" component="div"/>
                                            <PrimaryButton type="submit" disabled={isSubmitting}>
                                                Submit
                                            </PrimaryButton>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </AppLayout>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)

    if (!session) {
        return {redirect: {destination: '/', permanent: false,}}
    }

    return {props: {}};
}