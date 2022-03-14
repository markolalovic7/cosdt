import React, {useEffect,  useState} from "react";
import {useLocation, useRouteMatch} from "react-router-dom";
import {Button, Tabs} from "antd";
import {TablePaginationConfig} from "antd/lib/table";

import {api} from "../../../../../core/api";
import {Logger} from "../../../../../core/logger";
import {
  defaultPaginationSort,
  updateDataGridParams,
} from "../../../../../core/Utils";
import {ClassAttendeeMentor} from "../../../../../model/domain/classes/ClassAttendeeMentor";
import {FetchStateEnum} from "../../../../../model/ui/enums/FetchStateEnum";
import {
  DataGridColumnType,
  DataGridFiltersType,
  DataGridParamsType,
  SorterResult,
} from "../../../../../model/ui/types/DataGridTypes";
import DataGridComponent from "../../../../../shared/components/datagrid/DataGrid";
import {
  FailNotification,
} from "../../../../../shared/components/notifications/Notification";
import MentorshipDiaryTab from "./MentorshipDiaryTab";
import {RiFilterOffFill} from "react-icons/ri";

const {TabPane} = Tabs;

interface linkParam {
  tab: boolean,
  expand: number[];
  filters: any;
}

function MentorshipTab() {
  const location = useLocation();
  const tab = location.state as linkParam;
  const [records, setRecords] = useState<Array<ClassAttendeeMentor>>([]);
  const [readOnly, setReadOnly] = useState<boolean>(!!tab ? tab.tab : false);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [params, setParams] = useState<DataGridParamsType<ClassAttendeeMentor>>(
    defaultPaginationSort()
  );
  let {params: routeParams} = useRouteMatch<UserProfileParams>();
  let userId = routeParams.id;
  const sorter = params.sorter as SorterResult<ClassAttendeeMentor> | null;



  const columns: Array<DataGridColumnType<ClassAttendeeMentor>> = [
    {
      title: "Ime",
      dataIndex: "firstName",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
    },
    {
      title: "Prezime",
      dataIndex: "lastName",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
    },
    {
      title: "Klasa",
      dataIndex: "klasName",
      editable: true,
      defaultSort: true,
      filterEnabled: true,
    },
    {
      title: "Tip klase",
      dataIndex: "klassType",
      editable: false,
      defaultSort: true,
      filterEnabled: true,
    },
  ];

  useEffect(() => {
    !!tab &&
    setParams({...params, filters: tab.filters});
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnly]);


  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let records = await api.classAttendeeMentorDiary.getMentorships(userId, readOnly);
      setRecords(records);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    } finally {
    }
  }

  function onTabsChange(activeKey: string) {
    setReadOnly(activeKey === 'finished')
  }

  function handleChange(
    pagination: TablePaginationConfig,
    filters: DataGridFiltersType,
    sorter: SorterResult<ClassAttendeeMentor> | SorterResult<ClassAttendeeMentor>[]
  ) {
    setParams(
      updateDataGridParams<ClassAttendeeMentor>(
        pagination,
        filters,
        sorter,
        columns
      )
    );
  }

  const operations = <div>Table is filtered <Button onClick={() => {
    setParams({...params, filters: null})
  }}
    icon={<RiFilterOffFill/>}
  >Clear filters</Button></div>;

  return (
    <React.Fragment>
      <h1>Mentorstva</h1>
      <Tabs
        onChange={onTabsChange}
        defaultActiveKey={tab === undefined ? 'active' : tab.tab ? 'finished' : 'active'}
        tabBarExtraContent={!!params.filters && operations}
      >
        <TabPane
          tab={
            <span>
              Aktivna
            </span>
          }
          key="active"
        >
          <DataGridComponent<ClassAttendeeMentor>
            bordered
            columns={columns}
            rowKey={(rec) => rec.id}
            dataSource={records}
            selectable={false}
            loading={loading === FetchStateEnum.LOADING}
            onChange={handleChange}
            filters={params.filters}
            sort={sorter}
            pagination={params.pagination}
            tableLayout={'fixed'}
            defaultExpandedRowKeys={!!tab && tab.expand}
            expandable={{
              expandedRowRender: (
                record
              ) => (
                <div id={`${record.id}`} className={"subcategory-wrap"}>
                  <MentorshipDiaryTab mentorId={record.id} attendeeId={record.profileId} locked={false}/>
                </div>
              ),
            }}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              Završena
            </span>
          }
          key="finished"
        >
          <DataGridComponent<ClassAttendeeMentor>
            bordered
            columns={columns}
            rowKey={(rec) => rec.id}
            dataSource={records}
            selectable={false}
            loading={loading === FetchStateEnum.LOADING}
            onChange={handleChange}
            filters={params.filters}
            sort={sorter}
            pagination={params.pagination}
            tableLayout={'fixed'}
            defaultExpandedRowKeys={!!tab && tab.expand}
            expandable={{
              expandedRowRender: (
                record
              ) => (
                <div className={"subcategory-wrap"}>
                  <MentorshipDiaryTab mentorId={record.id} locked={true}/>
                </div>
              ),
            }}
          />
        </TabPane>
      </Tabs>
    </React.Fragment>
  );
}

export default MentorshipTab;
