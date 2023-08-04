export const TableHead = ({ children, className, customTheme = {}, ...props }) => {
    return (
        <thead className={`${className} group/head text-xs uppercase text-gray-700 dark:text-gray-400`} {...props}>
        <tr>{children}</tr>
        </thead>
    );
};