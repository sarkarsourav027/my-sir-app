import React from 'react';
import Link from "next/link";
import {useRouter} from "next/router";

function PillNavigation({lists = [], ...props}) {
    const router = useRouter();
    const routeName = router.pathname;

    return (
        <ul className="flex flex-row border-b border-c6 top-3 lg:top-0 z-50 bg-white w-full ">
            {
                lists.map((item, index) => {
                    return (
                        <li className="text-center" key={index}>
                            <Link
                                className={`lg:w-60 text-base font-bold px-5 py-4 block text-gray-500 ${item.link === routeName ? 'border-b-2 border-blue-950 bg-white text-blue-950 ' : ''}`}
                                href={item.link}>
                                {item.label}
                            </Link>
                        </li>
                    )
                })
            }
        </ul>
    );
}

export default PillNavigation;