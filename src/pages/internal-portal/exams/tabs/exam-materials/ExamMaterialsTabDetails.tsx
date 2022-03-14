import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { Form, Input, Skeleton } from "antd";

import { api } from "../../../../../core/api";
import { Logger } from "../../../../../core/logger";
import { goBack } from "../../../../../core/Utils";
import { FetchStateEnum } from "../../../../../model/ui/enums/FetchStateEnum";
import { FileUpload } from "../../../../../model/domain/classes/FileUpload";
import { detailsFormLayout } from "../../../../../shared/components/datagrid/DetailsFormLayout";
import {
  FailNotification,
  SuccessNotification,
} from "../../../../../shared/components/notifications/Notification";
import DefaultSpinner from "../../../../../shared/components/spinners/DefaultSpinner";
import NoDataComponent from "../../../../../shared/components/no-data/NoData";
import DataGridModalComponent from "../../../../../shared/components/datagrid/DataGridModal";
import FileUploadComponent from "../../../../../shared/components/file-upload/FileUpload";

const { layout } = detailsFormLayout;

function ExamMaterialsTabDetails() {
  const [record, setRecord] = useState<FileUpload>();
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);
  const { params, url } = useRouteMatch<ExamParams>();

  const examId = params.examId;
  let history = useHistory();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      setRecord(new FileUpload());
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      Logger.error(error);
      FailNotification("Unable to load data.");
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function onFinish(rec: FileUpload) {
    try {
      setActionInProgress(true);
      const { browserFile, ...updated }: FileUpload = { ...record, ...rec };
      if (browserFile?.file) {
        const data = new FormData();
        data.set("file", browserFile.file);
        data.set("name", browserFile.file.name);
        data.set("description", updated.description || "");
        let response = await api.examMaterial.create(examId, data);
        SuccessNotification("Exam material created.");
        setRecord(response);
      }
      setActionInProgress(false);
      closeModal();
    } catch (error) {
      setActionInProgress(false);
      FailNotification("Saving data error. Check the logs.");
      Logger.error(error);
    }
  }

  const onFinishFailed = () => {
    FailNotification("Invalid data. Check the form.");
  };

  const closeModal = () => {
    goBack(history, url);
  };

  return (
    <DataGridModalComponent
      title={"Create exam material"}
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
              <Form.Item label="Description" name="description">
                <Input />
              </Form.Item>

              <Form.Item
                label="Select file"
                name="browserFile"
                valuePropName="file"
                rules={[{ required: true, message: "Choose a file." }]}
              >
                <FileUploadComponent multiple={false} />
              </Form.Item>
            </Form>
          )}
          {actionInProgress && <DefaultSpinner />}
        </div>
        {loading === FetchStateEnum.FAILED && <NoDataComponent />}
      </div>
    </DataGridModalComponent>
  );
}

export default ExamMaterialsTabDetails;
