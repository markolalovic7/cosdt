import React, { useState } from "react";
import { Form, Input } from "antd";

import { api } from "../../../core/api";
import { Logger } from "../../../core/logger";
import { FailNotification, SuccessNotification } from "../../../shared/components/notifications/Notification";
import FileUploadComponent, { BrowserFileType } from "../../../shared/components/file-upload/FileUpload";
import { WordTemplate } from "../../../model/domain/classes/WordTemplate";
import { detailsFormLayout } from "../../../shared/components/datagrid/DetailsFormLayout";
import { ApiParams } from "../../../model/ui/types/ApiParams";
import DataGridModalComponent from "../../../shared/components/datagrid/DataGridModal";
import DefaultSpinner from "../../../shared/components/spinners/DefaultSpinner";

const { layout } = detailsFormLayout;

interface WordTemplatesDetailsPageProps {
  record: WordTemplate;
  onOk(record: WordTemplate): void;
  onCancel(): void;
}

function WordTemplatesDetailsPage({
  record,
  onCancel,
  onOk
}: WordTemplatesDetailsPageProps) {
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);

  function getInitialValues(
    record: WordTemplate
  ): WordTemplate {
    return {
      ...record,
      browserFile:
        record.originalFilename ?
          {
            file: undefined,
            name: record.originalFilename,
            type: BrowserFileType.OTHER,
            url: api.wordTemplate.getFileUrl(record),
          }
          : undefined
    }
  }

  async function onFinish(rec: WordTemplate) {
    try {
      setActionInProgress(true);
      const { browserFile, ...updated }: WordTemplate = { ...record, ...rec };
      if (browserFile?.file) {
        const data = new FormData();
        data.set('file', browserFile.file);
        let query: ApiParams = {
          name: browserFile.file.name,
        };
        if (updated.description)
          query.description = updated.description;
        onOk(await api.wordTemplate.update(record.entity, data, query));
        SuccessNotification("Template edited.")
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
      title={"Edit word template"}
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
                accept=".doc, .docx"
              />
            </Form.Item>
          </Form>
          {actionInProgress && <DefaultSpinner />}
        </div>
      </div>
    </DataGridModalComponent>
  );
}

export default WordTemplatesDetailsPage;
