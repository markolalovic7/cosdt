import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { Form, Input, InputNumber, Skeleton } from "antd";

import { api } from "../../../../../core/api";
import { Logger } from "../../../../../core/logger";
import { goBack } from "../../../../../core/Utils";
import { FetchStateEnum } from "../../../../../model/ui/enums/FetchStateEnum";
import { SeminarCost } from "../../../../../model/domain/classes/SeminarCost";
import { detailsFormLayout } from "../../../../../shared/components/datagrid/DetailsFormLayout";
import {
  FailNotification,
  SuccessNotification,
} from "../../../../../shared/components/notifications/Notification";
import DefaultSpinner from "../../../../../shared/components/spinners/DefaultSpinner";
import NoDataComponent from "../../../../../shared/components/no-data/NoData";
import { AbstractAuditingEntity } from "../../../../../model/domain/classes/AbstractAuditingEntity";
import DataGridModalComponent from "../../../../../shared/components/datagrid/DataGridModal";
import SystemInfoComponent from "../../../../../shared/components/system-info/SystemInfo";
import FileUploadComponent, {
  BrowserFileType
} from "../../../../../shared/components/file-upload/FileUpload";
import SelectComponent from "../../../../../shared/components/multiple-select/Select";
import { CostCategory } from "../../../../../model/domain/classes/CostCategory";
import { CostSubcategory } from "../../../../../model/domain/classes/CostSubcategory";

const { layout } = detailsFormLayout;

function CostSheetTabDetails() {
  const [record, setRecord] = useState<SeminarCost>();
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);
  const { params, url } = useRouteMatch<SeminarParams>();

  const [costCategories, setCostCategories] = useState<Array<CostCategory>>([]);
  const [costSubCategories, setCostSubCategories] = useState<
    Array<CostSubcategory>
  >([]);

  const id = params.id === "new" ? null : +params.id; //ts issue; cast string to number with +;

  let history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      setCostCategories(await api.costCategory.getAll());
      setCostSubCategories(await api.costSubcategory.getAll());
      let record = new SeminarCost();
      if (id) {
        record = await api.seminarCost.get(id);
      }
      setRecord(record);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      Logger.error(error);
      FailNotification("Unable to load data.");
      setLoading(FetchStateEnum.FAILED);
    }
  }

  function getInitialValues(record: SeminarCost): SeminarCost {
    return {
      ...record,
      attachedFile: (record.attachedFile?.originalFilename) 
        ? {
          ...record.attachedFile,
          browserFile: {
            file: undefined,
            name: record.attachedFile.originalFilename,
            type: BrowserFileType.PDF,
            url: api.seminarCost.getFileUrl(record.attachedFile),
          }
        }
        : undefined
    }
  }

  async function onFinish(rec: SeminarCost) {
    try {
      setActionInProgress(true);
      const browserFile = rec.attachedFile?.browserFile;
      const updated: SeminarCost = {
        ...record, 
        ...rec, 
        attachedFile: record?.attachedFile,
        seminar: {
          id: params.seminarId
        }
      };
      let response = !id
        ? await api.seminarCost.create(updated)
        : await api.seminarCost.update(updated);
      
      if (browserFile?.file) {
        const data = new FormData();
        data.set("file", browserFile.file);
        await api.seminarCost.uploadFile(response.id, data);
      }
      !id
        ? SuccessNotification("Cost sheet created.")
        : SuccessNotification("Cost sheet changed.");
      form.setFieldsValue(getInitialValues(response));
      setRecord(response);
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
      title={id ? "Edit cost sheet" : "Create cost sheet"}
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
              initialValues={getInitialValues(record!)}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              form={form}
            >
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
                <SelectComponent dropdownValues={costCategories} />
              </Form.Item>

              <Form.Item
                dependencies={['category']}
                noStyle
              >
                {() => 
                <Form.Item
                  label="Subcategory"
                  name={"subCategory"}
                  rules={[
                    {
                      required: true,
                      message: "Unesite podkategoriju",
                    },
                  ]}
                >
                  <SelectComponent 
                      dropdownValues={
                        form.getFieldValue('category') 
                          ? costSubCategories.filter(subCat => subCat.parentCategory?.id === form.getFieldValue('category').id)
                          : []
                      }
                    />
                </Form.Item>}
              </Form.Item>

              <Form.Item 
                label="Amount" 
                name="amount"
                rules={[
                  {
                    required: true,
                    message: "Define amount.",
                  },
                ]}
              >
                <InputNumber
                  formatter={value => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => (value || "0").replace(/€\s?|(,*)/g, '')}
                />
              </Form.Item>

              <Form.Item label="Note" name="description">
                <Input />
              </Form.Item>

              <Form.Item 
                label="Attach a file"
                name={["attachedFile", "browserFile"]}
                valuePropName="file"
              >
                <FileUploadComponent
                  multiple={false}
                  accept="application/pdf"
                />
              </Form.Item>

              <SystemInfoComponent entity={record as AbstractAuditingEntity} />
            </Form>
          )}
          {actionInProgress && <DefaultSpinner />}
        </div>
        {loading === FetchStateEnum.FAILED && <NoDataComponent />}
      </div>
    </DataGridModalComponent>
  );
}

export default CostSheetTabDetails;
