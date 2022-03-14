import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { api } from "../../../core/api";
import { Logger } from "../../../core/logger";
import { defaultPaginationSort } from "../../../core/Utils";

import { Report } from "../../../model/domain/classes/Report";
import { DataGridCellTypeEnum } from "../../../model/ui/enums/DataGridCellTypeEnum";
import { FetchStateEnum } from "../../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridParamsType,
  SorterResult,
} from "../../../model/ui/types/DataGridTypes";
import DataGridComponent from "../../../shared/components/datagrid/DataGrid";
import DataGridActionsComponent from "../../../shared/components/datagrid/DataGridActions";
import {
  FailNotification,
  SuccessNotification,
} from "../../../shared/components/notifications/Notification";

import ReportDefinitionsCustomRowActions from "./custom/ReportDefinitionsCustomRowActions";

function ReportDefinitionsPage() {
  const [records, setRecords] = useState<Array<Report>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const params: DataGridParamsType<Report> = defaultPaginationSort();
  let { isExact, url } = useRouteMatch<SeminarParams>();
  let history = useHistory();
  const sorter = params.sorter as SorterResult<Report> | null;

  const columns: Array<DataGridColumnType<Report>> = [
    {
      title: "Report name",
      dataIndex: "name",
      defaultSort: true,
      resizable: true,
      fixed: "left",
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      defaultSort: true,
      resizable: true,
      width: 200,
    },
    {
      title: "Created",
      dataIndex: "createdDate",
      defaultSort: true,
      resizable: true,
      width: 160,
      cellType: DataGridCellTypeEnum.DATE,
    },
    {
      title: "Modified",
      dataIndex: "lastModifiedDate",
      defaultSort: true,
      resizable: true,
      width: 160,
      cellType: DataGridCellTypeEnum.DATE,
    },
  ];

  useEffect(() => {
    isExact && loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExact]);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let records = await api.report.getAll();
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
      await api.report.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Report definition deleted.");
    } catch (error) {
      FailNotification("Deleting error");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  return (
    <React.Fragment>
      <h1>Report definitions</h1>
      <DataGridComponent<Report>
        bordered
        columns={columns}
        rowKey={(rec) => rec.id}
        dataSource={records}
        loading={loading === FetchStateEnum.LOADING}
        selectable={false}
        filters={null}
        sort={sorter}
        scroll={{ x: true }}
        pagination={false}
        Actions={<DataGridActionsComponent onCreate={handleCreate} />}
        RowActions={
          <ReportDefinitionsCustomRowActions onDelete={handleDelete} />
        }
      />
    </React.Fragment>
  );
}

export default ReportDefinitionsPage;
