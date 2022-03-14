import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { TablePaginationConfig } from "antd/lib/table";

import { api } from "../../../core/api";
import { Logger } from "../../../core/logger";
import {
  defaultPaginationSort,
  updateDataGridParams,
} from "../../../core/Utils";
import { ElectronicBookLibrary } from "../../../model/domain/classes/ElectronicBookLibrary";
import { FetchStateEnum } from "../../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult,
} from "../../../model/ui/types/DataGridTypes";
import { DataGridCellTypeEnum } from "../../../model/ui/enums/DataGridCellTypeEnum";
import DataGridComponent from "../../../shared/components/datagrid/DataGrid";
import DataGridActionsComponent from "../../../shared/components/datagrid/DataGridActions";
import {
  FailNotification,
  SuccessNotification,
} from "../../../shared/components/notifications/Notification";
import { BookCategory } from "../../../model/domain/classes/BookCategory";
import { BookSubcategory } from "../../../model/domain/classes/BookSubcategory";
import ElectronicBookLibraryCustomRowActionsComponent from "./custom/ElectronicBookLibraryCustomRowActionsComponent";

function ElectronicBookLibraryPage() {
  const [records, setRecords] = useState<Array<ElectronicBookLibrary>>([]);
  const [bookCategories, setBookCategories] = useState<Array<BookCategory>>([]);
  const [bookSubCategories, setBookSubCategories] = useState<
    Array<BookSubcategory>
  >([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<
    DataGridParamsType<ElectronicBookLibrary>
  >(defaultPaginationSort());
  let { path, isExact } = useRouteMatch();
  let history = useHistory();
  const sorter = params.sorter as SorterResult<ElectronicBookLibrary> | null;

  const columns: Array<DataGridColumnType<ElectronicBookLibrary>> = [
    {
      title: "Naziv",
      dataIndex: "name",
      editable: true,
      defaultSort: true,
      resizable: true,
      width: 160,
      fixed: "left",
      filterEnabled: true,
      link: {
        url: (record) => `${path}/${record.id}`,
      },
      rules: [
        {
          required: true,
          message: `Enter a title.`,
        },
      ],
    },
    {
      title: "Autor",
      dataIndex: "author",
      editable: true,
      defaultSort: true,
      resizable: true,
      width: 160,
      fixed: "left",
      filterEnabled: true,
    },
    {
      title: "Opis",
      dataIndex: "description",
      editable: true,
      defaultSort: true,
      resizable: true,
      width: 400,
      filterEnabled: true,
      //ellipsis: true,
    },
    {
      title: "Godina",
      dataIndex: "publishDate",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      resizable: true,
      width: 120,
      cellType: DataGridCellTypeEnum.DATE,
      date: {
        pickerType: "year",
        format: "YYYY",
      },
    },
    {
      title: "Preuzimanje dozvoljeno",
      dataIndex: "allowDownloadToExternalUsers",
      editable: true,
      defaultSort: true,
      resizable: true,
      width: 70,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.CHECKBOX,
    },
    {
      title: "Kategorija",
      dataIndex: ["category", "id"],
      sortIndex: ["category", "name"],
      editable: true,
      defaultSort: true,
      resizable: true,
      width: 120,
      filterEnabled: true,
      sorter: true,
      cellType: DataGridCellTypeEnum.OPTION,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: bookCategories,
      },
    },
    {
      title: "Podkategorija",
      dataIndex: ["subcategory", "id"],
      sortIndex: ["subcategory", "name"],
      dependencies: [["category", "id"]],
      editable: true,
      defaultSort: true,
      resizable: true,
      width: 120,
      filterEnabled: true,
      sorter: true,
      cellType: DataGridCellTypeEnum.OPTION,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: bookSubCategories,
        filter: (val: BookSubcategory, depId) =>
          val.parentCategory?.id === depId,
      },
    },
    {
      title: "Kreirano",
      dataIndex: "createdDate",
      defaultSort: true,
      resizable: true,
      width: 160,
      cellType: DataGridCellTypeEnum.DATE,
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
      setBookCategories(await api.bookCategory.getAll());
      setBookSubCategories(await api.bookSubcategory.getAll());
      await loadEbooks();
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
    }
  }

  async function loadEbooks() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let records = await api.eBook.getAll();
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

  async function handleUpdate(record: ElectronicBookLibrary): Promise<void> {
    try {
      setLoading(FetchStateEnum.LOADING);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === record.id);
      const updatedRecord: ElectronicBookLibrary = {
        ...data[recordIndex],
        ...record,
      };
      let response = await api.eBook.update(updatedRecord);
      data[recordIndex] = response;
      setRecords(data);
      SuccessNotification("E-book changed.");
    } catch (error) {
      FailNotification("Saving data error eBook-a.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleDelete(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.eBook.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("E-book deleted.");
    } catch (error) {
      FailNotification("Deleting error eBook-a.");
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
        await api.eBook.delete(id);
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
    sorter:
      | SorterResult<ElectronicBookLibrary>
      | SorterResult<ElectronicBookLibrary>[]
  ) {
    setParams(
      updateDataGridParams<ElectronicBookLibrary>(
        pagination,
        filters,
        sorter,
        columns
      )
    );
  }

  return (
    <React.Fragment>
      <h1>E-book Biblioteka</h1>
      <DataGridComponent<ElectronicBookLibrary>
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
        actionsColumn={{
          fixed: "right",
          width: 120,
        }}
        scroll={{ x: true }}
        Actions={
          <DataGridActionsComponent
            onCreate={handleCreate}
            onDeleteSelected={handleDeleteSelected}
          />
        }
        RowActions={
          <ElectronicBookLibraryCustomRowActionsComponent
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        }
      />
    </React.Fragment>
  );
}

export default ElectronicBookLibraryPage;
