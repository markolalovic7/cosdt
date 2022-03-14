import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import moment from "moment";
import {
  Form,
  Input,
  Skeleton,
  Button,
  Select,
  DatePicker,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

import styles from "./Schedule.module.scss";

import { api } from "../../../../../core/api";
import { Logger } from "../../../../../core/logger";
import { DefaultDateFormat, DefaultTimeFormat, goBack } from "../../../../../core/Utils";
import { AbstractAuditingEntity } from "../../../../../model/domain/classes/AbstractAuditingEntity";
import { ClassLecture } from "../../../../../model/domain/classes/ClassLecture";
import { ClassLectureInstance } from "../../../../../model/domain/classes/ClassLectureInstance";
import { ClassModule } from "../../../../../model/domain/classes/ClassModule";
import { FetchStateEnum } from "../../../../../model/ui/enums/FetchStateEnum";
import { detailsFormLayout } from "../../../../../shared/components/datagrid/DetailsFormLayout";
import DefaultSpinner from "../../../../../shared/components/spinners/DefaultSpinner";
import {
  FailNotification, SuccessNotification,
} from "../../../../../shared/components/notifications/Notification";
import NoDataComponent from "../../../../../shared/components/no-data/NoData";
import DataGridModalComponent from "../../../../../shared/components/datagrid/DataGridModal";
import SystemInfoComponent from "../../../../../shared/components/system-info/SystemInfo";
import SelectComponent from "../../../../../shared/components/multiple-select/Select";
import UserPickerComponent from "../../../../../shared/components/user-picker/UserPicker";
import ClassAttendeeProfiles from "./class-attendee-picker/ClassAttendeePicker";

const { layout } = detailsFormLayout;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

function ScheduleTabDetails() {
  const [record, setRecord] = useState<ClassLecture>();
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);
  const [classModules, setClassModules] = useState<Array<ClassModule>>([]);

  let history = useHistory();
  const { url, params } = useRouteMatch<ClassParams>();
  const id = params.id === "new" ? null : +params.id; //ts issue; cast string to number with +;

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let record = new ClassLecture();
      if (id) {
        record = await api.classLecture.get(id);
        record.classLectureInstances.forEach(lectureInstance => {
          lectureInstance.range = [
            lectureInstance.start ? moment(lectureInstance.start) : undefined,
            lectureInstance.end ? moment(lectureInstance.end) : undefined,
          ]
        });
      }
      setClassModules(await api.classModule.getAll());
      setRecord(record);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      Logger.error(error);
      FailNotification("Unable to load data.");
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleFinish(rec: ClassLecture) {
    try {
      setActionInProgress(true);
      rec.classLectureInstances.forEach(lectureInstance => {
        lectureInstance.start = lectureInstance.range ? lectureInstance.range[0]?.utc().format() : undefined;
        lectureInstance.end = lectureInstance.range ? lectureInstance.range[1]?.utc().format() : undefined;
      });
      const updatedRecord: ClassLecture = {
        ...record,
        ...rec,
        klass: { id: params.classId }
      };
      let response: ClassLecture;
      if (!id) {
        response = await api.classLecture.create(updatedRecord);
        SuccessNotification("Schedule created.");
      } else {
        response = await api.classLecture.update(updatedRecord);
        SuccessNotification("Schedule changed.");
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

  const handleFinishFailed = (errorInfo: any) => {
    FailNotification("Invalid data. Check the form.");
  };


  const handleAddLectureInstance = (callback: Function) => {
    const newAnswer = new ClassLectureInstance();
    callback(newAnswer);
  };

  const handleRemoveLectureInstance = (index: number, callback: Function) => {
    callback(index);
  };

  const closeModal = () => {
    goBack(history, url);
  };

  return (
    <DataGridModalComponent
      title={id ? "Edit schedule" : "Create schedule"}
      isLoading={actionInProgress}
      onClose={closeModal}
      className="bigModal"
    >
      <div className="container">
        <div className="relative ov-hidden">
          {loading === FetchStateEnum.LOADING && <Skeleton active />}
          {loading === FetchStateEnum.LOADED && (
            //@ts-ignore
            <fieldset disabled={!!record.klass && record?.klass.locked}>
            <Form
              {...layout}
              id="detailsForm"
              initialValues={record}
              onFinish={handleFinish}
              onFinishFailed={handleFinishFailed}
            >
              <Form.Item
                label="Module"
                name={"module"}
                rules={[
                  { required: true, message: "Enter module." },
                ]}
              >
                <SelectComponent
                  //@ts-ignore
                  disabled={!!record.klass && record?.klass.locked}
                  dropdownValues={classModules}
                />
              </Form.Item>

              <Form.Item
                label="Topic"
                name="name"
                rules={[{ required: true, message: "Enter topic." }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Description" name="description">
                <TextArea rows={5} />
              </Form.Item>

              <Form.Item
                label="Reminder before start"
                name="secondsBefore"
              >
                <Select
                  placeholder="Reminder before start"
                  style={{ width: 100 }}
                  //@ts-ignore
                  disabled={!!record.klass && record?.klass.locked}
                >
                  <Option value={300}>5 min</Option>
                  <Option value={600}>10 min</Option>
                  <Option value={900}>15 min</Option>
                  <Option value={1800}>30 min</Option>
                  <Option value={3600}>1 sat</Option>
                  <Option value={7200}>2 sata</Option>
                  <Option value={21600}>6 sati</Option>
                  <Option value={43200}>12 sati</Option>
                  <Option value={86400}>1 dan</Option>
                  <Option value={172800}>2 dana</Option>
                  <Option value={432000}>5 dana</Option>
                  <Option value={604800}>7 dana</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="secondsBefore"
                label="Lecture instances"
              >
                <Form.List
                  name="classLectureInstances"
                >
                  {(lectureInstances, { add, remove }) => (
                    <div className={styles.lectureInstanceWrap}>
                      {lectureInstances.map((lectureInstance, index) => (
                        <div className={styles.lectureInstance} key={index}>
                          <div className={styles.lectureInstanceData}>
                            <Form.Item
                              name={[lectureInstance.name, "range"]}
                              rules={[
                                { required: true, message: "Enter a Lecture instance." },
                              ]}
                            >
                              <RangePicker
                                showTime={{ format: DefaultTimeFormat }}
                                format={`${DefaultDateFormat} ${DefaultTimeFormat}`}
                                //@ts-ignore
                                disabled={!!record.klass && record?.klass.locked}
                              />
                            </Form.Item>
                            <Form.Item
                              name={[lectureInstance.name, "description"]}
                              shouldUpdate
                            >
                              <TextArea
                                rows={3}
                                placeholder="Lecture instance description"
                                //@ts-ignore
                                disabled={!!record.klass && record?.klass.locked}
                              />
                            </Form.Item>
                            <Form.Item
                              rules={[{ required: true }]}
                              name={[lectureInstance.name, "location"]}
                              shouldUpdate
                            >
                              <Input placeholder="Location" />
                            </Form.Item>
                          </div>

                          <div>
                            <Button
                              type="link"
                              danger
                              disabled={lectureInstances.length <= 1}
                              onClick={() => handleRemoveLectureInstance(index, remove)}
                              icon={<MinusCircleOutlined />}
                            />
                          </div>
                        </div>
                      ))}
                      <Button
                        type={"primary"}
                        onClick={() => handleAddLectureInstance(add)}
                        icon={<PlusOutlined />}
                      >
                        Add instance
                      </Button>
                    </div>
                  )}
                </Form.List>
              </Form.Item>

              <Form.Item name="classLecturers" label="Lecturers">
                <UserPickerComponent mode="multiple"
                  //@ts-ignore
                                     locked={!record?.klass?.locked}
                                     disabled />
              </Form.Item>

              <Form.Item name="classAttendees" label="Students">
                <ClassAttendeeProfiles classId={params.classId}
                                       //@ts-ignore
                  locked={!record?.klass?.locked}
                />
              </Form.Item>

              <SystemInfoComponent entity={record as AbstractAuditingEntity} />
            </Form>
            </fieldset>
          )}
          {actionInProgress && <DefaultSpinner />}
        </div>
        {loading === FetchStateEnum.FAILED && <NoDataComponent />}
      </div>
    </DataGridModalComponent >
  );
}

export default ScheduleTabDetails;
