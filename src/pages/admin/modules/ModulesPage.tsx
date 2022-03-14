import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { TablePaginationConfig } from "antd/lib/table";

import { api } from "../../../core/api";
import { Logger } from "../../../core/logger";
import {
  defaultPaginationSort,
  updateDataGridParams,
} from "../../../core/Utils";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult,
} from "../../../model/ui/types/DataGridTypes";
import { FetchStateEnum } from "../../../model/ui/enums/FetchStateEnum";
import { DataGridCellTypeEnum } from "../../../model/ui/enums/DataGridCellTypeEnum";
import DataGridComponent from "../../../shared/components/datagrid/DataGrid";
import DataGridActionsComponent from "../../../shared/components/datagrid/DataGridActions";
import DataGridRowActionsComponent from "../../../shared/components/datagrid/DataGridRowActions";
import {
  FailNotification,
  SuccessNotification,
} from "../../../shared/components/notifications/Notification";
import { ClassModule } from "../../../model/domain/classes/ClassModule";

function ModulesPage() {
  const [records, setRecords] = useState<Array<ClassModule>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<ClassModule>>(
    defaultPaginationSort()
  );
  let { path, isExact } = useRouteMatch();
  let history = useHistory();
  const sorter = params.sorter as SorterResult<ClassModule> | null;

  const columns: Array<DataGridColumnType<ClassModule>> = [
    {
      title: "Name",
      dataIndex: "name",
      editable: true,
      defaultSort: true,
      resizable: true,
      width: 200,
      fixed: "left",
      filterEnabled: true,
      link: {
        url: (record) => `${path}/${record.id}`,
      },
      rules: [
        {
          required: true,
          message: `Enter a name.`,
        },
      ],
    },
    {
      title: "Description",
      dataIndex: "description",
      defaultSort: true,
      resizable: true,
      editable: true,
      width: 250,
      cellType: DataGridCellTypeEnum.TEXT,
      filterEnabled: true,
    },
    {
      title: "Created",
      dataIndex: "createdDate",
      defaultSort: true,
      resizable: true,
      width: 160,
      cellType: DataGridCellTypeEnum.DATE,
      filterEnabled: true,
    },
    {
      title: "Modified",
      dataIndex: "lastModifiedDate",
      defaultSort: true,
      resizable: true,
      width: 160,
      cellType: DataGridCellTypeEnum.DATE,
      filterEnabled: true,
    },
  ];

  useEffect(() => {
    isExact && loadData();
  }, [isExact]);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let records = await api.classModule.getAll();
      setRecords(records);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleCreate() {
    history.replace(`${path}/new`);
  }

  async function handleUpdate(record: ClassModule): Promise<void> {
    try {
      setLoading(FetchStateEnum.LOADING);
      let data = [...records];
      let response = await api.classModule.update(record);
      const recordIndex = data.findIndex((rec) => rec.id === record.id);
      if (recordIndex > -1) {
        data[recordIndex] = response;
        setRecords(data);
      }
      SuccessNotification("Module changed.");
    } catch (error) {
      FailNotification("Saving data error.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleDelete(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.classModule.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Module deleted.");
    } catch (error) {
      FailNotification("Deleting error.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleDeleteSelected(ids: Array<number>) {
    setLoading(FetchStateEnum.LOADING);
    let data = [...records];
    for (const id of ids) {
      const recordIndex = data.findIndex((rec) => rec.id === id);
      try {
        await api.classModule.delete(id);
        data.splice(recordIndex, 1);
      } catch (error) {
        FailNotification(`Deleting error ${data[recordIndex]?.name}.`);
        Logger.error(error);
      }
    }
    setRecords(data);
    setLoading(FetchStateEnum.LOADED);
  }

  function handleChange(
    pagination: TablePaginationConfig,
    filters: DataGridFiltersType,
    sorter: SorterResult<ClassModule> | SorterResult<ClassModule>[]
  ) {
    setParams(
      updateDataGridParams<ClassModule>(pagination, filters, sorter, columns)
    );
  }

  return (
    <React.Fragment>
      <h1>Class Modules</h1>
      <DataGridComponent<ClassModule>
        bordered
        columns={columns}
        rowKey={(rec) => rec.id}
        dataSource={records}
        selectable={true}
        loading={loading === FetchStateEnum.LOADING}
        onChange={handleChange}
        scroll={{ x: true }}
        filters={params.filters}
        sort={sorter}
        pagination={params.pagination}
        Actions={
          <DataGridActionsComponent
            onCreate={handleCreate}
            onDeleteSelected={handleDeleteSelected}
          />
        }
        RowActions={
          <DataGridRowActionsComponent
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        }
      />
    </React.Fragment>
  );
}

export default ModulesPage;
