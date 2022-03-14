import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { TablePaginationConfig } from "antd/lib/table";

import { api } from "../../core/api";
import { Logger } from "../../core/logger";
import { defaultPaginationSort, updateDataGridParams } from "../../core/Utils";
import { SampleClass } from "../../model/domain/classes/SampleClass";
import { FetchStateEnum } from "../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult,
} from "../../model/ui/types/DataGridTypes";
import { DataGridCellTypeEnum } from "../../model/ui/enums/DataGridCellTypeEnum";
import DataGridComponent from "../../shared/components/datagrid/DataGrid";
import DataGridActionsComponent from "../../shared/components/datagrid/DataGridActions";
import DataGridRowActionsComponent from "../../shared/components/datagrid/DataGridRowActions";
import {
  FailNotification,
  SuccessNotification,
} from "../../shared/components/notifications/Notification";

function SamplePage() {
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
      defaultSort: true,
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
      defaultSort: true,
      resizable: true,
      width: 400,
      filterEnabled: true,
    },
    {
      title: "Created",
      dataIndex: "createdDate",
      defaultSort: true,
      resizable: true,
      width: 400,
      cellType: DataGridCellTypeEnum.DATE,
      filterEnabled: true,
    },
    {
      title: "Modified",
      dataIndex: "lastModifiedDate",
      defaultSort: true,
      resizable: true,
      width: 400,
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
      let records = await api.sample.getAll();
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
        ...record
      };
      let response = await api.sample.update(updatedRecord);
      data[recordIndex] = response;
      setRecords(data);
      SuccessNotification("Sample class changed.");
    } catch (error) {
      FailNotification("Saving data error");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleDelete(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.sample.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Sample class deleted.");
    } catch (error) {
      FailNotification("Deleting error");
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
        await api.sample.delete(id);
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
    sorter: SorterResult<SampleClass> | SorterResult<SampleClass>[]
  ) {
    setParams(
      updateDataGridParams<SampleClass>(pagination, filters, sorter, columns)
    );
  }

  return (
    <React.Fragment>
      <h1>Sample</h1>
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

export default SamplePage;
// internal portal
// admin: data vault, exam-form
// schedule dates format / range
// headers perms, routes for general(calendar, elib, users), permissions in groups, role admin issue
// log error messages foreign key
// File upload types check, delete old files
// LAKI - App.scss cleaning, prevod, breadcrumbs+name url, inline styles, colors, css module fixes
// TASO - remove icons deps, reminder, calendar management, logs, ts-ignore

// isExact fetchenum NONE
// history vs modal, edit - push, save - replace, ajax records update, missing ID
// errorBoundary, filters in URL, date filter remote, localization, show-hide column, form multi render
