import React, { useEffect, useState } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";

import { Button, Tabs, Modal } from "antd";
import {
  SolutionOutlined,
  RightSquareOutlined,
  LaptopOutlined,
  FileDoneOutlined,
  LockOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import styles from "./SeminarsPage.module.scss";

import { api } from "../../../core/api";
import { Logger } from "../../../core/logger";

import GeneralPropertiesTab from "./tabs/GeneralPropertiesTab";
import AgendaTab from "./tabs/agenda/AgendaTab";
import AttendeesTab from "./tabs/attendees/AttendeesTab";
import SupportingMaterialsTab from "./tabs/supporting-materials/SupportingMaterialsTab";
import ContractTab from "./tabs/contract/ContractTab";
import CostSheetTab from "./tabs/cost-sheet/CostSheetTab";
import { Seminar } from "../../../model/domain/classes/Seminar";
import { FetchStateEnum } from "../../../model/ui/enums/FetchStateEnum";
import {
  FailNotification,
  SuccessNotification,
} from "../../../shared/components/notifications/Notification";
import LecturersTab from "./tabs/lecturers/LecturersTab";
import {saveAs} from "file-saver";

const { TabPane } = Tabs;

interface SeminarPageProps {
  tabPath: string;
}

function SeminarsPageDetails({ tabPath }: SeminarPageProps) {
  const { params } = useRouteMatch<SeminarParams>();
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  let history = useHistory();
  const seminarId = +params.seminarId;
  const [seminar, setSeminar] = useState<Seminar>();

  useEffect(() => {
    //isExact &&
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(!params.tab) onTabsChange('general');
  });

  function onTabsChange(key: string) {
    history.replace(
      `${tabPath}/${params.seminarId}/${params.seminarName}/${key}`
    );
  }

  async function loadData() {
    try {
      let record;
      if (seminarId) {
        record = await api.seminar.get(seminarId);
      }
      setSeminar(record);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }
  async function getReport(id: number, name: string) {
    try {
      //setLoading(FetchStateEnum.LOADING);
      const data = await api.takeSurvey.getEvaluationReport(id);
      let blob = new Blob([data], { type: "application/docx" });
      saveAs(blob, `${name}.docx`);
      SuccessNotification("Download started.");
    } catch (error) {
      FailNotification("Download error.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }
  async function handleLock() {
    Modal.confirm({
      title: "Lock this seminar",
      content: "Are you sure?",
      onCancel: () => {},
      onOk: async () => {
        setLoading(FetchStateEnum.LOADING);
        if (seminarId) {
          let response = await api.seminar.lock(seminarId);
          setSeminar(response);
        }

        SuccessNotification(`Seminar locked`);
      },
      okText: "Yes",
      cancelText: "No",
    });
  }

  return (
    <div className={styles.formContainer}>
      <h1>
        Seminar Detail{" "}
        {seminar?.locked ? (
          <div className={styles.headerElements}>
          <div>
            <InfoCircleOutlined /> <b>Seminar locked</b>
          </div>
          <Button
          type="primary"
          onClick={() => {
            getReport(seminarId, "report")
        }}
          >
          Evaluation report
          </Button>
          </div>
        ) : (
          <div>
            <Button
              //loading={seminar?.locked ? true : false}
              type="primary"
              icon={<LockOutlined />}
              onClick={handleLock}
            >
              {" "}
              Lock seminar
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
                <LaptopOutlined />
                Agenda
              </span>
            }
            key="agenda"
          >
            <AgendaTab />
          </TabPane>
          <TabPane
            tab={
              <span>
                <SolutionOutlined />
                Attendees
              </span>
            }
            key="attendees"
          >
            {seminar && <AttendeesTab seminar={seminar} />}
          </TabPane>
          <TabPane
            tab={
              <span>
                <SolutionOutlined />
                Lecturers
              </span>
            }
            key="lecturers"
          >
            {seminar && <LecturersTab seminar={seminar} />}
          </TabPane>
          <TabPane
            tab={
              <span>
                <FileDoneOutlined />
                Supporting materials
              </span>
            }
            key="supporting-materials"
          >
            <SupportingMaterialsTab />
          </TabPane>
          <TabPane
            tab={
              <span>
                <FileDoneOutlined />
                Contracts
              </span>
            }
            key="contracts"
          >
            <ContractTab />
          </TabPane>
          <TabPane
            tab={
              <span>
                <FileDoneOutlined />
                Cost sheet
              </span>
            }
            key="cost-sheet"
          >
            <CostSheetTab />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default SeminarsPageDetails;
