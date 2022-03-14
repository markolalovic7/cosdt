import { Rule } from "antd/lib/form";
import { NamePath } from "antd/lib/form/interface";
import { ColumnType, TablePaginationConfig } from "antd/lib/table";
import { SorterResult as AntdSorterResult } from "antd/lib/table/interface";
import { DataGridCellProps } from "../../../shared/components/datagrid/cells/DataGridCell";
import { DataGridCellTypeEnum } from "../enums/DataGridCellTypeEnum";

export type DataIndex = string | number | readonly (string | number)[];

/** Custom DataGridColumn properties */
export interface DataGridColumnType<T> extends ColumnType<T> {
    /**
     * If enabled, UI sort function is generated automatically, no need to write custom antd sorter.
     * Do not use if data is sorted on API calls.
     */
    defaultSort?: boolean;
    /**
     * Set DataIndex that will be used for sorting. If not provided dataIndex is used
     */
    sortIndex?: DataIndex;
    /**
     * Set DataIndex that will be used for filtering. If not provided dataIndex is used.
     */
    filterIndex?: DataIndex;
    /**
     * List of other values that current value depends on
     */
    dependencies?: NamePath[];
    /**
     * If enabled, search box is automatically added for each column
     */
    filterEnabled?: boolean;
    /** Set if column is resizable. If true, width must be set also */
    resizable?: boolean;
    /** Set if column cells are editable */
    editable?: boolean;
    /** If cells are editable, this prop describes what data is in the cell
     * and what sort of input and search box should be displayed (drop box, checkbox, textbox, datepicker etc)
     */
    cellType?: DataGridCellTypeEnum;
    /** If cell type is OPTION, you need to define predefined list of options for dropdown*/
    options?: DataGridCellOptionsType;
    /**
     * AntD form rules that will be applied to editable cell. Check antd documentation.
     */
    rules?: Array<Rule>;
    /**
     * Contains base url for the detailed view. If set, cell will contain link to single view for entity.
     */
    link?: DataGridCellLinkType<T>;
    /**
     * Configuration for date field
     * pickerType: 'month', 'year', 'date'
     * dateFormat: string
     */
    date?: DataGridCellDateType;
    /**
     * Set component that will render instead of cell component based on type
     */
    component?: React.FC<DataGridCellProps<T>>;
}


export type DataGridCellLinkType<T> = {
    url: ((record: T) => string) | string;
    target?: 'push' | 'replace';
    external?: boolean;
}

export type DataGridCellOptionsType = {
    valueIndex: string;
    nameIndex: string;
    values: Array<any>;
    filter?(val: any, depId?: number): boolean;
}

export type DataGridCellDateType = {
    inputFormat?: string;
    format?: string;
    pickerType?: any;
}

export interface DataGridParamsType<T> {
    pagination: TablePaginationConfig;
    filters: DataGridFiltersType;
    sorter: SorterResult<T> | SorterResult<T>[] | null;
    columns: DataGridCellTypeMap<T>;
}
//Record<string, CheckboxValueType[] | null> | null;
export type DataGridFiltersType = Record<string, (string | number | boolean)[] | null> | null;
export interface SorterResult<RecordType> extends AntdSorterResult<RecordType> {
    column?: DataGridColumnType<RecordType>;
}
export type DataGridCellTypeMap<T> = { [x: string]: DataGridColumnType<T> | undefined }

export type DataGridExpandRecords<T> = { [x: number]: Array<T> };

export interface DataGridSelectionItem<T> {
    key: string;
    text: React.ReactNode;
    onSelect(): Array<T>;
}
