import * as H from 'history';
import moment, { Moment } from 'moment';
import { TablePaginationConfig } from "antd/lib/table/interface";
import { Modal } from 'antd';

import { ApiParams } from "../model/ui/types/ApiParams";
import { DataGridCellTypeMap, DataGridColumnType, DataGridFiltersType, DataGridParamsType, DataIndex, SorterResult } from "../model/ui/types/DataGridTypes";
import { DataGridCellTypeEnum } from "../model/ui/enums/DataGridCellTypeEnum";
import { UserPermissionEnum } from '../model/domain/enums/UserPermissionEnum';

const { info } = Modal;

export const DefaultDateTimeFormat = 'DD/MM/YYYY HH:mm:ss';
export const DefaultDateFormat = 'DD/MM/YYYY';
export const DefaultTimeFormat = 'HH:mm';
export const RangePickerFormat = DefaultDateTimeFormat; //'YYYY-MM-DD HH:mm:ss';
export const StandardFormat = 'YYYY-MM-DD';

export const defaultPaginationSort = (pageSize: number = 20, sortField: DataIndex = 'createdDate', sortOrder: 'descend' | 'ascend' = 'descend'): DataGridParamsType<any> => ({
    pagination: {
        pageSize,
        current: 1
    },
    sorter: {
        field: sortField,
        order: sortOrder
    },
    filters: null,
    columns: {}
})

export function backLink(link: string, steps: number = 1): string {
    let paths = link.split('/');
    paths.splice(paths.length - steps, steps);
    return paths.join('/')
}

export function goBack(history: H.History<unknown>, link: string, steps: number = 1): void {
    history.replace(backLink(link, steps))
}

export function updateDataGridParams<T>(
    pagination: TablePaginationConfig,
    filters: DataGridFiltersType,
    sorter: SorterResult<T> | SorterResult<T>[],
    columns: Array<DataGridColumnType<T>>): DataGridParamsType<T> {
    let cols: DataGridCellTypeMap<T> = {};
    for (let field in filters) {
        let column = columns.find((col) => getDotIndex(col.dataIndex) === field);
        cols[field] = column;
    }

    return {
        pagination: {
            ...pagination,
            current: !pagination.current ? 1 : pagination.current
        },
        filters: filters,
        sorter: sorter,
        columns: cols
    }
}

export function getApiParams<T>(dgpt?: DataGridParamsType<T>) {
    const params: ApiParams = {};
    if (!dgpt) return params;
    for (let field in dgpt.filters) {
        if (dgpt.filters[field]) {
            let predicate = 'contains';
            let filterValue = dgpt.filters[field]![0];
            if (dgpt.columns[field]) {
                if (dgpt.columns[field]?.cellType === DataGridCellTypeEnum.OPTION || dgpt.columns[field]?.cellType === DataGridCellTypeEnum.MULTIOPTION) {
                    predicate = 'in';
                    filterValue = dgpt.filters[field]!.join(',');
                }
                else if (dgpt.columns[field]?.cellType === DataGridCellTypeEnum.CHECKBOX) {
                    predicate = 'equals';
                }
                else if (dgpt.columns[field]?.cellType === DataGridCellTypeEnum.DATE)
                    predicate = 'range';
            }
            const filterIndex = (dgpt.columns[field]?.filterIndex || field) as string;
            const param = getFilterIndex(getDotIndex(filterIndex));
            params[`${param}.${predicate}`] = filterValue;
        }
    }
    if (dgpt.pagination) {
        params.page = (dgpt.pagination.current || 0) - 1;
        params.size = dgpt.pagination.pageSize;
    }
    const sorter = dgpt.sorter as SorterResult<T>;
    if (sorter && sorter.field && sorter.order) {
        let sortField = sorter.column?.sortIndex ? sorter.column?.sortIndex : sorter.field;
        params.sort = `${getFilterIndex(getDotIndex(sortField))},${sorter.order === 'ascend' ? 'asc' : 'desc'}`;
    }

    return params;
}

export function getDotIndex(dataIndex: DataIndex = "") {
    return Array.isArray(dataIndex) ? dataIndex.join('.') : dataIndex as (string | number);
}

export function getFilterIndex(dataIndex: DataIndex) {
    if (typeof dataIndex === 'string') {
        let paths = dataIndex.split('.');
        paths = paths.map((path, index) => {
            if (index > 0)
                return path.charAt(0).toUpperCase() + path.slice(1);
            return path;
        })
        return paths.join('');
    }
    return dataIndex
}

export const getValue = (record: AnyRecord, path?: DataIndex) => {
    let value: any = record;
    let last;
    if (Array.isArray(path) && path) {
        let arrayPath = [...path];
        while (arrayPath && arrayPath.length) {
            last = arrayPath.shift();
            value = value && last ? value[last] : undefined;
        }
    }
    else {
        value = value && path ? value[path as (string | number)] : undefined;
    }
    return value;
}

export const isStringOrNumber = (variable?: DataIndex) => {
    return typeof variable === 'number' || typeof variable === 'string';
}

export const setTimeOnDate = (date?: string, time?: Moment | null): Moment => {
    const mDate = moment(date);
    mDate.set({
        hour: time?.hour() || 0,
        minute: time?.minute() || 0,
        second: time?.second() || 0
    })

    return mDate;
}

export const isDataIndexEqual = (obj1?: DataIndex, obj2?: DataIndex) => {
    return getDotIndex(obj1) === getDotIndex(obj2)
}

export const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
}

export const checkPermission = (permission: UserPermissionEnum, permissions: Array<UserPermissionEnum> = []) => {
    return permissions.findIndex(perm => perm === permission) > -1;
}

export const comingSoonModal = () => {
    info({
        title: 'Coming soon',
        content: 'Action currently under development.'
    })
}
