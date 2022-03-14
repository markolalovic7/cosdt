import React, { ReactElement, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";

import { DatePicker, Form, Input, Skeleton } from "antd";

import { api } from "../../../../core/api";
import { Logger } from "../../../../core/logger";
import { FetchStateEnum } from "../../../../model/ui/enums/FetchStateEnum";
import FormSurvey from "../../../../model/domain/classes/FormSurvey";
import { Location } from "../../../../model/domain/classes/Location";
import { Organizer } from "../../../../model/domain/classes/Organizer";
import { Seminar } from "../../../../model/domain/classes/Seminar";
import { SeminarCategory } from "../../../../model/domain/classes/SeminarCategory";
import { SeminarSubcategory } from "../../../../model/domain/classes/SeminarSubcategory";
import { detailsFormLayout } from "../../../../shared/components/datagrid/DetailsFormLayout";
import {
  FailNotification,
  SuccessNotification,
} from "../../../../shared/components/notifications/Notification";
import DefaultSpinner from "../../../../shared/components/spinners/DefaultSpinner";
import NoDataComponent from "../../../../shared/components/no-data/NoData";
import SelectComponent from "../../../../shared/components/multiple-select/Select";
import moment from "moment";
import { AbstractAuditingEntity } from "../../../../model/domain/classes/AbstractAuditingEntity";
import SystemInfoComponent from "../../../../shared/components/system-info/SystemInfo";
import SeminarReminderComponent from "../../../../shared/components/seminar-reminder/SeminarReminder";
import { DefaultDateFormat, DefaultTimeFormat } from "../../../../core/Utils";

const { tailLayout, layout } = detailsFormLayout;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface SeminarsDetailsFormProps {
  actionInProgress: boolean;
  setActionInProgress(ip: boolean): void;
  onFinish?(): void;
  footer?: ReactElement;
}

function SeminarsDetailsForm({
  actionInProgress,
  setActionInProgress,
  onFinish,
  footer,
}: SeminarsDetailsFormProps) {
  const [record, setRecord] = useState<Seminar>();
  const [subcategoryRequired, setSubcategoryRequired] = useState<boolean>(false);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const { params } = useRouteMatch<SeminarParams>();
  const [organisers, setOrganisers] = useState<Array<Organizer>>([]);
  const [locations, setLocations] = useState<Array<Location>>([]);
  const [seminarCategories, setSeminarCategories] = useState<
    Array<SeminarCategory>
  >([]);
  const [seminarSubcategories, setSeminarSubcategories] = useState<
    Array<SeminarSubcategory>
  >([]);
  const [evalForms, setEvalForms] = useState<Array<FormSurvey>>([]);
  const [form] = Form.useForm();

  const id = params.seminarId === "new" ? null : +params.seminarId; //ts issue; cast string to number with +;

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let record = new Seminar();
      if (id) {
        record = await api.seminar.get(id);
      }
      setRecord(record);
      setOrganisers(await api.organizer.getAll());
      setEvalForms(await api.seminarSurvey.getAll());
      setLocations(await api.location.getAll());
      setSeminarCategories(await api.seminarCategory.getAll());
      setSeminarSubcategories(await api.seminarSubcategory.getAll());
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      Logger.error(error);
      FailNotification("Unable to load data.");
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleFinish(rec: Seminar) {
    try {
      setActionInProgress(true);
      let updatedRecord = {
        ...record,
        ...rec,
        survey: rec.survey ? { id: rec.survey.id } : undefined,
      };
      let response;
      if (!id) {
        response = await api.seminar.create(updatedRecord);
        SuccessNotification("Seminar created.");
      } else {
        response = await api.seminar.update(updatedRecord);
        SuccessNotification("Seminar changed.");
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
              label="Name"
              name="name"
              rules={[{ required: true, message: "Enter a name." }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <Input />
            </Form.Item>

            <Form.Item label="Intro" name="intro">
              <TextArea rows={5} />
            </Form.Item>

            <Form.Item
              label="Organizers"
              name="organisers"
              rules={[
                {
                  required: true,
                  message: "Enter a organizer",
                },
              ]}
            >
              <SelectComponent mode="multiple" dropdownValues={organisers} />
            </Form.Item>

            <Form.Item
              label="Category"
              name={"seminarCategory"}
              rules={[
                {
                  required: true,
                  message: "Unesite kategoriju",
                },
              ]}
            >
              <SelectComponent dropdownValues={seminarCategories}
                onChange={() => setSubcategoryRequired(
                  seminarSubcategories.filter(
                    (subCat) =>
                      !!subCat.parentCategory &&
                      subCat.parentCategory?.id ===
                      form.getFieldValue("seminarCategory").id
                  ).length > 0
                )}
              />
            </Form.Item>
            <Form.Item dependencies={[["seminarCategory"]]} noStyle>
              {() => (
                <Form.Item
                  label="Subcategory"
                  name={"seminarSubCategory"}
                  rules={[
                    {
                      required: subcategoryRequired,
                      message: "Unesite podkategoriju",
                    },
                  ]}
                >
                  <SelectComponent
                    dropdownValues={
                      form.getFieldValue("seminarCategory")
                        ? seminarSubcategories.filter(
                          (subCat) =>
                            subCat.parentCategory?.id ===
                            form.getFieldValue("seminarCategory").id
                        )
                        : []
                    }
                  />
                </Form.Item>
              )}
            </Form.Item>
            <Form.Item
              label="Location"
              name="seminarLocation"
              rules={[
                {
                  required: true,
                  message: "Enter a location",
                },
              ]}
            >
              <SelectComponent dropdownValues={locations} />
            </Form.Item>

            <Form.Item
              label="Exam form"
              name="survey"
              rules={[
                {
                  required: true,
                  message: "Pick exam form.",
                },
              ]}
            >
              <SelectComponent dropdownValues={evalForms} />
            </Form.Item>

            {!!id && record?.start && record.end && (
              <Form.Item
                name="range"
                label="Duration"
                initialValue={[moment(record.start), moment(record.end)]}
              >
                <RangePicker
                  format={`${DefaultDateFormat} ${DefaultTimeFormat}`}
                  disabled={true}
                />
              </Form.Item>
            )}

            {!!id && (
              <Form.Item label="Reminders" name="seminarReminders">
                <SeminarReminderComponent
                //seminarStart={id && record && moment(record.start).format()}
                //seminarId={id}
                />
              </Form.Item>
            )}

            <SystemInfoComponent entity={record as AbstractAuditingEntity} />
            {footer && <Form.Item {...tailLayout}>{footer}</Form.Item>}
          </Form>
        )}
        {actionInProgress && <DefaultSpinner />}
      </div>
    </div>
  );
}

export default SeminarsDetailsForm;
