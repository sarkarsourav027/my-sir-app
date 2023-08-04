export const TableHeadCell = ({ children, className, customTheme = {}, ...props }) => {
    return (
        <th className={`${className} group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg bg-gray-50 dark:bg-gray-700 px-6 py-3`} {...props}>
            {children}
        </th>
    );
};