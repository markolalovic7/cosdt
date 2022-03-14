import { createContext } from "react";
import { FormInstance } from "antd/lib/form";
import { DataGridFiltersType } from "./DataGridTypes";

export type DataGridContextType<T> = {
    /** Form that wraps single row */
    form: FormInstance<any>;
    /** Id of the record being edited */
    editingId?: number;
    /** setter of the record id that is being edited */
    setEditingId(id?: number): void,
    /** True if row is dirty (modified) */
    isDirty: boolean;
    /** Set is dirty row flag */
    setIsDirty(isDirty: boolean): void;
    /** True if row contains columns that are editable */
    editable: boolean;
    /** True if rows are editable inline  */
    inlineEdit: boolean;
    /** Records that are selected */
    selection: Array<T>;
    /** Set ids of selected records*/
    setSelection(records: Array<T>): void;
    /** Filter  */
    filters: DataGridFiltersType;
    /** Filter reset  */
    onResetAllFilters(filters: any): void;

}

export const DataGridContext = createContext<any>({});