import React, { useState } from "react";
import { TablePaginationConfig } from "antd/lib/table";

import { defaultPaginationSort, updateDataGridParams } from "../../../../../core/Utils";

import { DataGridCellTypeEnum } from "../../../../../model/ui/enums/DataGridCellTypeEnum";
import { FetchStateEnum } from "../../../../../model/ui/enums/FetchStateEnum";
import { ClassLectureDiary } from "../../../../../model/domain/classes/ClassLectureDiary";
import { DataGridColumnType, DataGridFiltersType, DataGridParamsType, SorterResult } from "../../../../../model/ui/types/DataGridTypes";

import DataGridComponent from "../../../../../shared/components/datagrid/DataGrid";
import DataGridRowActionsComponent from "../../../../../shared/components/datagrid/DataGridRowActions";

interface DiaryAllProps {
    records: Array<ClassLectureDiary>;
    setRecords(records: Array<ClassLectureDiary>): void;
    loading: FetchStateEnum;
}

function DiaryAllTab({ records, setRecords, loading }: DiaryAllProps) {
    const [params, setParams] = useState<DataGridParamsType<ClassLectureDiary>>(
        defaultPaginationSort()
    );
    const sorter = params.sorter as SorterResult<ClassLectureDiary> | null;

    const columns: Array<DataGridColumnType<ClassLectureDiary>> = [
        {
            title: "Ime",
            dataIndex: "firstName",
            defaultSort: true,
            filterEnabled: true,
            fixed: "left",
            width: 150,
        },
        {
            title: "Prezime",
            dataIndex: "lastName",
            defaultSort: true,
            filterEnabled: true,
            fixed: "left",
            width: 150,
        },
        {
            title: "Prisutan",
            dataIndex: "prisutan",
            editable: true,
            defaultSort: true,
            filterEnabled: true,
            cellType: DataGridCellTypeEnum.CHECKBOX,
            width: 150,
        },
        {
            title: "Metodologija",
            dataIndex: "metodologija",
            editable: true,
            cellType: DataGridCellTypeEnum.TEXTAREA,
            width: 250,
        },
        {
            title: "Motivisanost",
            dataIndex: "motivisanost",
            editable: true,
            cellType: DataGridCellTypeEnum.TEXTAREA,
            width: 250,
        },
        {
            title: "Napomena",
            dataIndex: "napomena",
            editable: true,
            cellType: DataGridCellTypeEnum.TEXTAREA,
            width: 250,
        },
        {
            title: "Nastavni materijal",
            dataIndex: "nastavniMaterijal",
            editable: true,
            cellType: DataGridCellTypeEnum.TEXTAREA,
            width: 250,
        },
        {
            title: "Obrazlozenje",
            dataIndex: "obrazlozenje",
            editable: true,
            cellType: DataGridCellTypeEnum.TEXTAREA,
            width: 250,
        },
        {
            title: "Ocjena",
            dataIndex: "ocjena",
            editable: true,
            cellType: DataGridCellTypeEnum.TEXTAREA,
            width: 250,
        },
        {
            title: "Pokazano znanje (oblast)",
            dataIndex: "pokazanoZnanjeIzOblasti",
            editable: true,
            cellType: DataGridCellTypeEnum.TEXTAREA,
            width: 250,
        },
        {
            title: "Razumijevanje uloge",
            dataIndex: "razumijevanjeUloge",
            editable: true,
            cellType: DataGridCellTypeEnum.TEXTAREA,
            width: 250,
        },
        {
            title: "Sposobnost logickog zakljucivanja",
            dataIndex: "sposobnostLogZakljucivanja",
            editable: true,
            cellType: DataGridCellTypeEnum.TEXTAREA,
            width: 250,
        },
        {
            title: "Ukljucivanje u diskusiju",
            dataIndex: "ukljucivanjeUdiskusiju",
            editable: true,
            cellType: DataGridCellTypeEnum.TEXTAREA,
            width: 250,
        },
    ];

    async function handleUpdate(record: ClassLectureDiary): Promise<void> {
        let data = [...records];
        const recordIndex = data.findIndex((rec) => rec.id === record.id);
        data[recordIndex] = {
            ...data[recordIndex],
            ...record,
        };
        setRecords(data);
    }

    function handleChange(
        pagination: TablePaginationConfig,
        filters: DataGridFiltersType,
        sorter: SorterResult<ClassLectureDiary> | SorterResult<ClassLectureDiary>[]
    ) {
        setParams(
            updateDataGridParams<ClassLectureDiary>(pagination, filters, sorter, columns)
        );
    }

    return (
        <DataGridComponent<ClassLectureDiary>
            bordered
            columns={columns}
            rowKey={(rec) => rec.id}
            dataSource={records}
            selectable={false}
            loading={loading === FetchStateEnum.LOADING}
            onChange={handleChange}
            filters={params.filters}
            sort={sorter}
            pagination={false}
            actionsColumn={{
                fixed: "right",
                width: 100
            }}
            scroll={{ x: 1500 }}
            RowActions={
                <DataGridRowActionsComponent
                    onUpdate={handleUpdate}
                />
            }
        />
    );
}

export default DiaryAllTab;
