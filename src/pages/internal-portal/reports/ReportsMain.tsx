import React, { useEffect } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";

import {Tabs } from "antd";
import {
  RightSquareOutlined,
  LaptopOutlined,

} from "@ant-design/icons";


import ReportsPage from "./tabs/ReportsPage";
import SeminarsSearchPage from "./tabs/SeminarSearch";

const { TabPane } = Tabs;



function ReportsMain() {
  const { params } = useRouteMatch<SeminarParams>();

  useEffect(() => {
    //isExact &&
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 /* useEffect(() => {
    if(!params.tab) onTabsChange('seminarSearch');
  });
*/
 /* function onTabsChange(key: string) {
    history.replace(
      `${tabPath}`
    );
  }*/


  return (
    <div>
      <h1>
        Reports{" "}
      </h1>
      <div>
        <Tabs
          activeKey={params.tab}
          tabPosition="left"
         // onChange={onTabsChange}
          destroyInactiveTabPane={true}
        >
          <TabPane
            tab={
              <span>
                <RightSquareOutlined />
                Pretraga seminara
              </span>
            }
            key="seminarSearch"
          >
            <SeminarsSearchPage/>
          </TabPane>
          <TabPane
            tab={
              <span>
                <LaptopOutlined />
                Ostalo
              </span>
            }
            key="Other"
          >
            <ReportsPage />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default ReportsMain;
