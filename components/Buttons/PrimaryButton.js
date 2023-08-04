const PrimaryButton = ({ type = 'button', className, ...props }) => (
    <button
        type={type}
        className={`flex sm:inline-flex justify-center items-center bg-gradient-to-tr from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 active:from-orange-700 active:to-orange-600 focus-visible:ring ring-pink-300 text-white text-center rounded-full outline-none transition duration-100 px-16 py-3 ${className} `}
        {...props}
    />
)

export default PrimaryButton