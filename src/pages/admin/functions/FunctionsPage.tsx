import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { TablePaginationConfig } from "antd/lib/table";

import { api } from "../../../core/api";
import { Logger } from "../../../core/logger";
import { ProfileFunction } from "../../../model/domain/classes/ProfileFunction";
import { FetchStateEnum } from "../../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult,
} from "../../../model/ui/types/DataGridTypes";
import { DataGridCellTypeEnum } from "../../../model/ui/enums/DataGridCellTypeEnum";
import DataGridComponent from "../../../shared/components/datagrid/DataGrid";
import DataGridActionsComponent from "../../../shared/components/datagrid/DataGridActions";
import DataGridRowActionsComponent from "../../../shared/components/datagrid/DataGridRowActions";
import {
  FailNotification,
  SuccessNotification,
} from "../../../shared/components/notifications/Notification";
import {
  defaultPaginationSort,
  updateDataGridParams,
} from "../../../core/Utils";

function FunctionsPage() {
  const [records, setRecords] = useState<Array<ProfileFunction>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<ProfileFunction>>(
    defaultPaginationSort()
  );
  let { path, isExact } = useRouteMatch();
  let history = useHistory();
  const sorter = params.sorter as SorterResult<ProfileFunction> | null;

  const columns: Array<DataGridColumnType<ProfileFunction>> = [
    {
      title: "Name male",
      dataIndex: "name",
      editable: true,
      defaultSort: true,
      resizable: true,
      width: 200,
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
      title: "Name female",
      dataIndex: "namef",
      editable: true,
      defaultSort: true,
      resizable: true,
      width: 200,
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
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      resizable: true,
      width: 200,
    },
    {
      title: "Created",
      dataIndex: "createdDate",
      editable: false,
      defaultSort: true,
      resizable: true,
      width: 200,
      cellType: DataGridCellTypeEnum.DATE,
    },
  ];

  useEffect(() => {
    isExact && loadData();
  }, [isExact]);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let records = await api.profileFunction.getAll();
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

  async function handleUpdate(record: ProfileFunction): Promise<void> {
    try {
      setLoading(FetchStateEnum.LOADING);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === record.id);
      const updatedRecord: ProfileFunction = {
        ...data[recordIndex],
        ...record,
      };
      let response = await api.profileFunction.update(updatedRecord);
      data[recordIndex] = response;
      setRecords(data);
      SuccessNotification("Funkcija changed.");
    } catch (error) {
      FailNotification("Saving data error funkcije.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleDelete(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.profileFunction.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Funkcija deleted.");
    } catch (error) {
      FailNotification("Deleting error funkcije.");
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
        await api.profileFunction.delete(id);
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
    sorter: SorterResult<ProfileFunction> | SorterResult<ProfileFunction>[]
  ) {
    setParams(
      updateDataGridParams<ProfileFunction>(
        pagination,
        filters,
        sorter,
        columns
      )
    );
  }

  return (
    <React.Fragment>
      <h1>Function</h1>
      <DataGridComponent<ProfileFunction>
        bordered
        columns={columns}
        rowKey={(rec) => rec.id}
        dataSource={records}
        selectable={true}
        loading={loading === FetchStateEnum.LOADING}
        onChange={handleChange}
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

export default FunctionsPage;
