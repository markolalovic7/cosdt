import React, {useEffect, useState} from "react";
import {useHistory, useRouteMatch} from "react-router-dom";

import {TablePaginationConfig} from "antd/lib/table";
import {api} from "../../../core/api";
import {Logger} from "../../../core/logger";
import {defaultPaginationSort, updateDataGridParams,} from "../../../core/Utils";

import {DataGridCellTypeEnum} from "../../../model/ui/enums/DataGridCellTypeEnum";
import {Exam} from "../../../model/domain/classes/Exam";
import {ExamSubcategory} from "../../../model/domain/classes/ExamSubcategory";
import {ExamCategory} from "../../../model/domain/classes/ExamCategory";
import {FetchStateEnum} from "../../../model/ui/enums/FetchStateEnum";
import FormSurvey from "../../../model/domain/classes/FormSurvey";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult,
} from "../../../model/ui/types/DataGridTypes";
import {FailNotification, SuccessNotification,} from "../../../shared/components/notifications/Notification";
import DataGridComponent from "../../../shared/components/datagrid/DataGrid";
import DataGridActionsComponent from "../../../shared/components/datagrid/DataGridActions";
import ExamsCustomRowActionsComponent from "./custom/ExamsCustomRowActions";
import {saveAs} from "file-saver";

function ExamsPage() {
  const [records, setRecords] = useState<Array<Exam>>([]);
  const [evalForms, setEvalForms] = useState<Array<FormSurvey>>([]);
  const [examCategories, setExamCategories] = useState<Array<ExamCategory>>([]);
  const [examSubcategories, setExamSubcategories] = useState<
    Array<ExamSubcategory>
  >([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<Exam>>(
    defaultPaginationSort(200)
  );
  let { path, isExact } = useRouteMatch();
  let history = useHistory();
  const sorter = params.sorter as SorterResult<Exam> | null;

  const columns: Array<DataGridColumnType<Exam>> = [
    {
      title: "Name",
      dataIndex: "name",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      width: 150,
      fixed: "left",
      link: {
        url: (record) => {
          let name = record.name;
          return `${path}/${record.id}/${name
            .toLowerCase()
            .replace(/\s+/g, "-")}/general`;
        },
        target: "push",
      },
      rules: [
        {
          required: true,
          message: `Enter a name.`,
        },
      ],
    },
    {
      title: "Starts",
      dataIndex: "start",
      defaultSort: true,
      filterEnabled: true,
      width: 160,
      cellType: DataGridCellTypeEnum.DATE,
    },
    {
      title: "Ends",
      dataIndex: "end",
      defaultSort: true,
      filterEnabled: true,
      width: 160,
      cellType: DataGridCellTypeEnum.DATE,
    },
    {
      title: "Category",
      dataIndex: ["category", "id"],
      sortIndex: ["category", "name"],
      editable: true,
      defaultSort: true,
      resizable: true,
      width: 150,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.OPTION,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: examCategories,
      },
      rules: [
        {
          required: true,
          message: `Exam category missing.`,
        },
      ],
    },
    {
      title: "Subcategory",
      dataIndex: ["subcategory", "id"],
      sortIndex: ["subcategory", "name"],
      dependencies: [["category", "id"]],
      editable: true,
      defaultSort: true,
      resizable: true,
      width: 150,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.OPTION,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: examSubcategories,
        filter: (val: ExamSubcategory, depId) => val.parentCategoryId === depId,
      },
      rules: [
        {
          required: true,
          message: `Exam subcategory missing.`,
        },
      ],
    },
    {
      title: "Survey",
      dataIndex: "surveyId",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      sorter: true,
      width: 150,
      cellType: DataGridCellTypeEnum.OPTION,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: evalForms,
      },
    },
    {
      title: "Min. to pass",
      dataIndex: "minToPassExam",
      editable: true,
      width: 150,
      defaultSort: true,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.NUMBER,
    },
    {
      title: "Max tries",
      dataIndex: "maxTries",
      editable: true,
      width: 150,
      defaultSort: true,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.NUMBER,
    },
    {
      title: "Published",
      dataIndex: "active",
      editable: true,
      width: 150,
      defaultSort: true,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.CHECKBOX,
    },
    {
      title: "Created",
      dataIndex: "createdDate",
      editable: false,
      width: 160,
      defaultSort: true,
      cellType: DataGridCellTypeEnum.DATE,
    },
  ];

  useEffect(() => {
    isExact && loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExact]);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let records = await api.exam.getAll();
      setEvalForms(await api.survey.getAll());
      setExamCategories(await api.examCategory.getAll());
      setExamSubcategories(await api.examSubcategory.getAll());
      setRecords(records);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleCreate(): Promise<void> {
    history.replace(`${path}/new`);
  }

  async function handleUpdate(record: Exam): Promise<void> {
    try {
      setLoading(FetchStateEnum.LOADING);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === record.id);
      const updatedRecord: Exam = {
        ...data[recordIndex],
        ...record,
      };
      data[recordIndex] = await api.exam.update(updatedRecord);
      setRecords(data);
      SuccessNotification("Exam changed.");
    } catch (error) {
      FailNotification("Saving data error");
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
        await api.exam.delete(id);
        data.splice(recordIndex, 1);
      } catch (error) {
        FailNotification(`Deleting error ${data[recordIndex]?.name}.`);
        Logger.error(error);
      }
    }
    setRecords(data);
    setLoading(FetchStateEnum.LOADED);
  }
  async function getReport(id: number, name: string) {
    try {
      //setLoading(FetchStateEnum.LOADING);
      const data = await api.examTest.getEvaluationReport(id);
      let blob = new Blob([data], { type: "application/xlsx" });
      saveAs(blob, `${name}.xlsx`);
      SuccessNotification("Download started.");
    } catch (error) {
      FailNotification("Download error.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }
  async function handleDelete(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.exam.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Exam deleted.");
    } catch (error) {
      FailNotification("Exam deleting error.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handlePublish(record: Exam, publish: boolean): Promise<void> {
    try {
      setLoading(FetchStateEnum.LOADING);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === record.id);
      const updatedRecord: Exam = {
        ...data[recordIndex],
        active: publish,
      };
      data[recordIndex] = await api.exam.update(updatedRecord);
      setRecords(data);
      SuccessNotification(`Exam ${publish ? "published" : "unpublished"}.`);
    } catch (error) {
      FailNotification("Saving data error");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  function handleChange(
    pagination: TablePaginationConfig,
    filters: DataGridFiltersType,
    sorter: SorterResult<Exam> | SorterResult<Exam>[]
  ) {
    setParams(updateDataGridParams<Exam>(pagination, filters, sorter, columns));
  }

  return (
    <React.Fragment>
      <h1>Exams</h1>
      <DataGridComponent<Exam>
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
        scroll={{ x: 120, y: 500 }}
        actionsColumn={{
          fixed: "right",
          width: 150,
        }}
        Actions={
          <DataGridActionsComponent
            onCreate={handleCreate}
            onDeleteSelected={handleDeleteSelected}
          />
        }
        RowActions={
          <ExamsCustomRowActionsComponent
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onPublish={handlePublish}
            getReport={getReport}
          />
        }
      />
    </React.Fragment>
  );
}

export default ExamsPage;
