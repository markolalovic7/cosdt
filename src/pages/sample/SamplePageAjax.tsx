import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { TablePaginationConfig } from "antd/lib/table";

import { api } from "../../core/api";
import { Logger } from "../../core/logger";
import { FetchStateEnum } from "../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult,
} from "../../model/ui/types/DataGridTypes";
import { DataGridCellTypeEnum } from "../../model/ui/enums/DataGridCellTypeEnum";
import { SampleClass } from "../../model/domain/classes/SampleClass";
import DataGridComponent from "../../shared/components/datagrid/DataGrid";
import DataGridActionsComponent from "../../shared/components/datagrid/DataGridActions";
import DataGridRowActionsComponent from "../../shared/components/datagrid/DataGridRowActions";
import {
  FailNotification,
  SuccessNotification,
} from "../../shared/components/notifications/Notification";
import {
  defaultPaginationSort,
  getApiParams,
  updateDataGridParams,
} from "../../core/Utils";

function SamplePageAjax() {
  const [records, setRecords] = useState<Array<SampleClass>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<SampleClass>>(
    defaultPaginationSort()
  );
  let { url, isExact } = useRouteMatch();
  let history = useHistory();
  const sorter = params.sorter as SorterResult<SampleClass> | null;

  const columns: Array<DataGridColumnType<SampleClass>> = [
    {
      title: "Name",
      dataIndex: "name",
      editable: true,
      sorter: true,
      resizable: true,
      width: 400,
      filterEnabled: true,
      link: {
        url: (record) => `${url}/${record.id}`,
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
      sorter: true,
      resizable: true,
      width: 400,
      filterEnabled: true,
    },
    {
      title: "Created",
      dataIndex: "createdDate",
      sorter: true,
      resizable: true,
      width: 400,
      cellType: DataGridCellTypeEnum.DATE,
      filterEnabled: true,
    },
    {
      title: "Modified",
      dataIndex: "lastModifiedDate",
      sorter: true,
      resizable: true,
      width: 400,
      cellType: DataGridCellTypeEnum.DATE,
      filterEnabled: true,
    },
  ];

  useEffect(() => {
    isExact && loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExact, params.filters, params.sorter, params.pagination.current]);

  async function loadData() {
    try {
      const pagination = { ...params.pagination };
      setLoading(FetchStateEnum.LOADING);
      const apiParams = getApiParams<SampleClass>(params);
      let records = await api.sample.getAll(apiParams);
      pagination.total = await api.sample.count(apiParams);
      if (records.length === 0 && pagination.current && pagination.current > 1)
        pagination.current -= 1;
      setParams({ ...params, pagination });
      setRecords(records);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  // async function handleCreate(): Promise<SampleClass | null> {
  //     let response: SampleClass | null = null;
  //     try {
  //         setLoading(FetchStateEnum.LOADING);
  //         let record = new SampleClass();
  //         response = await api.sample.create(record);
  //         setRecords([...records, response]);
  //         SuccessNotification("Sample klasa createda.");
  //         setParams(defaultPaginationSort());
  //     } catch (error) {
  //         FailNotification("Saving data error sample class.");
  //         Logger.error(error);
  //     } finally {
  //         setLoading(FetchStateEnum.LOADED);
  //         return response;
  //     }
  // }

  // async function handleUpdate(record: SampleClass): Promise<void> {
  //     history.replace(`${url}/${record.id}`);
  // }

  async function handleCreate(): Promise<void> {
    history.replace(`${url}/new`);
  }

  async function handleUpdate(record: SampleClass): Promise<void> {
    try {
      setLoading(FetchStateEnum.LOADING);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === record.id);
      const updatedRecord: SampleClass = {
        ...data[recordIndex],
        ...record,
      };
      let response = await api.sample.update(updatedRecord);
      data[recordIndex] = response;
      setRecords(data);
      SuccessNotification("Sample class changed.");
    } catch (error) {
      FailNotification("Saving data error Sample class.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleDelete(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.sample.delete(id);
      SuccessNotification("Sample class deleted.");
      await loadData();
    } catch (error) {
      FailNotification("Deleting error Sample class.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleDeleteSelected(ids: Array<number>) {
    setLoading(FetchStateEnum.LOADING);
    for (const id of ids) {
      const record = records.find((rec) => rec.id === id);
      try {
        await api.sample.delete(id);
      } catch (error) {
        FailNotification(`Deleting error ${record?.name}.`);
        Logger.error(error);
      }
    }
    await loadData();
  }

  function handleChange(
    pagination: TablePaginationConfig,
    filters: DataGridFiltersType,
    sorter: SorterResult<SampleClass> | SorterResult<SampleClass>[]
  ) {
    setParams(
      updateDataGridParams<SampleClass>(pagination, filters, sorter, columns)
    );
  }

  return (
    <React.Fragment>
      <h1>Sample AJAX</h1>
      <DataGridComponent<SampleClass>
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

export default SamplePageAjax;
