import React, {useEffect, useState} from "react";
import {useRouteMatch} from "react-router-dom";
import {TablePaginationConfig} from "antd/lib/table";

import {api} from "../../../../../core/api";
import {Logger} from "../../../../../core/logger";
import {defaultPaginationSort, updateDataGridParams,} from "../../../../../core/Utils";

import {ClassAttendeeMentorDiary} from "../../../../../model/domain/classes/ClassAttendeeMentorDiary";
import {FetchStateEnum} from "../../../../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult,
} from "../../../../../model/ui/types/DataGridTypes";

import DataGridComponent from "../../../../../shared/components/datagrid/DataGrid";
import DataGridActionsComponent from "../../../../../shared/components/datagrid/DataGridActions";
import DataGridRowActionsComponent from "../../../../../shared/components/datagrid/DataGridRowActions";
import {FailNotification, SuccessNotification,} from "../../../../../shared/components/notifications/Notification";
import {DataGridCellTypeEnum} from "../../../../../model/ui/enums/DataGridCellTypeEnum";
import {ApiParams} from "../../../../../model/ui/types/ApiParams";
import {Input} from 'antd';
import AddEvaluation from "./AddEvaluation";
import styles from './MentorshipTab.module.scss'
import EvaluationModal from "./EvaluationModal";

const moment = require("moment");

const {TextArea} = Input;

interface MentorshipDiaryTabProps {
  mentorId: string;
  locked: boolean;
  attendeeId?: number
}

