import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { api } from "../../../../../core/api";
import { Logger } from "../../../../../core/logger";
import {
  defaultPaginationSort
} from "../../../../../core/Utils";
import { FetchStateEnum } from "../../../../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridParamsType,
  SorterResult
} from "../../../../../model/ui/types/DataGridTypes";
import { FileUpload } from "../../../../../model/domain/classes/FileUpload";
import { DataGridCellTypeEnum } from "../../../../../model/ui/enums/DataGridCellTypeEnum";
import DataGridComponent from "../../../../../shared/components/datagrid/DataGrid";
import DataGridActionsComponent from "../../../../../shared/components/datagrid/DataGridActions";
import {
  FailNotification,
  SuccessNotification
} from "../../../../../shared/components/notifications/Notification";
import ContractCustomRowActionsComponent from "./custom/ContractCustomRowActions";

function ContractTab() {
  const [records, setRecords] = useState<Array<FileUpload>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const params: DataGridParamsType<FileUpload> = defaultPaginationSort();
  let { isExact, url, params: routeParams } = useRouteMatch<SeminarParams>();
  let history = useHistory();
  const sorter = params.sorter as SorterResult<FileUpload> | null;
  const seminarId = routeParams.seminarId;

  const columns: Array<DataGridColumnType<FileUpload>> = [
    {
      title: "File name",
      dataIndex: "name",
      defaultSort: true,
      resizable: true,
      width: 400
    },
    {
      title: "Description",
      dataIndex: "description",
      defaultSort: true,
      resizable: true,
      width: 400
    },
    {
      title: "Lecturer",
      dataIndex: ["profile", "username"],
      defaultSort: true,
      resizable: true,
      width: 400
    },
    {
      title: "Created",
      dataIndex: "createdDate",
      defaultSort: true,
      resizable: true,
      cellType: DataGridCellTypeEnum.DATE
    },
    {
      title: "Modified",
      dataIndex: "lastModifiedDate",
      defaultSort: true,
      resizable: true,
      cellType: DataGridCellTypeEnum.DATE
    }
  ];

  useEffect(() => {
    isExact && loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExact]);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let records = await api.seminarContract.getAll(seminarId);
      setRecords(records);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleCreate(): Promise<void> {
    history.replace(`${url}/new`);
  }

  async function handleDelete(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.seminarContract.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Contract deleted.");
    } catch (error) {
      FailNotification("Deleting error");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  return (
    <React.Fragment>
      <h1>Contracts</h1>
      <DataGridComponent<FileUpload>
        bordered
        columns={columns}
        rowKey={(rec) => rec.id}
        dataSource={records}
        loading={loading === FetchStateEnum.LOADING}
        selectable={false}
        filters={null}
        sort={sorter}
        pagination={false}
        Actions={
          <DataGridActionsComponent
            onCreate={handleCreate}
          />
        }
        RowActions={
          <ContractCustomRowActionsComponent
            onDelete={handleDelete}
          />
        }
      />
    </React.Fragment>
  );
}

export default ContractTab;
