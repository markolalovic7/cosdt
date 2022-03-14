import React, { useEffect, useState } from "react";
import { TablePaginationConfig } from "antd";

import { api } from "../../../core/api";
import { Logger } from "../../../core/logger";
import {
  defaultPaginationSort,
  updateDataGridParams,
} from "../../../core/Utils";

import { WordTemplate } from "../../../model/domain/classes/WordTemplate";
import { DataGridCellTypeEnum } from "../../../model/ui/enums/DataGridCellTypeEnum";
import { FetchStateEnum } from "../../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult,
} from "../../../model/ui/types/DataGridTypes";
import DataGridComponent from "../../../shared/components/datagrid/DataGrid";
import { FailNotification } from "../../../shared/components/notifications/Notification";
import WordTemplateCustomRowActionsComponent from "./custom/WordTemplateCustomRowAction";

function WordTemplatesPage() {
  const [records, setRecords] = useState<Array<WordTemplate>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<WordTemplate>>(
    defaultPaginationSort()
  );
  const sorter = params.sorter as SorterResult<WordTemplate> | null;
  const columns: Array<DataGridColumnType<WordTemplate>> = [
    {
      title: "Name",
      dataIndex: "name",
      defaultSort: true,
      resizable: true,
      width: 150,
      fixed: "left",
    },
    {
      title: "Description",
      dataIndex: "description",
      defaultSort: true,
      resizable: true,
      width: 200,
    },
    {
      title: "Entity",
      dataIndex: "entity",
      defaultSort: true,
      resizable: true,
      width: 150,
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
      let records = await api.wordTemplate.getAll();
      setRecords(records);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleUpdate(record: WordTemplate) {
    let data = [...records];
    const recordIndex = data.findIndex((rec) => rec.entity === record.entity);
    data[recordIndex] = record;
    setRecords(data);
  }

  function handleChange(
    pagination: TablePaginationConfig,
    filters: DataGridFiltersType,
    sorter: SorterResult<WordTemplate> | SorterResult<WordTemplate>[]
  ) {
    setParams(
      updateDataGridParams<WordTemplate>(pagination, filters, sorter, columns)
    );
  }

  return (
    <React.Fragment>
      <h1>Word templates</h1>
      <DataGridComponent<WordTemplate>
        bordered
        columns={columns}
        rowKey={(rec) => rec.id}
        dataSource={records}
        loading={loading === FetchStateEnum.LOADING}
        selectable={false}
        filters={params.filters}
        sort={sorter}
        scroll={{ x: true }}
        actionsColumn={{
          fixed: "right",
          width: 120,
        }}
        pagination={false}
        inlineEdit={false}
        onChange={handleChange}
        RowActions={
          <WordTemplateCustomRowActionsComponent onUpdate={handleUpdate} />
        }
      />
    </React.Fragment>
  );
}

export default WordTemplatesPage;
