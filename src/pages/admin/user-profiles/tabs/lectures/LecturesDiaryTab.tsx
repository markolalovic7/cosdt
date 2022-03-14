import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Modal } from "antd";

import { api } from "../../../../../core/api";
import { Logger } from "../../../../../core/logger";
import { goBack } from "../../../../../core/Utils";

import { FetchStateEnum } from "../../../../../model/ui/enums/FetchStateEnum";
import { FailNotification, SuccessNotification } from "../../../../../shared/components/notifications/Notification";
import DiaryLecturerTab from "./DiaryLecturerTab";
import {TheoryDiary} from "../../../../../model/domain/classes/TheoryDiary";


function LecturesDiaryTab() {
  const [records, setRecords] = useState<Array<TheoryDiary>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  let { url, isExact, params } = useRouteMatch<UserProfileParams>();
  const history = useHistory();
  const lectureId = +params.lectureId;

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExact]);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let records = (await api.classLectureDiary.getAll(lectureId));
      setRecords(records);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleOk(): Promise<void> {
    try {
      setLoading(FetchStateEnum.LOADING);
      let response = await api.classLectureDiary.update(lectureId, records);
      setRecords(response);
      SuccessNotification("Lecture diary changed.");
      setLoading(FetchStateEnum.LOADED);
      handleCancel();
    } catch (error) {
      FailNotification("Saving data error.");
      setLoading(FetchStateEnum.FAILED);
      Logger.error(error);
    }
  }

  async function handleCancel() {
    goBack(history, url, 1);
  }

  return (
    <Modal
      title={"Lecture diary"}
      visible={true}
      closable={true}
      maskClosable={false}
      className="bigModal"
      okText="Save"
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading === FetchStateEnum.LOADING}
    >
      <DiaryLecturerTab updateRecords={(rec)=>setRecords(rec)}/>
    </Modal>
  );
}

export default LecturesDiaryTab;
