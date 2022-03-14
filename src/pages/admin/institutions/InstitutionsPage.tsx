import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { TablePaginationConfig } from "antd/lib/table";

import { api } from "../../../core/api";
import { Logger } from "../../../core/logger";
import {
  defaultPaginationSort,
  updateDataGridParams,
} from "../../../core/Utils";
import { Institution } from "../../../model/domain/classes/Institution";
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

function InstitutionsPage() {
  const [records, setRecords] = useState<Array<Institution>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<Institution>>(
    defaultPaginationSort()
  );
  let { path, isExact } = useRouteMatch();
  let history = useHistory();
  const sorter = params.sorter as SorterResult<Institution> | null;

  const columns: Array<DataGridColumnType<Institution>> = [
    {
      title: "Name",
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
      title: "Description",
      dataIndex: "description",
      editable: true,
      defaultSort: true,
      resizable: true,
      width: 200,
      filterEnabled: true,
    },
    {
      title: "Create date",
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
      let records = await api.institution.getAll();
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

  async function handleUpdate(record: Institution): Promise<void> {
    try {
      setLoading(FetchStateEnum.LOADING);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === record.id);
      const updatedRecord: Institution = {
        ...data[recordIndex],
        ...record,
      };
      let response = await api.institution.update(updatedRecord);
      data[recordIndex] = response;
      setRecords(data);
      SuccessNotification("Institucija changed.");
    } catch (error) {
      FailNotification("Saving data error institucije.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleDelete(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.institution.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Institucija deleted.");
    } catch (error) {
      FailNotification("Deleting error institucije.");
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
        await api.institution.delete(id);
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
    sorter: SorterResult<Institution> | SorterResult<Institution>[]
  ) {
    setParams(
      updateDataGridParams<Institution>(pagination, filters, sorter, columns)
    );
  }

  return (
    <React.Fragment>
      <h1>Institucije</h1>
      <DataGridComponent<Institution>
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

export default InstitutionsPage;
