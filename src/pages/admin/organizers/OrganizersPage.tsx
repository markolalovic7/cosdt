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
import { OriginEnum } from "../../../model/domain/enums/OriginEnum";
import { Organizer } from "../../../model/domain/classes/Organizer";
import { FetchStateEnum } from "../../../model/ui/enums/FetchStateEnum";
import { DataGridCellTypeEnum } from "../../../model/ui/enums/DataGridCellTypeEnum";
import DataGridComponent from "../../../shared/components/datagrid/DataGrid";
import DataGridActionsComponent from "../../../shared/components/datagrid/DataGridActions";
import DataGridRowActionsComponent from "../../../shared/components/datagrid/DataGridRowActions";
import {
  FailNotification,
  SuccessNotification,
} from "../../../shared/components/notifications/Notification";

function OrganizersPage() {
  const [records, setRecords] = useState<Array<Organizer>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<Organizer>>(
    defaultPaginationSort()
  );
  let { path, isExact } = useRouteMatch();
  let history = useHistory();
  const sorter = params.sorter as SorterResult<Organizer> | null;

  const originNames: any = {
    [OriginEnum.DOMESTIC]: "Domaće",
    [OriginEnum.FOREIGN]: "Strano",
  };
  const origins = Object.keys(OriginEnum).map((origin) => ({
    id: origin,
    name: originNames[origin],
  }));
  const columns: Array<DataGridColumnType<Organizer>> = [
    {
      title: "Name",
      dataIndex: "name",
      editable: true,
      defaultSort: true,
      resizable: true,
      width: 250,
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
      title: "Origin",
      dataIndex: "origin",
      defaultSort: true,
      resizable: true,
      width: 120,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.OPTION,
      editable: true,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: origins,
      },
      rules: [
        {
          required: true,
          message: `Enter a origin.`,
        },
      ],
    },
    {
      title: "Co-organiser",
      dataIndex: "coorganiser",
      editable: true,
      defaultSort: false,
      resizable: true,
      width: 120,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.CHECKBOX,
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
      let records = await api.organizer.getAll();
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

  async function handleUpdate(record: Organizer): Promise<void> {
    try {
      setLoading(FetchStateEnum.LOADING);
      let data = [...records];
      let response = await api.organizer.update(record);
      const recordIndex = data.findIndex((rec) => rec.id === record.id);
      if (recordIndex > -1) {
        data[recordIndex] = response;
        setRecords(data);
      }
      SuccessNotification("Organizator changed.");
    } catch (error) {
      FailNotification("Saving data error ogranizatora.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleDelete(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.organizer.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Organizator deleted.");
    } catch (error) {
      FailNotification("Deleting error organizatora.");
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
        await api.organizer.delete(id);
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
    sorter: SorterResult<Organizer> | SorterResult<Organizer>[]
  ) {
    setParams(
      updateDataGridParams<Organizer>(pagination, filters, sorter, columns)
    );
  }

  return (
    <React.Fragment>
      <h1>Organizers</h1>
      <DataGridComponent<Organizer>
        bordered
        columns={columns}
        rowKey={(rec) => rec.id}
        dataSource={records}
        selectable={true}
        loading={loading === FetchStateEnum.LOADING}
        onChange={handleChange}
        filters={params.filters}
        sort={sorter}
        scroll={{ x: true }}
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

export default OrganizersPage;
