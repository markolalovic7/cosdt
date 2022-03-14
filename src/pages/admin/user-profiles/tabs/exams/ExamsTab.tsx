import React, {useEffect, useState} from "react";
import {useRouteMatch} from "react-router-dom";
import {Tabs} from "antd";
import {TablePaginationConfig} from "antd/lib/table";

import {api} from "../../../../../core/api";
import {Logger} from "../../../../../core/logger";
import {defaultPaginationSort, updateDataGridParams,} from "../../../../../core/Utils";

import {FetchStateEnum} from "../../../../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult,
} from "../../../../../model/ui/types/DataGridTypes";
import DataGridComponent from "../../../../../shared/components/datagrid/DataGrid";
import {FailNotification, SuccessNotification} from "../../../../../shared/components/notifications/Notification";
import {ExamAttendeeEnum} from "../../../../../model/domain/enums/ExamAttendeeEnum";
import {DataGridCellTypeEnum} from "../../../../../model/ui/enums/DataGridCellTypeEnum";
import ExamsCustomRowActionsComponent from "./custom/ExamsCustomRowActions";
import {ExamAttendee} from "../../../../../model/domain/classes/ExamAttendee";
import {Exam} from "../../../../../model/domain/classes/Exam";

const {TabPane} = Tabs;

