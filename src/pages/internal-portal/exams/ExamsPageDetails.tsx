import React, { useEffect } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { Tabs } from "antd";
import {
  SolutionOutlined,
  RightSquareOutlined,
  FileOutlined
} from "@ant-design/icons";

import styles from "./ExamsPage.module.scss";

import GeneralPropertiesTab from "./tabs/GeneralPropertiesTab";
import AttendeesTab from "./tabs/exam-attendees/ExamAttendeesTab";
import ExamMaterialsTab from "./tabs/exam-materials/ExamMaterialsTab";

const { TabPane } = Tabs;

interface ExamsPageProps {
  tabPath: string;
}

function ExamsPageDetails({ tabPath }: ExamsPageProps) {
  const { params } = useRouteMatch<ExamParams>();
  let history = useHistory();

  useEffect(() => {
    if (!params.tab) onTabsChange('general');
  });

  function onTabsChange(key: string) {
    history.replace(
      `${tabPath}/${params.examId}/${params.examName}/${key}`
    );
  }

  return (
    <div className={styles.formContainer}>
      <h1>
        Exam Details
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
                <SolutionOutlined />
                Attendees
              </span>
            }
            key="attendees"
          >
            <AttendeesTab />
          </TabPane>
          <TabPane
            tab={
              <span>
                <FileOutlined />
                Materials
              </span>
            }
            key="materials"
          >
            <ExamMaterialsTab />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default ExamsPageDetails;
