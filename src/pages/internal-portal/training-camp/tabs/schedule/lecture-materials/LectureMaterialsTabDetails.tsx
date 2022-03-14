import React, { useState } from "react";
import { Form, Input } from "antd";

import { api } from "../../../../../../core/api";
import { Logger } from "../../../../../../core/logger";
import { ClassLectureFile } from "../../../../../../model/domain/classes/ClassLectureFile";

import FileUploadComponent, { BrowserFileType } from "../../../../../../shared/components/file-upload/FileUpload";
import { detailsFormLayout } from "../../../../../../shared/components/datagrid/DetailsFormLayout";
import DataGridModalComponent from "../../../../../../shared/components/datagrid/DataGridModal";
import { FailNotification, SuccessNotification } from "../../../../../../shared/components/notifications/Notification";
import DefaultSpinner from "../../../../../../shared/components/spinners/DefaultSpinner";
import { useRouteMatch } from "react-router-dom";

const { layout } = detailsFormLayout;

interface LectureMaterialsTabDetailsProps {
  record: ClassLectureFile;
  onOk(record: ClassLectureFile): void;
  onCancel(): void;
}

function LectureMaterialsTabDetails({
  record,
  onCancel,
  onOk
}: LectureMaterialsTabDetailsProps) {
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const { params } = useRouteMatch<ClassParams>();
  const lectureId = params.id;

  function getInitialValues(
    record: ClassLectureFile
  ): ClassLectureFile {
    return {
      ...record,
      browserFile:
        record.originalFilename ?
          {
            file: undefined,
            name: record.originalFilename,
            type: BrowserFileType.OTHER,
            url: api.classLectureMaterial.getFileUrl(record),
          }
          : undefined
    }
  }

  async function onFinish(rec: ClassLectureFile) {
    try {
      setActionInProgress(true);
      const { browserFile, ...updated }: ClassLectureFile = { ...record, ...rec };
      if (browserFile?.file) {
        const data = new FormData();
        data.set('file', browserFile.file);
        data.set('name', browserFile.file.name);
        data.set('description', updated.description || "");
        let response: ClassLectureFile;
        if (record.id) {
          response = await api.classLectureMaterial.update(lectureId, data);
          SuccessNotification("Lecture material changed.");
        }
        else {
          response = await api.classLectureMaterial.create(lectureId, data);
          SuccessNotification("Lecture material created.")
        }
        onOk(response);
      }
      setActionInProgress(false);
      onCancel();
    } catch (error) {
      FailNotification("Saving data error. Check the logs.");
      Logger.error(error);
      setActionInProgress(false);
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    FailNotification("Invalid data. Check the form.");
  };

  return (
    <DataGridModalComponent
      title={record.id ? "Edit material" : "Create material"}
      isLoading={actionInProgress}
      onClose={onCancel}
      maskClosable={false}
    >
      <div className="container">
        <div className="relative ov-hidden">
          <Form
            {...layout}
            id="detailsForm"
            initialValues={getInitialValues(record)}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Enter a description." }]}
            >
              <Input
                disabled={disabled}
              />
            </Form.Item>
            <Form.Item
              label="Select file"
              name="browserFile"
              valuePropName="file"
              rules={[{ required: true, message: "Choose a file." }]}
            >
              <FileUploadComponent
                multiple={false}
                onChange={() => setDisabled(false)}
              />
            </Form.Item>
          </Form>
          {actionInProgress && <DefaultSpinner />}
        </div>
      </div>
    </DataGridModalComponent>
  );
}

export default LectureMaterialsTabDetails;