function ExamsTab() {
  const [badges, setBadges] = useState<Array<ExamAttendee>>([]);
  const [records, setRecords] = useState<Array<ExamAttendee>>([]);
  const [otherExams, setOtherExams] = useState<Array<Exam>>([]);
  const [readOnly, setReadOnly] = useState<ExamAttendeeEnum>(ExamAttendeeEnum.INVITATION_SENT);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<ExamAttendee>>(
    defaultPaginationSort()
  );
  const [paramsOther, setParamsOther] = useState<DataGridParamsType<Exam>>(
    defaultPaginationSort()
  );
  let {params: routeParams} = useRouteMatch<UserProfileParams>();
  let userId = routeParams.id;
  const sorter = params.sorter as SorterResult<ExamAttendee> | null;
  const sorterOther = paramsOther.sorter as SorterResult<Exam> | null;
  const columns: Array<DataGridColumnType<ExamAttendee>> = [
    {
      title: "Naziv",
      dataIndex: ["exam", "name"],
      editable: false,
      defaultSort: true,
      filterEnabled: true,
      fixed: "left"
    },
    {
      title: "Opis",
      dataIndex: ["exam", "description"],
      editable: false,
      defaultSort: true,
      filterEnabled: true,
    },
    {
      title: "Početak",
      dataIndex: ["exam", "start"],
      editable: false,
      width: 40,
      defaultSort: true,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.DATE,
    },
    {
      title: "Kraj",
      dataIndex: ["exam", "end"],
      editable: false,
      width: 40,
      defaultSort: true,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.DATE,
    },
    {
      title: "Minimalni % za prolaz",
      dataIndex: ["exam", "minToPassExam"],
      editable: false,
      width: 40,
      defaultSort: true,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.TEXT,
    },
    {
      title: "Max broj pokušaja",
      dataIndex: ["exam", "maxTries"],
      editable: false,
      defaultSort: true,
      filterEnabled: true,
    },
    {
      title: "Kategorija",
      dataIndex: ["exam", "category", "name"],
      editable: false,
      defaultSort: true,
      filterEnabled: true,
    },
    {
      title: "Podkategorija",
      dataIndex: ["exam", "subcategory", "name"],
      editable: false,
      defaultSort: true,
      filterEnabled: true,
    },
  ];
  const columnsOther: Array<DataGridColumnType<Exam>> = [
    {
      title: "Naziv",
      dataIndex: ["name"],
      editable: false,
      defaultSort: true,
      filterEnabled: true,
      fixed: "left"
    },
    {
      title: "Opis",
      dataIndex: ["description"],
      editable: false,
      defaultSort: true,
      filterEnabled: true,
    },
    {
      title: "Početak",
      dataIndex: ["start"],
      editable: false,
      width: 40,
      defaultSort: true,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.DATE,
    },
    {
      title: "Kraj",
      dataIndex: ["end"],
      editable: false,
      width: 40,
      defaultSort: true,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.DATE,
    },
    {
      title: "Minimalni % za prolaz",
      dataIndex: ["minToPassExam"],
      editable: false,
      width: 40,
      defaultSort: true,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.TEXT,
    },
    {
      title: "Max broj pokušaja",
      dataIndex: ["maxTries"],
      editable: false,
      defaultSort: true,
      filterEnabled: true,
    },
    {
      title: "Kategorija",
      dataIndex: ["category", "name"],
      editable: false,
      defaultSort: true,
      filterEnabled: true,
    },
    {
      title: "Podkategorija",
      dataIndex: ["subcategory", "name"],
      editable: false,
      defaultSort: true,
      filterEnabled: true,
    },
  ];

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnly]);


  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let records = await api.examAttendee.getExamsByAttendee(parseInt(userId));
      let otherExams = await api.examAttendee.getOtherExams(parseInt(userId));
      setBadges(records);
      records = records.filter(obj => {
        return obj.status === readOnly
      });
      records = records.filter(obj => {
        return obj.exam.active
      });
      setRecords(records);
      setOtherExams(otherExams);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }


  const statuses = {
    invitationAccepted: ExamAttendeeEnum.ACCEPTED_INVITATION,
    invited: ExamAttendeeEnum.INVITATION_SENT,
    passed: ExamAttendeeEnum.EXAM_PASSED,
    failed: ExamAttendeeEnum.EXAM_FAILED,
    paused: ExamAttendeeEnum.EXAM_PAUSED,
    started: ExamAttendeeEnum.EXAM_STARTED

  };

  function onTabsChange(activeKey: string) {
    //@ts-ignore
    setReadOnly(statuses[activeKey]);
  }

  function handleChange(
    pagination: TablePaginationConfig,
    filters: DataGridFiltersType,
    sorter: SorterResult<ExamAttendee> | SorterResult<ExamAttendee>[]
  ) {
    setParams(
      updateDataGridParams<ExamAttendee>(pagination, filters, sorter, columns)
    );
  }
  function handleChangeOther(
    pagination: TablePaginationConfig,
    filters: DataGridFiltersType,
    sorter: SorterResult<Exam> | SorterResult<Exam>[]
  ) {
    setParamsOther(
      updateDataGridParams<Exam>(pagination, filters, sorter, columnsOther)
    );
  }

  async function handleAccept(examId: number, userId: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.examTest.getAcceptInvitation(examId, userId);
      // @ts-ignore
      loadData();
      setLoading(FetchStateEnum.LOADED);
      SuccessNotification("Invitation accepted.");
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleApply(examId: number,) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.examTest.applyForExam(examId);
      // @ts-ignore
      loadData();
      setLoading(FetchStateEnum.LOADED);
      SuccessNotification("Successfully applied.");
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  const badgeCount:any = () => {
    let obj = {};
    for (let item in ExamAttendeeEnum) {
      //@ts-ignore
      obj[item] = badges.filter((obj) => obj.status === item).length
    }
    return obj;
  };

  const table = <DataGridComponent<ExamAttendee>
    bordered
    columns={columns}
    rowKey={(rec) => rec.id}
    dataSource={records}
    selectable={false}
    inlineEdit={false}
    loading={loading === FetchStateEnum.LOADING}
    onChange={handleChange}
    filters={params.filters}
    sort={sorter}
    pagination={params.pagination}
    scroll={{x: true}}
    RowActions={<ExamsCustomRowActionsComponent type={readOnly} onAccept={handleAccept}/>}
  />;
  return (
    <React.Fragment>
      <h1>Ispiti</h1>
      <Tabs onChange={(e) => onTabsChange(e)} defaultActiveKey="invited">
        <TabPane tab={
          <span>Invited ({badgeCount()[ExamAttendeeEnum.INVITATION_SENT]})</span>} key="invited">
          {table}
        </TabPane>
        <TabPane tab={
          <span>Izabrani ({badgeCount()[ExamAttendeeEnum.ACCEPTED_INVITATION]})</span>} key="invitationAccepted">
          {table}
        </TabPane>
        <TabPane tab={
          <span>Započeti ({badgeCount()[ExamAttendeeEnum.EXAM_STARTED]})</span>} key="started">
          {table}
        </TabPane>
        <TabPane tab={
          <span>Položeni ({badgeCount()[ExamAttendeeEnum.EXAM_PASSED]})</span>} key="passed">
          {table}
        </TabPane>
        <TabPane tab={
          <span>Neuspješni ({badgeCount()[ExamAttendeeEnum.EXAM_FAILED]})</span>} key="failed">
          {table}
        </TabPane>
        <TabPane tab={
          <span>Ostali ispiti ({otherExams.length})</span>} key="other">
          <DataGridComponent<Exam>
            bordered
            columns={columnsOther}
            rowKey={(rec) => rec.id}
            dataSource={otherExams}
            selectable={false}
            inlineEdit={false}
            loading={loading === FetchStateEnum.LOADING}
            onChange={handleChangeOther}
            filters={params.filters}
            sort={sorterOther}
            pagination={params.pagination}
            scroll={{x: true}}
            RowActions={<ExamsCustomRowActionsComponent type={undefined} handleApply={handleApply} />}
          />
        </TabPane>
      </Tabs>
    </React.Fragment>
  );
}

export default ExamsTab;
