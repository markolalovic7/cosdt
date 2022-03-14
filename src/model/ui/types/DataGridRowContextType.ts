import { createContext } from "react";

export type DataGridRowContextType<T> = {
    /** Record that is being edited - used by row action component */
    record: T;
}

export const DataGridRowContext = createContext<any>({});