import '@/styles/globals.css'

import {SessionProvider} from "next-auth/react";
import NextNProgress from 'nextjs-progressbar';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import {BusinessProvider, DashboardProvider} from "@/context/BusinessContext";
import {ProductAddProvider} from "@/context/ProductAddContext";

export default function App({Component, pageProps: {session, ...pageProps},}) {
    return (
        <SessionProvider session={session}>
            <NextNProgress color="#EC8A23"/>
            <ToastContainer/>
            <BusinessProvider>
            <DashboardProvider>

                <Component {...pageProps} />

            </DashboardProvider>
            </BusinessProvider>
        </SessionProvider>
    )
}