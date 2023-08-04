const Input = ({disabled = false, className = '', ...props}) => (
    <input
        type="color"
        disabled={disabled}
        className={`${className} `}
        {...props}
    />
)

export default Input