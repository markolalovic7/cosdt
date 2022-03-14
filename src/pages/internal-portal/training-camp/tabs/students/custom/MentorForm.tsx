import React, { ReactElement, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";

import { DatePicker, Form, Input, Skeleton } from "antd";
import { api } from "../../../../../../core/api";
import { Logger } from "../../../../../../core/logger";
import { AbstractAuditingEntity } from "../../../../../../model/domain/classes/AbstractAuditingEntity";
import { FetchStateEnum } from "../../../../../../model/ui/enums/FetchStateEnum";
import { detailsFormLayout } from "../../../../../../shared/components/datagrid/DetailsFormLayout";
import {
  FailNotification,
} from "../../../../../../shared/components/notifications/Notification";
import DefaultSpinner from "../../../../../../shared/components/spinners/DefaultSpinner";
import NoDataComponent from "../../../../../../shared/components/no-data/NoData";
import SystemInfoComponent from "../../../../../../shared/components/system-info/SystemInfo";
import { Mentor } from "../../../../../../model/domain/classes/Mentor";
import UserPickerComponent from "../../../../../../shared/components/user-picker/UserPicker";
import { ClassAttendee } from "../../../../../../model/domain/classes/ClassAttendee";

const { tailLayout, layout } = detailsFormLayout;


interface MentorsDetailsFormProps {
  actionInProgress: boolean;

  setActionInProgress(ip: boolean): void;

  onCreate(rec: Mentor): Promise<void>

  onFinish?(): void;

  footer?: ReactElement;
  attendee?: ClassAttendee
}

function MentorsDetailsForm({
  actionInProgress,
  onFinish,
  onCreate,
  footer,
  attendee,
}: MentorsDetailsFormProps) {
  const [record, setRecord] = useState<Mentor>();
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const { params } = useRouteMatch<ClassParams>();
  const [form] = Form.useForm();

  const id = params.classId === "new" ? null : +params.classId; //ts issue; cast string to number with +;

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let record = new Mentor();
      record.atendee = attendee;
      if (id) {
        record = await api.classAttendeeMentor.get(id);
      }
      setRecord(record);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      Logger.error(error);
      FailNotification("Unable to load data.");
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleFinish(rec: Mentor) {
    try {
      if (onFinish) onFinish();
      await onCreate(rec)
    } catch (e) {

    }
  }

  const handleFinishFailed = () => {
    FailNotification("Invalid data. Check the form.");
  };

  return (
    <div className="container">
      <div className="relative ov-hidden">
        {loading === FetchStateEnum.LOADING && <Skeleton active />}
        {loading === FetchStateEnum.FAILED && <NoDataComponent />}
        {loading === FetchStateEnum.LOADED && (
          <Form
            {...layout}
            id="detailsForm"
            initialValues={record}
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
            form={form}
          >
            <Form.Item
              label="Mentor"
              name="mentor"
              rules={[{ required: true, message: "Pick a mentor." }]}
            >
              <UserPickerComponent />
            </Form.Item>
            <Form.Item label="EValuation description" name="evaluationDescription">
              <Input />
            </Form.Item>
            <Form.Item label="Evaluation summary" name="evaluationSummary">
              <Input />
            </Form.Item>
            <Form.Item label="Odluka o izboru kandidata" name="odlukaOIzboruKandidataBr">
              <Input />
            </Form.Item>
            <Form.Item label="Odluka o izboru kandidata datum" name="odlukaOIzboruKandidataDatum">
              <DatePicker />
            </Form.Item>
            <Form.Item label="Odluka o određivanju" name="odlukaOOdredjivanjuBr">
              <Input />
            </Form.Item>
            <Form.Item label="Odluka o određivanju datum" name="odlukaOOdredjivanjuDatum">
              <DatePicker />
            </Form.Item>
            <Form.Item label="Odluka o određivanju mentora" name="odlukaOOdredjivanjuMentoraBr">
              <Input />
            </Form.Item>
            <Form.Item label="Odluka o iodređivanju mentora datum" name="odlukaOOdredjivanjuMentoraDatum">
              <DatePicker />
            </Form.Item>
            <Form.Item
              label={"Početak"}
              name={"start"}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              label={"Kraj"}
              name={"end"}
            >
              <DatePicker />
            </Form.Item>
            <SystemInfoComponent entity={record as AbstractAuditingEntity} />
            {footer && <Form.Item {...tailLayout}>{footer}</Form.Item>}
          </Form>
        )}
        {actionInProgress && <DefaultSpinner />}
      </div>
    </div>
  );
}

export default MentorsDetailsForm;
