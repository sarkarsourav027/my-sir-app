export const TableCell = ({children, className, customTheme = {}, ...props}) => {
    return (
        <td className={`${className} group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg px-6 py-4`} {...props}>
            {children}
        </td>
    );
};