import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { TablePaginationConfig } from "antd/lib/table";

import { api } from "../../../core/api";
import { Logger } from "../../../core/logger";
import {
  defaultPaginationSort,
  updateDataGridParams,
} from "../../../core/Utils";
import { BookSubcategory } from "../../../model/domain/classes/BookSubcategory";
import { DataGridCellTypeEnum } from "../../../model/ui/enums/DataGridCellTypeEnum";
import { FetchStateEnum } from "../../../model/ui/enums/FetchStateEnum";
import { AdminRoutesEnum } from "../../../model/ui/routes/AdminRoutesEnum";
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

interface BookSubCategoryProps {
  parentId: number;
}

function BookSubCategoryTable({ parentId }: BookSubCategoryProps) {
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [records, setRecords] = useState<Array<BookSubcategory>>([]);
  const [params, setParams] = useState<DataGridParamsType<BookSubcategory>>(
    defaultPaginationSort()
  );
  const sorter = params.sorter as SorterResult<BookSubcategory> | null;
  let { path, isExact } = useRouteMatch();
  let history = useHistory();

  const columns: Array<DataGridColumnType<BookSubcategory>> = [
    {
      title: "Name",
      dataIndex: "name",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      link: {
        url: (record) =>
          `${path}/${parentId}${AdminRoutesEnum.BOOK_SUB_CATS}/${record.id}`,
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
      let records = await api.bookSubcategory.getAll();
      setRecords(records);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleCreate() {
    history.replace(`${path}/${parentId}${AdminRoutesEnum.BOOK_SUB_CATS}/new`);
  }

  async function handleUpdate(record: BookSubcategory): Promise<void> {
    try {
      setLoading(FetchStateEnum.LOADING);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === record.id);
      const updatedRecord: BookSubcategory = {
        ...data[recordIndex],
        ...record,
      };
      let response = await api.bookSubcategory.update(updatedRecord);
      data[recordIndex] = response;
      setRecords(data);
      SuccessNotification("Subcategory changed.");
    } catch (error) {
      FailNotification("Saving data error.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleDelete(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.bookSubcategory.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Subcategory deleted.");
    } catch (error) {
      FailNotification("Deleting error subcategory.");
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
        await api.bookSubcategory.delete(id);
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
    sorter: SorterResult<BookSubcategory> | SorterResult<BookSubcategory>[]
  ) {
    setParams(
      updateDataGridParams<BookSubcategory>(
        pagination,
        filters,
        sorter,
        columns
      )
    );
  }

  return (
    <DataGridComponent<BookSubcategory>
      bordered
      columns={columns}
      rowKey={(rec) => rec.id}
      dataSource={records}
      selectable={true}
      loading={loading === FetchStateEnum.LOADING}
      onChange={handleChange}
      filters={params.filters}
      sort={sorter}
      pagination={false}
      Actions={
        <div className="title-action-wrap">
          <h1>Subcategories</h1>
          <DataGridActionsComponent
            onCreate={handleCreate}
            onDeleteSelected={handleDeleteSelected}
          />
        </div>
      }
      RowActions={
        <DataGridRowActionsComponent
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      }
    />
  );
}

export default React.memo(BookSubCategoryTable);
