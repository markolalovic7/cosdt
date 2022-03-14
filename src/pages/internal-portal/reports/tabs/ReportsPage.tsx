import React, { useEffect, useState } from "react";

import { api } from "../../../../core/api";
import { Logger } from "../../../../core/logger";
import { defaultPaginationSort } from "../../../../core/Utils";

import { Report } from "../../../../model/domain/classes/Report";
import { DataGridCellTypeEnum } from "../../../../model/ui/enums/DataGridCellTypeEnum";
import { FetchStateEnum } from "../../../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridParamsType,
  SorterResult,
} from "../../../../model/ui/types/DataGridTypes";
import DataGridComponent from "../../../../shared/components/datagrid/DataGrid";
import DataGridActionsComponent from "../../../../shared/components/datagrid/DataGridActions";
import { FailNotification } from "../../../../shared/components/notifications/Notification";
import ReportsCustomRowActions from "../custom/ReportsCustomRowActions";

function ReportsPage() {
  const [records, setRecords] = useState<Array<Report>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const params: DataGridParamsType<Report> = defaultPaginationSort();
  const sorter = params.sorter as SorterResult<Report> | null;

  const columns: Array<DataGridColumnType<Report>> = [
    {
      title: "Report name",
      dataIndex: "name",
      defaultSort: true,
      resizable: true,
      width: 150,
      fixed: "left",
      link: {
        url: (rec) => api.report.getReportsUrl(rec.id),
        external: true,
      },
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
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <React.Fragment>
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
        Actions={<DataGridActionsComponent />}
        RowActions={<ReportsCustomRowActions />}
      />
    </React.Fragment>
  );
}

export default ReportsPage;
