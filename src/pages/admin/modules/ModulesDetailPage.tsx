import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Form, Input, Skeleton } from "antd";

import { api } from "../../../core/api";
import { Logger } from "../../../core/logger";
import { goBack } from "../../../core/Utils";
import { FetchStateEnum } from "../../../model/ui/enums/FetchStateEnum";
import { detailsFormLayout } from "../../../shared/components/datagrid/DetailsFormLayout";
import {
  FailNotification,
  SuccessNotification,
} from "../../../shared/components/notifications/Notification";
import DefaultSpinner from "../../../shared/components/spinners/DefaultSpinner";
import NoDataComponent from "../../../shared/components/no-data/NoData";
import SystemInfoComponent from "../../../shared/components/system-info/SystemInfo";
import { AbstractAuditingEntity } from "../../../model/domain/classes/AbstractAuditingEntity";
import DataGridModalComponent from "../../../shared/components/datagrid/DataGridModal";
import { ClassModule } from "../../../model/domain/classes/ClassModule";

function ModulesDetailPage() {
  const [record, setRecord] = useState<ClassModule>();
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);
  const { params } = useRouteMatch<DetailsParams>();

  const id = params.id === "new" ? null : +params.id; //ts issue; cast string to number with +;
  const { layout } = detailsFormLayout;
  let { url } = useRouteMatch();
  let history = useHistory();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let record = new ClassModule();
      if (id) {
        record = await api.classModule.get(id);
      }
      setRecord(record);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      Logger.error(error);
      FailNotification("Unable to load data.");
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function onFinish(rec: ClassModule) {
    try {
      setActionInProgress(true);
      const updatedRecord = { ...record, ...rec };
      let response;
      if (!id) {
        response = await api.classModule.create(updatedRecord);
        SuccessNotification("Module created.");
      } else {
        response = await api.classModule.update(updatedRecord);
        SuccessNotification("Module changed.");
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
    FailNotification("Invalid data. Check the form.");
  };

  const closeModal = () => {
    goBack(history, url);
  };

  return (
    <DataGridModalComponent
      title={id ? "Edit Module" : "New Module"}
      isLoading={actionInProgress}
      onClose={closeModal}
    >
      <div className="container">
        <div className="relative ov-hidden">
          {loading === FetchStateEnum.LOADING && <Skeleton active />}
          {loading === FetchStateEnum.LOADED && (
            <Form
              {...layout}
              id="detailsForm"
              initialValues={record}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Enter a name." }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Description" name="description">
                <Input />
              </Form.Item>

              <SystemInfoComponent entity={record as AbstractAuditingEntity} />
            </Form>
          )}
          {actionInProgress && <DefaultSpinner />}
        </div>
        {loading === FetchStateEnum.FAILED && <NoDataComponent />}
      </div>
    </DataGridModalComponent>
  );
}

export default ModulesDetailPage;
