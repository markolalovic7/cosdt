import React, {useEffect, useState} from "react";
import {useHistory, useRouteMatch} from "react-router-dom";
import moment from "moment";
import {Form, Col, Input, Row, Button, Skeleton, DatePicker} from "antd";
import styles from "./Agenda.module.scss";
import {api} from "../../../../../core/api";
import {Logger} from "../../../../../core/logger";
import {
  DefaultDateFormat,
  DefaultTimeFormat,
  goBack,
} from "../../../../../core/Utils";
import {SeminarAgenda} from "../../../../../model/domain/classes/SeminarAgenda";
import {AbstractAuditingEntity} from "../../../../../model/domain/classes/AbstractAuditingEntity";
import {FetchStateEnum} from "../../../../../model/ui/enums/FetchStateEnum";
import {detailsFormLayout} from "../../../../../shared/components/datagrid/DetailsFormLayout";
import {
  FailNotification,
  SuccessNotification,
} from "../../../../../shared/components/notifications/Notification";
import DefaultSpinner from "../../../../../shared/components/spinners/DefaultSpinner";
import NoDataComponent from "../../../../../shared/components/no-data/NoData";
import UserPickerComponent from "../../../../../shared/components/user-picker/UserPicker";
import SystemInfoComponent from "../../../../../shared/components/system-info/SystemInfo";
import TextArea from "antd/lib/input/TextArea";
import FileUploadComponent, {BrowserFile} from "../../../../../shared/components/file-upload/FileUpload";
import {FileUpload} from "../../../../../model/domain/classes/FileUpload";
import {UserProfile} from "../../../../../model/domain/classes/UserProfile";

const {layout, tailLayout} = detailsFormLayout;
const {RangePicker} = DatePicker;

interface AgendaTabDetailsProps {
  onFinish(): void;

  nextTime?: string;
}

