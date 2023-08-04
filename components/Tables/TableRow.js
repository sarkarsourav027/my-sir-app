export const TableRow = ({children, className, customTheme = {}, ...props}) => {
    return (
        <tr
            data-testid="table-row-element"
            className={`${className} group/row odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700`}
            {...props}
        >
            {children}
        </tr>
    );
};