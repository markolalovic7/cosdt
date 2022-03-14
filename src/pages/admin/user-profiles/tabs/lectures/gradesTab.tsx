import React, {useEffect, useState} from "react";
import {TablePaginationConfig} from "antd/lib/table";

import {defaultPaginationSort, updateDataGridParams} from "../../../../../core/Utils";
import {FetchStateEnum} from "../../../../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult
} from "../../../../../model/ui/types/DataGridTypes";
import DataGridComponent from "../../../../../shared/components/datagrid/DataGrid";
import DataGridRowActionsComponent from "../../../../../shared/components/datagrid/DataGridRowActions";
import {TheoryDiary} from "../../../../../model/domain/classes/TheoryDiary";
import styles from "../../../../internal-portal/seminars/tabs/attendees/Attendees.module.scss";
import {useRouteMatch} from "react-router";
import {api} from "../../../../../core/api";
import GradesAddCustomComponent from "./custom/GradesAddCustomComponent";
import {DiaryGrades} from "../../../../../model/domain/classes/DiaryGrades";
import {FailNotification, SuccessNotification} from "../../../../../shared/components/notifications/Notification";
import {Logger} from "../../../../../core/logger";
import {DataGridCellTypeEnum} from "../../../../../model/ui/enums/DataGridCellTypeEnum";


function GradesTab() {
  const [params, setParams] = useState<DataGridParamsType<DiaryGrades>>(
    defaultPaginationSort()
  );
  const [records, setRecords] = useState<Array<DiaryGrades>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>();
  const [attendees, setAttendees] = useState<any>();
  const sorter = params.sorter as SorterResult<any> | null;
  let {url, params: routeParams} = useRouteMatch<UserProfileParams>();


  useEffect(() => {
    loadData();

  }, []);
  const columns: Array<DataGridColumnType<DiaryGrades>> = [
    {
      title: "Ime",
      dataIndex: "firstName",
      defaultSort: true,
      filterEnabled: true,
    }, {
      title: "Prezime",
      dataIndex: "lastName",
      defaultSort: true,
      filterEnabled: true,
    }, {
      title: "Ocjena",
      dataIndex: "ocjena",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.OPTION,
      options: {
        valueIndex: "id",
        nameIndex: "name",
        values: [{id: 'Zadovoljava', name: "Zadovoljava"}, {
          id: 'Ne Zadovoljava',
          name: "Ne Zadovoljava"
        }, {id: 'Neocijenjen', name: "Neocijenjen"},],
      },
    }, {
      title: "Opis",
      dataIndex: "opis",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
    },
  ];

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let records = await api.grades.getAll(+routeParams.lectureId, +routeParams.id);
      let attendeesRecords = await api.classLecture.get(parseInt(routeParams.lectureId));
      setAttendees(attendeesRecords.classAttendees);
      setRecords(records);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error.");
      setLoading(FetchStateEnum.FAILED);
      Logger.error(error);
    }
  }

  async function handleUpdate(record: TheoryDiary): Promise<void> {
    let data = [...records];
    const recordIndex = data.findIndex((rec) => rec.id === record.id);
    data[recordIndex] = {
      ...data[recordIndex],
      ...record,
    };
    setRecords(data);
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.grades.update(+routeParams.lectureId, +routeParams.id, data[recordIndex]);
      setLoading(FetchStateEnum.LOADED);
      SuccessNotification("Grades diary changed.");
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Saving data error.");
      setLoading(FetchStateEnum.FAILED);
      Logger.error(error);
    }
  }

  async function onCreate(record: DiaryGrades): Promise<void> {
    let data = [...records];
    const recordIndex = data.findIndex((rec) => rec.id === record.id);
    data[recordIndex] = {
      ...data[recordIndex],
      ...record,

    };
    setRecords(data);
  }

  async function addNewGrade(lectureId: number, lecturerId: number, resource: DiaryGrades) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.grades.create(+lectureId, +lecturerId, resource);
      setLoading(FetchStateEnum.LOADED);
      SuccessNotification("Grades diary added.");
      loadData();
    } catch (e) {
      console.log(e);
      FailNotification('Failed adding grade')
    }
  }

  function handleChange(
    pagination: TablePaginationConfig,
    filters: DataGridFiltersType,
    sorter: SorterResult<any> | SorterResult<any>[]
  ) {
    setParams(
      updateDataGridParams<any>(pagination, filters, sorter, columns)
    );
  }

  async function handleDelete(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.grades.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Attendee deleted.");
    } catch (error) {
      FailNotification("Deleting error.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  return (
    <DataGridComponent<any>
      className={styles.AttendeesTable}
      bordered
      columns={columns}
      rowKey={(rec) => rec.id}
      dataSource={records}
      selectable={false}
      loading={loading === FetchStateEnum.LOADING}
      onChange={handleChange}
      filters={params.filters}
      sort={sorter}
      pagination={false}
      tableLayout={"fixed"}
      scroll={{x: 1500}}
      inlineEdit
      Actions={
        <GradesAddCustomComponent addNewGrade={addNewGrade} attendees={attendees} onCreate={onCreate}/>
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

export default GradesTab;
