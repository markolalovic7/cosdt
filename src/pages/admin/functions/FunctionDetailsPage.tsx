import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Form, Input, Skeleton } from "antd";

import { api } from "../../../core/api";
import { Logger } from "../../../core/logger";
import { goBack } from "../../../core/Utils";
import { AbstractAuditingEntity } from "../../../model/domain/classes/AbstractAuditingEntity";
import { ProfileFunction } from "../../../model/domain/classes/ProfileFunction";
import { FetchStateEnum } from "../../../model/ui/enums/FetchStateEnum";
import { detailsFormLayout } from "../../../shared/components/datagrid/DetailsFormLayout";
import {
  FailNotification,
  SuccessNotification,
} from "../../../shared/components/notifications/Notification";
import DefaultSpinner from "../../../shared/components/spinners/DefaultSpinner";
import NoDataComponent from "../../../shared/components/no-data/NoData";
import SystemInfoComponent from "../../../shared/components/system-info/SystemInfo";
import DataGridModalComponent from "../../../shared/components/datagrid/DataGridModal";

function FunctionDetailsPage() {
  const [record, setRecord] = useState<ProfileFunction>();
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
      let record = new ProfileFunction();
      if (id) {
        record = await api.profileFunction.get(id);
      }
      setRecord(record);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      Logger.error(error);
      FailNotification("Unable to load data.");
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function onFinish(rec: ProfileFunction) {
    try {
      setActionInProgress(true);
      const updatedRecord = { ...record, ...rec };
      let response;
      if (!id) {
        response = await api.profileFunction.create(updatedRecord);
        SuccessNotification("Funkcija createda.");
      } else {
        response = await api.profileFunction.update(updatedRecord);
        SuccessNotification("Funkcija changed.");
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
      title={id ? "Edit function" : "New function"}
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
                label="Name male"
                name="name"
                rules={[{ required: true, message: "Enter a name." }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Name female"
                name="namef"
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

export default FunctionDetailsPage;
