import React, {useEffect, useState} from "react";
import { useRouteMatch} from "react-router-dom";

import {api} from "../../../core/api";
import {Logger} from "../../../core/logger";
import {defaultPaginationSort} from "../../../core/Utils";
import {FileUpload} from "../../../model/domain/classes/FileUpload";
import {DataGridCellTypeEnum} from "../../../model/ui/enums/DataGridCellTypeEnum";
import {FetchStateEnum} from "../../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridParamsType,
  SorterResult,
} from "../../../model/ui/types/DataGridTypes";
import {
  FailNotification,
  SuccessNotification,
} from "../../../shared/components/notifications/Notification";
import DataGridComponent from "../../../shared/components/datagrid/DataGrid";

import DataVaultCustomRowActionsComponent from "./custom/DataVaultCustomRowActions";

function DataVaultPage() {
  const [records, setRecords] = useState<Array<FileUpload>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  let params: DataGridParamsType<FileUpload> = defaultPaginationSort();
  const [pagin, setPagin] = useState(params.pagination);
  let {isExact} = useRouteMatch();
  const sorter = params.sorter as SorterResult<FileUpload> | null;
  const columns: Array<DataGridColumnType<FileUpload>> = [
    {
      title: "File name",
      dataIndex: "name",
      filterEnabled: true,
      defaultSort: true,
      resizable: true,
      width: 200,
      fixed: "left",
    },
    {
      title: "Format",
      dataIndex: "mime",
      filterEnabled: true,
      defaultSort: true,
      resizable: true,
      width: 120,
    },
    {
      title: "Seminar",
      dataIndex: ["seminar", "name"],
      defaultSort: true,
      resizable: true,
      width: 250,
      filterEnabled: true,
    },
    {
      title: "Seminar start date",
      dataIndex: ["seminar", "start"],
      defaultSort: true,
      resizable: true,
      width: 200,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.DATE,
    },
    {
      title: "Upload date",
      dataIndex: "createdDate",
      defaultSort: true,
      resizable: true,
      width: 160,
      cellType: DataGridCellTypeEnum.DATE,
    },
  ];

  useEffect(() => {
    isExact && loadData();
    params = {
      ...params,
      pagination: {
        ...params.pagination,
        current: page,
        total: total,
        showSizeChanger: false,
        onChange: page => {

          setPage(page)
        }
      }
    };
    setPagin(params.pagination);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExact, total, page]);

  async function loadData() {
    countData();
    try {
      setLoading(FetchStateEnum.LOADING);
      let records = await api.dataVault.getAll(page===0 ? 0 : page-1);
      setRecords(records);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function countData() {
    try {
      let itemsCount = await api.dataVault.count();
      setTotal(itemsCount);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }


  async function handleDelete(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.dataVault.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Data deleted.");
    } catch (error) {
      FailNotification("Deleting error");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  return (
    <React.Fragment>
      <h1>Data vault</h1>
      <DataGridComponent<FileUpload>
        bordered
        columns={columns}
        rowKey={(rec) => rec.id}
        dataSource={records}
        loading={loading === FetchStateEnum.LOADING}
        selectable={false}
        filters={null}
        actionsColumn={{
          fixed: "right",
          width: 120,
        }}
        scroll={{x: true}}
        sort={sorter}
        pagination={pagin}
        //Actions={<DataGridActionsComponent onCreate={handleCreate} />}
        RowActions={
          <DataVaultCustomRowActionsComponent onDelete={handleDelete}/>
        }
      />
    </React.Fragment>
  );
}

export default DataVaultPage;
