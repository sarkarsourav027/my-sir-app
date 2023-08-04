import {TableHead} from "@/components/Tables/TableHead";
import {TableBody} from "@/components/Tables/TableBody";
import {TableRow} from "@/components/Tables/TableRow";
import {TableCell} from "@/components/Tables/TableCell";
import {TableHeadCell} from "@/components/Tables/TableHeadCell";
import {TableContext} from "@/context/TableContext";

const TableComponent = ({children, className, hoverable, striped, customTheme = {}, ...props}) => {
    return (
        <div data-testid="table-element" className="relative">
            <TableContext.Provider value={{striped, hoverable}}>
                <div
                    className={`${className} absolute bg-white dark:bg-black w-full h-full top-0 left-0 rounded-lg drop-shadow-md -z-10`}></div>
                <table className={`${className} w-full text-left text-sm text-gray-500 dark:text-gray-400`} {...props}>
                    {children}
                </table>
            </TableContext.Provider>
        </div>
    );
};

TableComponent.displayName = 'Table';
TableHead.displayName = 'Table.Head';
TableBody.displayName = 'Table.Body';
TableRow.displayName = 'Table.Row';
TableCell.displayName = 'Table.Cell';
TableHeadCell.displayName = 'Table.HeadCell';

export const Table = Object.assign(TableComponent, {
    Head: TableHead,
    Body: TableBody,
    Row: TableRow,
    Cell: TableCell,
    HeadCell: TableHeadCell,
});