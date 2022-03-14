import React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Tabs } from "antd";
import {
  SolutionOutlined,
  RightSquareOutlined,
  LaptopOutlined,
  FileDoneOutlined,
  BankOutlined,
  BookOutlined,
  TeamOutlined
} from "@ant-design/icons";

import styles from "./UserProfilesPage.module.scss";

import GeneralPropertiesTab from "./tabs/GeneralPropertiesTab";
import UserInstitutionsTab from "./tabs/UserInstitutionsTab";
import UserSeminarsAttendanceTab from "./tabs/seminar-attendance/UserSeminarsAttendanceTab";
import UserSeminarsLecturesTab from "./tabs/seminar-lectures/UserSeminarsLecturesTab";
import UserContractsTab from "./tabs/user-contracts/UserContractsTab";
import MentorshipTab from "./tabs/mentorship/MentorshipTab";
import LecturesTab from "./tabs/lectures/LecturesTab";
import ExamsTab from "./tabs/exams/ExamsTab";

const { TabPane } = Tabs;

interface UserProfileDetailsPageProps {
  tabPath: string;
}

function UserProfileDetailsPage({ tabPath }: UserProfileDetailsPageProps) {
  const { params } = useRouteMatch<UserProfileParams>();
  let history = useHistory();
  const activeKey = params.tab;

  function onTabsChange(key: string) {
    history.replace(`${tabPath}/${params.id}/${params.userName}/${key}`);
  }

  return (
    <div className={styles.formContainer}>
      <h1>Korisnički profil</h1>
      <div className={styles.tabsContainer}>
        <Tabs
          activeKey={activeKey}
          tabPosition="left"
          onChange={onTabsChange}
          destroyInactiveTabPane={true}
          defaultActiveKey='general'
        >
          <TabPane
            tab={
              <span>
                <RightSquareOutlined />
                Osnovne informacije
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
                Prisustvo seminarima
              </span>
            }
            key="attendance"
          >
            <UserSeminarsAttendanceTab />
          </TabPane>
          <TabPane
            tab={
              <span>
                <LaptopOutlined />
                Predavanja na seminarima
              </span>
            }
            key="seminar-lectures"
          >
            <UserSeminarsLecturesTab />
          </TabPane>
          <TabPane
            tab={
              <span>
                <TeamOutlined />
                Moja mentorstva
              </span>
            }
            key="mentorship"
          >
            <MentorshipTab />
          </TabPane>
          <TabPane
            tab={
              <span>
                <BookOutlined />
                Predavanjanja za Inicijalne obuke
              </span>
            }
            key="lectures"
          >
            <LecturesTab />
          </TabPane>
          <TabPane
            tab={
              <span>
                <SolutionOutlined />
                eLearning
              </span>
            }
            key="elearning"
          >
            <ExamsTab />
          </TabPane>
          <TabPane
            tab={
              <span>
                <BankOutlined />
                Institucije
              </span>
            }
            key="institutions"
          >
            <UserInstitutionsTab />
          </TabPane>
          <TabPane
            tab={
              <span>
                <FileDoneOutlined />
                Ugovori
              </span>
            }
            key="contracts"
          >
            <UserContractsTab />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default UserProfileDetailsPage;
