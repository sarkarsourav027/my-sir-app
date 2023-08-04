export const TableBody = ({children, className, customTheme = {}, ...props}) => {
    return (
        <tbody className={`${className} group/body`} {...props}>
        {children}
        </tbody>
    );
};