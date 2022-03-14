import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import {Button, Modal, Tabs} from "antd";
import {
  RightSquareOutlined,
  SolutionOutlined,
  ScheduleOutlined
} from "@ant-design/icons";
import styles from "../seminars/SeminarsPage.module.scss";

import { api } from "../../../core/api";
import { Logger } from "../../../core/logger";
import { FetchStateEnum } from "../../../model/ui/enums/FetchStateEnum";
import {FailNotification, SuccessNotification} from "../../../shared/components/notifications/Notification";
import { Class } from "../../../model/domain/classes/Class";
import GeneralPropertiesTab from "../training-camp/tabs/GeneralPropertiesTab";
import ClassAttendeesTab from "./tabs/students/StudentsTab";
import ScheduleTab from "./tabs/schedule/ScheduleTab";
import {InfoCircleOutlined, LockOutlined, UnlockOutlined} from "@ant-design/icons/lib";

const { TabPane } = Tabs;

interface TrainingCampPageProps {
  tabPath: string;
}

function TrainingCampPageDetails({ tabPath }: TrainingCampPageProps) {
  const { params } = useRouteMatch<ClassParams>();
  const [record, setRecord] = useState<Class>();
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);

  let history = useHistory();
  const id = params.classId === "new" ? null : +params.classId; //ts issue; cast string to number with +;

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!params.tab) onTabsChange('general');
  });

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let record = new Class();
      if (id) {
        record = await api.class.get(id);
      }
      setRecord(record);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      Logger.error(error);
      FailNotification("Unable to load data.");
      setLoading(FetchStateEnum.FAILED);
    }
  }
  async function handleLock(val: boolean) {
    Modal.confirm({
      title: val ? "Lock this class" : "Unlock this class",
      content: "Are you sure?",
      onCancel: () => {},
      onOk: async () => {
        setLoading(FetchStateEnum.LOADING);
        if (record?.id) {
          let response = await api.class.update({...record, locked: val});
          setRecord(response);
        }

        SuccessNotification(val ? `Class locked` : 'Class unlocked');
      },
      okText: "Yes",
      cancelText: "No",
    });
  }
  function onTabsChange(key: string) {
    history.replace(`${tabPath}/${params.classId}/${params.className}/${key}`);
  }

  return (
    <div className={styles.formContainer}>
      <h1>{record?.name}
      {record?.locked ? (
        <div className={styles.headerElements}>
          <div>
            <InfoCircleOutlined /> <b>Class locked</b>
          </div>
          <Button
            //loading={seminar?.locked ? true : false}
            type="primary"
            icon={<UnlockOutlined />}
            onClick={()=>handleLock(false)}
          >
            {" "}
            Unlock class
          </Button>
        </div>
      ) : (
        <div>
          <Button
            //loading={seminar?.locked ? true : false}
            type="primary"
            icon={<LockOutlined />}
            onClick={()=>handleLock(true)}
          >
            {" "}
            Lock class
          </Button>
        </div>
      )}
      </h1>
      <div className={styles.tabsContainer}>
        <Tabs
          activeKey={params.tab}
          tabPosition="left"
          onChange={onTabsChange}
          destroyInactiveTabPane={true}
        >
          <TabPane
            tab={
              <span>
                <RightSquareOutlined />
                General
              </span>
            }
            key="general"
          >
            <GeneralPropertiesTab />
          </TabPane>
          <TabPane
            tab={
              <span>
                <ScheduleOutlined />
                Schedule
              </span>
            }
            key="schedule"
          >
            <ScheduleTab
              editable={!record?.locked}
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <SolutionOutlined />
                Students
              </span>
            }
            key="students"
          >
            {record && <ClassAttendeesTab
                editable={!record.locked}
                classRec={record} />}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default TrainingCampPageDetails;
