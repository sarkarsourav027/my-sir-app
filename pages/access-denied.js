import AppLayout from "@/components/Layouts/AppLayout";
import {useSession} from "next-auth/react";

export default function Dashboard() {

    const {data: session} = useSession()

    return (
        <AppLayout session={session}>
            <div className="p-8 bg-white rounded-md">
                <p>
                    You are not authorized to visit this page
                </p>
            </div>
        </AppLayout>
    )
}