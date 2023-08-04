import Link from "next/link";

const SecondaryLinkButton = ({ className, ...props }) => (
    <Link
        className={`${className} flex sm:inline-flex justify-center items-center bg-gradient-to-tr from-blue-950 to-blue-950 hover:from-blue-900 hover:to-blue-900 active:from-blue-700 active:to-blue-600 focus-visible:ring ring-blue-300 text-white text-center rounded-md outline-none transition duration-100 px-5 py-2`}
        {...props}
    />
)

export default SecondaryLinkButton