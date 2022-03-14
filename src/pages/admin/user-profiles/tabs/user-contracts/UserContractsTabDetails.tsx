import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { Form, Input, Skeleton } from "antd";

import { api } from "../../../../../core/api";
import { Logger } from "../../../../../core/logger";
import { goBack } from "../../../../../core/Utils";
import { FetchStateEnum } from "../../../../../model/ui/enums/FetchStateEnum";
import { ApiParams } from "../../../../../model/ui/types/ApiParams";
import { SeminarFile } from "../../../../../model/domain/classes/SeminarFile";
import { UserSeminar } from "../../../../../model/domain/classes/UserSeminar";
import { SeminarUserTypeEnum } from "../../../../../model/domain/enums/SeminarUserTypeEnum";
import { detailsFormLayout } from "../../../../../shared/components/datagrid/DetailsFormLayout";
import {
  FailNotification,
  SuccessNotification,
} from "../../../../../shared/components/notifications/Notification";
import DefaultSpinner from "../../../../../shared/components/spinners/DefaultSpinner";
import NoDataComponent from "../../../../../shared/components/no-data/NoData";
import DataGridModalComponent from "../../../../../shared/components/datagrid/DataGridModal";
import FileUploadComponent from "../../../../../shared/components/file-upload/FileUpload";
import SelectComponent from "../../../../../shared/components/multiple-select/Select";

const { layout } = detailsFormLayout;

function UserContractTabDetails() {
  const [record, setRecord] = useState<SeminarFile>();
  const [seminars, setSeminar] = useState<Array<UserSeminar>>([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);
  const { params, url } = useRouteMatch<DetailsParams>();
  const userId = +params.id;
  let history = useHistory();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      setRecord(new SeminarFile())
      let seminars = await api.userProfile.getUserSeminars(userId);
      setSeminar(seminars.filter(sem => sem.type === SeminarUserTypeEnum.LECTURER))
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      Logger.error(error);
      FailNotification("Unable to load data.");
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function onFinish(rec: SeminarFile) {
    try {
      setActionInProgress(true);
      const { browserFile, ...updated}: SeminarFile = {...record, ...rec};
      if(browserFile?.file) {
        const data = new FormData();
        data.set('file', browserFile.file);
        let query: ApiParams = {
          name: browserFile.file.name,
        }
        if(updated.description)
          query.description = updated.description;
        if(updated.seminar?.id)
          query.seminar_id = updated.seminar.id;
        let response = await api.userProfile.createUserContract(userId, data, query);
        SuccessNotification("User contract created.")
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
      title={"Create contract"}
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
                label="Description" 
                name="description"
                rules={[{ required: true, message: "Provide description." }]}
              >
                <Input />
              </Form.Item>

              <Form.Item 
                label="Seminar" 
                name="seminar"
              >
                <SelectComponent
                  dropdownValues={seminars}
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
                />
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

export default UserContractTabDetails;
