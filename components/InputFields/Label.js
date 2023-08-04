const Label = ({ className, children, ...props }) => (
    <label
        className={`${className} mb-2 ml-1 font-bold text-xs text-slate-700`}
        {...props}>
        {children}
    </label>
)

export default Label