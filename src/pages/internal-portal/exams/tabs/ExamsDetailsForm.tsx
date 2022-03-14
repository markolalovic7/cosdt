import React, { ReactElement, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { DatePicker, Form, Input, InputNumber, Select, Skeleton } from "antd";
import moment from "moment";

import { api } from "../../../../core/api";
import { Logger } from "../../../../core/logger";
import { DefaultDateFormat } from "../../../../core/Utils";

import { AbstractAuditingEntity } from "../../../../model/domain/classes/AbstractAuditingEntity";
import { Exam } from "../../../../model/domain/classes/Exam";
import { FetchStateEnum } from "../../../../model/ui/enums/FetchStateEnum";
import FormSurvey from "../../../../model/domain/classes/FormSurvey";
import { detailsFormLayout } from "../../../../shared/components/datagrid/DetailsFormLayout";
import {
  FailNotification,
  SuccessNotification,
} from "../../../../shared/components/notifications/Notification";
import NoDataComponent from "../../../../shared/components/no-data/NoData";
import DefaultSpinner from "../../../../shared/components/spinners/DefaultSpinner";
import SystemInfoComponent from "../../../../shared/components/system-info/SystemInfo";
import { ExamCategory } from "../../../../model/domain/classes/ExamCategory";
import { ExamSubcategory } from "../../../../model/domain/classes/ExamSubcategory";
import SelectComponent from "../../../../shared/components/multiple-select/Select";

const { tailLayout, layout } = detailsFormLayout;
const { RangePicker } = DatePicker;

interface ExamsDetailsFormProps {
  actionInProgress: boolean;
  setActionInProgress(ip: boolean): void;
  onFinish?(): void;
  footer?: ReactElement;
}

function ExamsDetailsForm({
  actionInProgress,
  setActionInProgress,
  onFinish,
  footer,
}: ExamsDetailsFormProps) {
  const [record, setRecord] = useState<Exam>();
  const [evalForms, setEvalForms] = useState<Array<FormSurvey>>([]);
  const [examCategories, setExamCategories] = useState<Array<ExamCategory>>([]);
  const [examSubcategories, setExamSubcategories] = useState<
    Array<ExamSubcategory>
  >([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const { params } = useRouteMatch<ExamParams>();
  const [form] = Form.useForm();

  const id = params.examId === "new" ? null : +params.examId; //ts issue; cast string to number with +;

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let record = new Exam();
      if (id) {
        record = await api.exam.get(id);
      }
      setEvalForms(await api.survey.getAll());
      setExamCategories(await api.examCategory.getAll());
      setExamSubcategories(await api.examSubcategory.getAll());
      setRecord(record);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      Logger.error(error);
      FailNotification("Unable to load data.");
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleFinish(rec: Exam) {
    try {
      setActionInProgress(true);
      let updatedRecord: Exam = {
        ...record,
        ...rec,
        start: rec.range[0].utc().format(),
        end: rec.range[1].utc().format(),
      };
      let response;
      if (!id) {
        response = await api.exam.create(updatedRecord);
        SuccessNotification("Exam created.");
      } else {
        response = await api.exam.update(updatedRecord);
        SuccessNotification("Exam changed.");
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
            initialValues={{
              ...record,
              range: [moment(record?.start), moment(record?.end)],
            }}
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

            <Form.Item
              name="range"
              label="Start/End"
              rules={[{ required: true, message: "Enter start/end date." }]}
            >
              <RangePicker format={DefaultDateFormat} />
            </Form.Item>

            <Form.Item
              label="Category"
              name={"category"}
              rules={[
                {
                  required: true,
                  message: "Unesite kategoriju",
                },
              ]}
            >
              <SelectComponent dropdownValues={examCategories} />
            </Form.Item>

            <Form.Item dependencies={["category"]} noStyle>
              {() => (
                <Form.Item
                  label="Subcategory"
                  name={"subcategory"}
                  rules={[
                    {
                      required: true,
                      message: "Unesite podkategoriju",
                    },
                  ]}
                >
                  <SelectComponent
                    dropdownValues={
                      form.getFieldValue("category")
                        ? examSubcategories.filter(
                            (subCat) =>
                              subCat.parentCategoryId ===
                              form.getFieldValue("category").id
                          )
                        : []
                    }
                  />
                </Form.Item>
              )}
            </Form.Item>

            <Form.Item
              label="Exam form"
              name="surveyId"
              rules={[
                {
                  required: true,
                  message: "Pick exam form.",
                },
              ]}
            >
              <Select allowClear showSearch optionFilterProp="children">
                {evalForms.map((val, index) => (
                  <Select.Option key={`${index}`} value={val.id}>
                    {val.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Max tries" name="maxTries">
              <InputNumber />
            </Form.Item>

            <Form.Item label="Minimum to pass exam" name="minToPassExam">
              <InputNumber />
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

export default ExamsDetailsForm;