function AgendaTabDetails({onFinish, nextTime}: AgendaTabDetailsProps) {
  const [record, setRecord] = useState<SeminarAgenda>();
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);
  const {params, url} = useRouteMatch<SeminarParams>();
  let history = useHistory();
  const [form] = Form.useForm();
  const [pause] = Form.useForm();
  pause.setFieldsValue({name: 'Pauza'});
  pause.setFieldsValue({range: [moment(nextTime), null]});
  const id = !params.id ? undefined : +params.id; //ts issue; cast string to number with +;

  useEffect(() => {
    loadData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, nextTime]);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let record = new SeminarAgenda();
      if (id) {
        record = await api.seminarAgenda.get(id);
        record.range = [moment(record.start), moment(record.end)];
      } else {
        // @ts-ignore
        record.range = [moment(nextTime), null];
      }
      setRecord(record);
      form.setFieldsValue(record);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      Logger.error(error);
      FailNotification("Unable to load data.");
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function fileUpload(rec: BrowserFile, desc: string) {
    try {
      setActionInProgress(true);
      const {browserFile}: FileUpload = {
        description: desc,
        browserFile: rec,
        id: 0,
        createdDate: moment().toISOString()
      };
      if (browserFile?.file) {
        const data = new FormData();
        //@ts-ignore
        data.set("file", rec.file);
        data.set("name", rec.name);
        data.set("description", desc || " ");
        let response = await api.seminarMaterial.create(params.seminarId, data);
        SuccessNotification("Seminar supporting material created.");
        return response.id;
        //setRecord(response);
      }
      setActionInProgress(false);
      closeModal();
    } catch (error) {
      setActionInProgress(false);
      FailNotification("Saving data error. Check the logs.");
      Logger.error(error);
    }
  }


  async function handleFinish({range, ...rec}: SeminarAgenda) {
    try {
      let desc = rec.name + " ";
      rec.profiles.forEach((item: UserProfile) => {
        desc = desc + item.firstName + ' ' + item.lastName + ', '
      });

      setActionInProgress(true);
      let fileid = await fileUpload(rec.browserFile, desc);
      const updatedRecord: SeminarAgenda = {
        ...record,
        ...rec,
        fileId: fileid,
        start: range ? range[0]?.utc().format() : undefined,
        end: range ? range[1]?.utc().format() : undefined,
        seminar: {id: params.seminarId},
      };
      if (!id) {
        await api.seminarAgenda.create(updatedRecord);
        SuccessNotification("Agenda item created.");
        setActionInProgress(false);
        onFinish();
        loadData();
      } else {
        await api.seminarAgenda.update(updatedRecord);
        SuccessNotification("Agenda item changed.");
        setActionInProgress(false);
        closeModal();
      }
    } catch (error) {
      setActionInProgress(false);
      FailNotification("Saving data error. Check the logs.");
      Logger.error(error);
    }
  }

  async function addPause({range, ...rec}: SeminarAgenda) {
    try {

      setActionInProgress(true);
      const updatedRecord: SeminarAgenda = {
        ...record,
        ...rec,
        start: range ? range[0]?.utc().format() : undefined,
        end: range ? range[1]?.utc().format() : undefined,
        seminar: {id: params.seminarId},
      };
      if (!id) {
        await api.seminarAgenda.create(updatedRecord);
        SuccessNotification("Agenda item created.");
        setActionInProgress(false);
        onFinish();
        loadData();
      } else {
        await api.seminarAgenda.update(updatedRecord);
        SuccessNotification("Agenda item changed.");
        setActionInProgress(false);
        closeModal();
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

  const closeModal = () => {
    goBack(history, url);
  };

  return (
    <div className="container" style={{position:"fixed", bottom:0}}>
      <div className="relative ov-hidden">
        {loading === FetchStateEnum.LOADING && <Skeleton active/>}
        {loading === FetchStateEnum.LOADED && (
          <div>
            <Form
              className={styles.agendaFormWrap}
              {...layout}
              id="detailsForm"
              onFinish={handleFinish}
              onFinishFailed={handleFinishFailed}
              form={form}
            >
              <Row>
                <Col span={16} offset={6}>
                  {id ? (
                    <h2>Edit {record?.name}</h2>
                  ) : (
                    <h2>Add new item to agenda</h2>
                  )}
                </Col>
              </Row>
              <br/>
              <Form.Item
                style={{marginBottom: 5}}
                label="Theme"
                name="name"
                rules={[{required: true, message: "Enter a name."}]}
              >
                <Input/>
              </Form.Item>

              <Form.Item label="Description" name="description" style={{marginBottom: 5}}
              >
                <TextArea/>
              </Form.Item>

              <Form.Item
                style={{marginBottom: 5}}
                label="Lecturers"
                name="profiles"
                rules={[
                  {
                    required: false,
                    message: "Enter lecturers",
                  },
                ]}
              >
                <UserPickerComponent mode="multiple"/>
              </Form.Item>

              <Form.Item
                style={{marginBottom: 5}}
                name="range"
                label="Time"
                rules={[{required: true, message: "Select start/end time."}]}
              >
                <RangePicker
                  format={`${DefaultDateFormat} ${DefaultTimeFormat}`}
                  showTime={{format: DefaultTimeFormat}}
                />
              </Form.Item>
              <Form.Item
                style={{marginBottom: 5}}
                label="Select file"
                name="browserFile"
                valuePropName="file"
                rules={[{required: false, message: "Choose a file."}]}
              >
                <FileUploadComponent multiple={false}/>
              </Form.Item>
              <SystemInfoComponent entity={record as AbstractAuditingEntity}/>

              <Form.Item {...tailLayout} style={{marginBottom: 5}}>
                {id && (
                  <Button
                    type="default"
                    loading={actionInProgress}
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={actionInProgress}
                >
                  Save
                </Button>
              </Form.Item>
            </Form>
            {!id && <Form
                className={styles.agendaFormWrap}
                {...layout}
                id="pause"
                onFinish={addPause}
                onFinishFailed={handleFinishFailed}
                form={pause}
            >
                <Row>
                    <Col span={16} offset={6}>
                        <h2>Add Pause</h2>
                    </Col>
                </Row>
                <br/>
                <Form.Item
                    label="Theme"
                    name="name"
                    initialValue={'Pauza'}
                    rules={[{required: true}]}
                    style={{display: "none"}}
                >
                    <Input disabled value={'Pauza'}/>
                </Form.Item>

                <Form.Item
                    style={{marginBottom: 5}}
                    name="range"
                    label="Time"
                    rules={[{required: true, message: "Select start/end time."}]}
                >
                    <RangePicker
                        format={`${DefaultDateFormat} ${DefaultTimeFormat}`}
                        showTime={{format: DefaultTimeFormat}}
                        defaultValue={[moment(nextTime), null]}
                    />
                </Form.Item>

                <Form.Item {...tailLayout} style={{marginBottom: 5}}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={actionInProgress}
                    >
                        Save
                    </Button>
                </Form.Item>
            </Form>
            }
          </div>
        )}
        {actionInProgress && <DefaultSpinner/>}
      </div>
      {loading === FetchStateEnum.FAILED && <NoDataComponent/>}
    </div>
  );
}

export default AgendaTabDetails;