function MentorshipDiaryTab({mentorId, locked, attendeeId}: MentorshipDiaryTabProps) {
  const [records, setRecords] = useState<Array<ClassAttendeeMentorDiary>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<ClassAttendeeMentorDiary>>(defaultPaginationSort());
  let {isExact} = useRouteMatch();
  const sorter = params.sorter as SorterResult<ClassAttendeeMentorDiary> | null;
  const [evaluate, setEvaluate] = useState<boolean>(false)
  const columns: Array<DataGridColumnType<ClassAttendeeMentorDiary>> = [
    {
      title: "Datum",
      dataIndex: "date",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.DATE,
      width: 160,
      fixed: "left",
    },
    {
      title: "Prisutan",
      dataIndex: "prisutan",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
      cellType: DataGridCellTypeEnum.CHECKBOX,
      width: 120,
      fixed: "left",
    },
    {
      title: "Metodologija",
      dataIndex: "metodologija",
      editable: true,
      width: 220,
      cellType: DataGridCellTypeEnum.TEXTAREA,
      render: (rec) => <TextArea placeholder={"textarea"} value={rec?.metodologija} autoSize/>
    },
    {
      title: "Napomena",
      dataIndex: "napomena",
      editable: true,
      width: 320,
    },
    {
      title: "Materijal",
      dataIndex: "nastavniMaterijal",
      editable: true,
      cellType: DataGridCellTypeEnum.TEXTAREA,
      width: 320,
    },
    {
      title: "Osjecaj eticnosti",
      dataIndex: "osjecajEticnosti",
      editable: true,
      cellType: DataGridCellTypeEnum.TEXTAREA,
      width: 320,
    },
    {
      title: "Osjecaj odgovornosti",
      dataIndex: "osjecajOdgovornosti",
      editable: true,
      cellType: DataGridCellTypeEnum.TEXTAREA,
      width: 320,
    },
    {
      title: "Period prakticne obuke",
      dataIndex: "periodPrakticneObuke",
      editable: true,
      cellType: DataGridCellTypeEnum.RANGE,
      width: 220,
    },
    {
      title: "Spos. za donosenje odluka",
      dataIndex: "sposobnostZaDonosenjeOdluka",
      editable: true,
      cellType: DataGridCellTypeEnum.TEXTAREA,
      width: 220,
    },
    {
      title: "Spos. za vodjenje postupka",
      dataIndex: "sposobnostZaVodjenjePostupka",
      editable: true,
      cellType: DataGridCellTypeEnum.TEXTAREA,
      width: 220,
    },
    {
      title: "Zainteresovanost",
      dataIndex: "zainteresovanost",
      editable: true,
      cellType: DataGridCellTypeEnum.TEXTAREA,
      width: 220,
    },
    {
      title: "Aktivnost",
      dataIndex: "aktivnost",
      editable: true,
      cellType: DataGridCellTypeEnum.TEXTAREA,
      width: 220,
    },
    {
      title: "Aktivnosti prakticnog dijela obuke",
      dataIndex: "aktivnostiPrakticnogDijelaObuke",
      editable: true,
      cellType: DataGridCellTypeEnum.TEXTAREA,
      width: 220,
    },
  ];

  useEffect(() => {
    isExact && loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExact]);
  useEffect(() => {
    isExact && loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaluate]);
  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      const apiParams: ApiParams = {
        "atendeeMentorId.equals": mentorId,
      };
      let records = await api.classAttendeeMentorDiary.getAll(apiParams);
      setRecords(records);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleCreate(): Promise<ClassAttendeeMentorDiary | null> {
    let response: ClassAttendeeMentorDiary | null = null;
    try {
      setLoading(FetchStateEnum.LOADING);
      let record = new ClassAttendeeMentorDiary();
      //@ts-ignore
      record.atendeeMentor = {id: +mentorId};
      response = await api.classAttendeeMentorDiary.create(record);
      setRecords([...records, response]);
      setParams(defaultPaginationSort());
    } catch (error) {
      FailNotification("Saving data error.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
      return response;
    }
  }
  async function handleUpdateAll(record: ClassAttendeeMentorDiary): Promise<void> {
    try {
      setLoading(FetchStateEnum.LOADING);
      record.atendeeMentor && await api.classAttendeeMentor.update(record.atendeeMentor);
      await loadData()
    } catch (error) {
      FailNotification("Saving data error.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }
  async function handleUpdate(record: ClassAttendeeMentorDiary, all?: boolean): Promise<void> {
    try {
      setLoading(FetchStateEnum.LOADING);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === record.id);
      const dateRange = moment(record.periodPrakticneObuke![0]).format('DD.MM.YYYY')
          + '-' + moment(record.periodPrakticneObuke![1]).format('DD.MM.YYYY');
      const updatedRecord: ClassAttendeeMentorDiary = {
        ...data[recordIndex],
        ...record,
        periodPrakticneObuke: dateRange
      };
      data[recordIndex] = await api.classAttendeeMentorDiary.update(updatedRecord);
      setRecords(data);
      !all && SuccessNotification("Mentorship diary changed.");
    } catch (error) {
      FailNotification("Saving data error.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  const handleOk = (values: any) => {
    const updatedMentorsEvaluation = records.map(record => {
      const desc= values.atendeeMentor.evaluationDescription
      const summary = values.atendeeMentor.evaluationSummary
      return {
        ...record,
        atendeeMentor: {
            ...record.atendeeMentor,
          evaluationDescription: desc,
          evaluationSummary: summary
        }
      }
    })
    console.log(updatedMentorsEvaluation)
    //@ts-ignore
    const promises = updatedMentorsEvaluation.map(record => handleUpdateAll(record))
    setEvaluate(false)
  }

  async function handleDelete(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.classAttendeeMentorDiary.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Mentorship diary deleted.");
    } catch (error) {
      FailNotification("Deleting error institucije.");
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
        await api.classAttendeeMentorDiary.delete(id);
        data.splice(recordIndex, 1);
      } catch (error) {
        FailNotification(`Deleting error ${data[recordIndex]?.id}.`);
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
          | SorterResult<ClassAttendeeMentorDiary>
          | SorterResult<ClassAttendeeMentorDiary>[]
  ) {
    setParams(
        updateDataGridParams<ClassAttendeeMentorDiary>(
            pagination,
            filters,
            sorter,
            columns
        )
    );
  }

  return (
      <>
        <DataGridComponent<ClassAttendeeMentorDiary>
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
            actionsColumn={{
              fixed: "right",
              width: 120,
            }}
            scroll={{x: 1500, y: 150}}
            Actions={
              <div className={styles.actions}>
                {!locked && (
                    <div className={styles.dataGrid}>
                      <DataGridActionsComponent
                          onCreate={handleCreate}
                          onDeleteSelected={handleDeleteSelected}
                      />
                    </div>
                )}
                <AddEvaluation handleEvaluate={() => setEvaluate(true)} disabled={records.length<1}/>
                {evaluate && <EvaluationModal isModalVisible={evaluate} handleCancel={() => setEvaluate(false)}
                                  data={records[0]}
                                  handleOk={handleOk}/>}
              </div>
            }
            RowActions={
              <>
                {!locked && (
                    <DataGridRowActionsComponent
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                    />
                )}

              </>
            }
        />
      </>
  );
}

export default MentorshipDiaryTab;
