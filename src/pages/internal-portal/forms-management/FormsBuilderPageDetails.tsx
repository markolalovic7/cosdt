import React, {useEffect, useState} from "react";
import {useHistory, useRouteMatch} from "react-router-dom";

import {Button, Col, Form, Input, Row, Skeleton, Switch} from "antd";
import styles from "./SurveyForm.module.scss";

import {Logger} from "../../../core/logger";
import {goBack} from "../../../core/Utils";
import {FetchStateEnum} from "../../../model/ui/enums/FetchStateEnum";
import {detailsFormLayout} from "../../../shared/components/datagrid/DetailsFormLayout";
import {
  FailNotification,
  SuccessNotification,
} from "../../../shared/components/notifications/Notification";
import DefaultSpinner from "../../../shared/components/spinners/DefaultSpinner";
import NoDataComponent from "../../../shared/components/no-data/NoData";
import {AbstractAuditingEntity} from "../../../model/domain/classes/AbstractAuditingEntity";
import SystemInfoComponent from "../../../shared/components/system-info/SystemInfo";
import FormSurvey from "../../../model/domain/classes/FormSurvey";
import {api} from "../../../core/api";
import DragSortingTable from "./survey-builder/SortableTable";


function FormsBuilderPageDetails() {
  const [record, setRecord] = useState<FormSurvey>();
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);
  const {params} = useRouteMatch<DetailsParams>();
  const [paginated, setPaginated] = useState<boolean|undefined>(undefined);

  const id = params.id === "new" ? null : +params.id; //ts issue; cast string to number with +;
  const {layout} = detailsFormLayout;
  let {url} = useRouteMatch();
  let history = useHistory();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let record = new FormSurvey();
      if (id) {
        record = await api.survey.get(id);
        // @ts-ignore
        record.questions.sort(function(a, b) {
          // @ts-ignore
          return parseFloat(a.order) - parseFloat(b.order);
        })
      }
      setRecord(record);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      Logger.error(error);
      FailNotification("Unable to load data.");
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function onFinish(rec: FormSurvey) {
    try {
      setActionInProgress(true);
      const updatedRecord = {...record, ...rec};
      let response = updatedRecord;
      if (!id) {
        await api.survey.create(updatedRecord);
        SuccessNotification("Form created.");
      } else {
        await api.survey.update(response);
        SuccessNotification("Form changed.");
      }
      setRecord(response);
      setActionInProgress(false);
      closeModal();
    } catch (error) {
      setActionInProgress(false);
      FailNotification("Saving data error. Check the logs.");
      Logger.error(error);
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    FailNotification("Invalid data. Check the form." + errorInfo);
  };

  const closeModal = () => {
    goBack(history, url);
  };
  return (
    <div
      //title={id ? "Edit survey form" : "Create survey form"}
      // isLoading={actionInProgress}
      // onClose={closeModal}
      className={styles.surveyFormSingle}
    >
      <h1>{id ? "Edit exam form" : "Create exam form"}</h1>
      <div>
        <div className="relative ov-hidden">
          {loading === FetchStateEnum.LOADING && <Skeleton active/>}
          {loading === FetchStateEnum.LOADED && (
            <Form
              {...layout}
              id="detailsForm"
              className={styles.surveyForm}
              initialValues={record}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{required: true, message: "Enter a name."}]}
              >
                <Input/>
              </Form.Item>

              <Form.Item label="Description" name="description">
                <Input/>
              </Form.Item>
              <div style={{display: "flex"}}>
                <Form.Item label="Type" name="pagination" labelCol={{span: 12}}
                           wrapperCol={{span: 1}}
                           style={{flex: 1}}>
                  <Switch
                    defaultChecked={record?.pagination}
                    checkedChildren="Paginated"
                    unCheckedChildren="Scrollable"
                    onChange={() => setPaginated(paginated === undefined ? !record?.pagination : !paginated)}
                  />
                </Form.Item>
                <Form.Item label="Estimated time for completion" name="estimatedTime"
                           labelCol={{span: 10}}
                           wrapperCol={{span: 12}}
                           style={{flex: 1}}>
                  <Input suffix={"minutes"} style={{width: "100px"}}/>
                </Form.Item>
              </div>
              <br/>
              <Form.Item label="Questions" name="questions">
                <DragSortingTable paginated={paginated!==undefined ? paginated : record?.pagination}/>
              </Form.Item>
              <SystemInfoComponent entity={record as AbstractAuditingEntity}/>
              <Row>
                <Col offset={6} span={16}>
                  <div className={"form-footer"} style={{textAlign: "right"}}>
                    <Button
                      key="backButton"
                      onClick={closeModal}
                      style={{marginRight: "10px"}}
                    >
                      Close
                    </Button>
                    <Button
                      form="detailsForm"
                      key="submit"
                      type="primary"
                      htmlType="submit"
                      //loading={isLoading}
                    >
                      Save
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          )}

          {actionInProgress && <DefaultSpinner/>}
        </div>
        {loading === FetchStateEnum.FAILED && <NoDataComponent/>}
      </div>
    </div>
  );
}

export default FormsBuilderPageDetails;
