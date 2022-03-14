import React, {ReactElement, useEffect, useState} from "react";
import {useRouteMatch} from "react-router-dom";

import {Form, Input, Select, Skeleton, Button} from "antd";

import {api} from "../../../../core/api";
import {Logger} from "../../../../core/logger";
import {AbstractAuditingEntity} from "../../../../model/domain/classes/AbstractAuditingEntity";
import {Class} from "../../../../model/domain/classes/Class";
import {ClassTypeEnum} from "../../../../model/domain/enums/ClassTypeEnum";
import {FetchStateEnum} from "../../../../model/ui/enums/FetchStateEnum";
import {detailsFormLayout} from "../../../../shared/components/datagrid/DetailsFormLayout";
import {
  FailNotification,
  SuccessNotification,
} from "../../../../shared/components/notifications/Notification";
import DefaultSpinner from "../../../../shared/components/spinners/DefaultSpinner";
import NoDataComponent from "../../../../shared/components/no-data/NoData";
import SystemInfoComponent from "../../../../shared/components/system-info/SystemInfo";
import styles1 from "../../../../shared/components/datagrid/DataGrid.module.scss";
import {saveAs} from "file-saver";

const {tailLayout, layout} = detailsFormLayout;
const {Option} = Select;

interface SeminarsDetailsFormProps {
  actionInProgress: boolean;

  setActionInProgress(ip: boolean): void;

  onFinish?(): void;

  footer?: ReactElement;
}

function TrainingCamDetailsForm({
                                  actionInProgress,
                                  setActionInProgress,
                                  onFinish,
                                  footer,
                                }: SeminarsDetailsFormProps) {
  const [record, setRecord] = useState<Class>();
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const {params} = useRouteMatch<ClassParams>();
  const [form] = Form.useForm();

  const id = params.classId === "new" ? null : +params.classId; //ts issue; cast string to number with +;

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let record = new Class();
      if (id) {
        record = await api.class.get(id);
      }
      setRecord(record);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      Logger.error(error);
      FailNotification("Unable to load data.");
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleExportPractical() {
    try {
      setLoading(FetchStateEnum.LOADING);
      const data = await api.exportDiary.practical(params.classId);
      let blob = new Blob([data], {type: "application/zip"});
      saveAs(blob, "praktični dio.docx");
      SuccessNotification("Download started.");
    } catch (e) {
      FailNotification("Unable to download report.");
      Logger.error(e);
      throw e;
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }
  async function handleExportTheory() {
    try {
      setLoading(FetchStateEnum.LOADING);
      const data = await api.exportDiary.theory(+params.classId);
      let blob = new Blob([data], {type: "application/zip"});
      saveAs(blob, "teorijski dio.docx");
      SuccessNotification("Download started.");
    } catch (e) {
      FailNotification("Unable to download report.");
      Logger.error(e);
      throw e;
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }



  async function handleFinish(rec: Class) {
    try {
      setActionInProgress(true);
      let updatedRecord = {
        ...record,
        ...rec,
      };
      let response;
      if (!id) {
        response = await api.class.create(updatedRecord);
        SuccessNotification("Class created.");
      } else {
        response = await api.class.update(updatedRecord);
        SuccessNotification("Class changed.");
      }
      setActionInProgress(false);
      if (onFinish) onFinish();
      else {
        setRecord(response);
        form.setFieldsValue(response);
      }
    } catch (error) {
      setActionInProgress(false);
      FailNotification("Saving data error. Check the logs.");
      Logger.error(error);
    }
  }

  const handleFinishFailed = () => {
    FailNotification("Invalid data. Check the form.");
  };

  return (
    <div className="container">
      <div className="relative ov-hidden">
        {loading === FetchStateEnum.LOADING && <Skeleton active/>}
        {loading === FetchStateEnum.FAILED && <NoDataComponent/>}
        {loading === FetchStateEnum.LOADED && (
          <>
            <div className={styles1.dataGridActions} style={{justifyContent:'flex-end'}}>
              <div>
                <Button type="primary" className={styles1.dataGridActionsButton} onClick={() => handleExportPractical()}
                >Export Praktični</Button>
              </div>
              <div>
                <Button type="primary" className={styles1.dataGridActionsButton} onClick={() => handleExportTheory()}
                >Export Teorijski</Button>
              </div>
            </div>
            <fieldset disabled={record?.locked}>
              <Form
                {...layout}
                id="detailsForm"
                initialValues={record}
                onFinish={handleFinish}
                onFinishFailed={handleFinishFailed}
                form={form}
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
                <Form.Item
                  label="Type"
                  name="type"
                  rules={[{required: true, message: "Choose a type."}]}
                >
                  <Select
                    disabled={record?.locked}
                  >
                    <Option value={ClassTypeEnum.SUDIJE}>Sudije</Option>
                    <Option value={ClassTypeEnum.TUZIOCI}>Tužioci</Option>
                    <Option value={ClassTypeEnum.SUDIJE_I_TUZIOCI}>Sudije i Tužioci</Option>
                  </Select>
                </Form.Item>

                <SystemInfoComponent entity={record as AbstractAuditingEntity}/>
                {footer && <Form.Item {...tailLayout}>{footer}</Form.Item>}
              </Form>
            </fieldset>
          </>
        )}
        {actionInProgress && <DefaultSpinner/>}
      </div>
    </div>
  );
}

export default TrainingCamDetailsForm;
