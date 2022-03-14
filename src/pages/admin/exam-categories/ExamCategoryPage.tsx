import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { TablePaginationConfig } from "antd/lib/table";

import { api } from "../../../core/api";
import { Logger } from "../../../core/logger";
import {
  defaultPaginationSort,
  updateDataGridParams,
} from "../../../core/Utils";

import { FetchStateEnum } from "../../../model/ui/enums/FetchStateEnum";
import { DataGridCellTypeEnum } from "../../../model/ui/enums/DataGridCellTypeEnum";
import { ExamCategory } from "../../../model/domain/classes/ExamCategory";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult,
} from "../../../model/ui/types/DataGridTypes";
import {
  FailNotification,
  SuccessNotification,
} from "../../../shared/components/notifications/Notification";
import DataGridComponent from "../../../shared/components/datagrid/DataGrid";
import DataGridActionsComponent from "../../../shared/components/datagrid/DataGridActions";
import DataGridRowActionsComponent from "../../../shared/components/datagrid/DataGridRowActions";
import ExamSubCategoryPage from "./ExamSubCategoryTable";

function ExamCategoryPage() {
  const [records, setRecords] = useState<Array<ExamCategory>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<ExamCategory>>(
    defaultPaginationSort()
  );
  let { path, isExact } = useRouteMatch();
  let history = useHistory();
  const sorter = params.sorter as SorterResult<ExamCategory> | null;

  const columns: Array<DataGridColumnType<ExamCategory>> = [
    {
      title: "Name",
      dataIndex: "name",
      editable: true,
      defaultSort: true,
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
    },
    {
      title: "Created",
      dataIndex: "createdDate",
      cellType: DataGridCellTypeEnum.DATE,
      defaultSort: true,
      filterEnabled: true,
    },
    {
      title: "Modified",
      dataIndex: "lastModifiedDate",
      cellType: DataGridCellTypeEnum.DATE,
      defaultSort: true,
      filterEnabled: true,
    },
  ];

  useEffect(() => {
    isExact && loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExact]);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let records = await api.examCategory.getAll();
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

  async function handleUpdate(record: ExamCategory): Promise<void> {
    try {
      setLoading(FetchStateEnum.LOADING);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === record.id);
      const updatedRecord: ExamCategory = {
        ...data[recordIndex],
        ...record,
      };
      let response = await api.examCategory.update(updatedRecord);
      data[recordIndex] = response;
      setRecords(data);
      SuccessNotification("Exam category changed.");
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
      await api.examCategory.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Exam category deleted.");
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
        await api.examCategory.delete(id);
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
    sorter: SorterResult<ExamCategory> | SorterResult<ExamCategory>[]
  ) {
    setParams(
      updateDataGridParams<ExamCategory>(
        pagination,
        filters,
        sorter,
        columns
      )
    );
  }

  return (
    <React.Fragment>
      <h1>
        Exam categories{" "}
        <small>Lorem ipsum dolor sit amet, consectetur</small>
      </h1>
      <DataGridComponent<ExamCategory>
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
        tableLayout={"fixed"}
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
        expandable={{
          expandedRowRender: (
            record,
            index: number,
            indent: number,
            expanded: boolean
          ) => (
            <div className={"subcategory-wrap"}>
              <ExamSubCategoryPage parentId={record.id} />
            </div>
          ),
        }}
      />
    </React.Fragment>
  );
}

export default React.memo(ExamCategoryPage);
