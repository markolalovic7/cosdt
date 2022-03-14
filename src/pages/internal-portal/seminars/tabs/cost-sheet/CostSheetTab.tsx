import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import Table, { TablePaginationConfig } from "antd/lib/table";

import { api } from "../../../../../core/api";
import { Logger } from "../../../../../core/logger";
import {
  defaultPaginationSort,
  updateDataGridParams,
} from "../../../../../core/Utils";
import { SeminarCost } from "../../../../../model/domain/classes/SeminarCost";
import { FetchStateEnum } from "../../../../../model/ui/enums/FetchStateEnum";
import { DataGridCellTypeEnum } from "../../../../../model/ui/enums/DataGridCellTypeEnum";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult,
} from "../../../../../model/ui/types/DataGridTypes";
import { ApiParams } from "../../../../../model/ui/types/ApiParams";
import DataGridComponent from "../../../../../shared/components/datagrid/DataGrid";
import {
  FailNotification,
  SuccessNotification,
} from "../../../../../shared/components/notifications/Notification";
import { CostCategory } from "../../../../../model/domain/classes/CostCategory";
import { CostSubcategory } from "../../../../../model/domain/classes/CostSubcategory";
import CostSheetCustomRowActionsComponent from "./custom/CostSheetCustomRowActions";
import CostSheetCustomActionsComponent from "./custom/CostSheetCustomActions";

function CostSheetTab() {
  const [records, setRecords] = useState<Array<SeminarCost>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<SeminarCost>>(
    defaultPaginationSort()
  );
  let { isExact, params: routeParams } = useRouteMatch<SeminarParams>();
  let history = useHistory();
  const sorter = params.sorter as SorterResult<SeminarCost> | null;
  let { url } = useRouteMatch();
  const [costCategories, setCostCategories] = useState<Array<CostCategory>>([]);
  const [costSubCategories, setCostSubCategories] = useState<
    Array<CostSubcategory>
  >([]);

  const columns: Array<DataGridColumnType<SeminarCost>> = [
    {
      title: "Cost category",
      dataIndex: ["category", "id"],
      sortIndex: ["category", "name"],
      editable: true,
      defaultSort: true,
      resizable: true,
      width: 400,
      filterEnabled: true,
      sorter: true,
      cellType: DataGridCellTypeEnum.OPTION,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: costCategories,
      },
    },
    {
      title: "Cost subcategory",
      dataIndex: ["subCategory", "id"],
      sortIndex: ["subCategory", "name"],
      dependencies: [["category", "id"]],
      editable: true,
      defaultSort: true,
      resizable: true,
      width: 400,
      filterEnabled: true,
      sorter: true,
      cellType: DataGridCellTypeEnum.OPTION,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: costSubCategories,
        filter: (val: CostSubcategory, depId) =>
          val.parentCategory?.id === depId,
      },
    },
    {
      title: "Note",
      dataIndex: "description",
      editable: true,
      defaultSort: true,
      resizable: true,
      width: 400,
      filterEnabled: true
    },
    {
      title: "Amount",
      dataIndex: "amount",
      editable: true,
      defaultSort: true,
      resizable: true,
      width: 400,
      cellType: DataGridCellTypeEnum.NUMBER,
      filterEnabled: true,
    },
    {
      title: "Created",
      dataIndex: "createdDate",
      defaultSort: true,
      resizable: true,
      width: 400,
      cellType: DataGridCellTypeEnum.DATE,
      filterEnabled: true
    },
  ];

  useEffect(() => {
    isExact && loadOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExact]);

  async function loadOptions() {
    try {
      setLoading(FetchStateEnum.LOADING);
      setCostCategories(await api.costCategory.getAll());
      setCostSubCategories(await api.costSubcategory.getAll());
      await loadCostSheet();
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
    }
  }

  async function loadCostSheet() {
    try {
      setLoading(FetchStateEnum.LOADING);
      const apiParams: ApiParams = {
        "seminarId.equals": routeParams.seminarId
      };
      let records = await api.seminarCost.getAll(apiParams);
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

  async function handleUpdate(record: SeminarCost): Promise<void> {
    history.replace(`${url}/${record.id}`);
    // try {
    //   setLoading(FetchStateEnum.LOADING);
    //   let data = [...records];
    //   const recordIndex = data.findIndex((rec) => rec.id === record.id);
    //   const updatedRecord: SeminarCost = {
    //     ...data[recordIndex],
    //     ...record,
    //   };
    //   let response = await api.seminarCost.update(updatedRecord);
    //   data[recordIndex] = response;
    //   setRecords(data);
    //   SuccessNotification("Cost sheet changed.");
    // } catch (error) {
    //   FailNotification("Saving data error");
    //   Logger.error(error);
    // } finally {
    //   setLoading(FetchStateEnum.LOADED);
    // }
  }

  async function handleDelete(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.seminarCost.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Cost sheet deleted.");
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
        await api.seminarCost.delete(id);
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
    sorter: SorterResult<SeminarCost> | SorterResult<SeminarCost>[]
  ) {
    setParams(
      updateDataGridParams<SeminarCost>(pagination, filters, sorter, columns)
    );
  }

  function renderSummary(records: readonly SeminarCost[]) {
    let total = 0;
    records.forEach(record => {
      total += record.amount || 0;
    });

    return (
      <Table.Summary.Row>
        <Table.Summary.Cell colSpan={4} index={0}>Total</Table.Summary.Cell>
        <Table.Summary.Cell colSpan={3} index={1}>{total}</Table.Summary.Cell>
      </Table.Summary.Row>
    )
  }

  return (
    <React.Fragment>
      <h1>Cost Sheet</h1>
      <DataGridComponent<SeminarCost>
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
        inlineEdit={false}
        Actions={
          <CostSheetCustomActionsComponent
            onCreate={handleCreate}
            onDeleteSelected={handleDeleteSelected}
          />
        }
        RowActions={
          <CostSheetCustomRowActionsComponent
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        }
        summary={renderSummary}
      />
    </React.Fragment>
  );
}

export default CostSheetTab;
