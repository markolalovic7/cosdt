import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Form, Input, Skeleton, Checkbox } from "antd";

import { api } from "../../../core/api";
import { Logger } from "../../../core/logger";
import { goBack } from "../../../core/Utils";
import { ElectronicBookLibrary } from "../../../model/domain/classes/ElectronicBookLibrary";
import { FetchStateEnum } from "../../../model/ui/enums/FetchStateEnum";
import { AbstractAuditingEntity } from "../../../model/domain/classes/AbstractAuditingEntity";
import { BookSubcategory } from "../../../model/domain/classes/BookSubcategory";
import { BookCategory } from "../../../model/domain/classes/BookCategory";
import { detailsFormLayout } from "../../../shared/components/datagrid/DetailsFormLayout";
import {
  FailNotification,
  SuccessNotification,
} from "../../../shared/components/notifications/Notification";
import DefaultSpinner from "../../../shared/components/spinners/DefaultSpinner";
import NoDataComponent from "../../../shared/components/no-data/NoData";
import SystemInfoComponent from "../../../shared/components/system-info/SystemInfo";
import DataGridModalComponent from "../../../shared/components/datagrid/DataGridModal";
import FileUploadComponent, {
  BrowserFileType,
} from "../../../shared/components/file-upload/FileUpload";
import SelectComponent from "../../../shared/components/multiple-select/Select";
import DatePickerComponent from "../../../shared/components/date-picker/DatePicker";

function ElectronicBookLibraryDetailsPage() {
  const [record, setRecord] = useState<ElectronicBookLibrary>();
  const [bookCategories, setBookCategories] = useState<Array<BookCategory>>([]);
  const [bookSubCategories, setBookSubCategories] = useState<
    Array<BookSubcategory>
  >([]);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);

  const { params } = useRouteMatch<DetailsParams>();
  const id = params.id === "new" ? null : +params.id; //ts issue; cast string to number with +;

  const { layout } = detailsFormLayout;
  let { url } = useRouteMatch();
  let history = useHistory();

  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      setBookCategories(await api.bookCategory.getAll());
      setBookSubCategories(await api.bookSubcategory.getAll());
    } catch (error) {
      FailNotification("Error to load Categoty/Subcategory. Check the logs.");
      Logger.error(error);
    }

    try {
      setLoading(FetchStateEnum.LOADING);
      let record = new ElectronicBookLibrary();
      if (id) {
        record = await api.eBook.get(id);
      }
      setRecord(record);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      Logger.error(error);
      FailNotification("Unable to load data.");
      setLoading(FetchStateEnum.FAILED);
    }
  }

  function getInitialValues(
    record: ElectronicBookLibrary
  ): ElectronicBookLibrary {
    return {
      ...record,
      file: record.file?.originalFilename
        ? {
          ...record.file,
          browserFile: {
            file: undefined,
            name: record.file.originalFilename,
            type: BrowserFileType.PDF,
            url: api.eBook.getFileUrl(record.file),
          },
        }
        : undefined,
    };
  }

  async function onFinish(rec: ElectronicBookLibrary) {
    try {
      setActionInProgress(true);
      const browserFile = rec.file?.browserFile;
      const updated = { ...record, ...rec, file: record?.file };
      let response = !id
        ? await api.eBook.create(updated)
        : await api.eBook.update(updated);

      if (browserFile?.file) {
        const data = new FormData();
        data.set("file", browserFile.file);
        await api.eBook.uploadFile(response.id, data);
      }
      !id
        ? SuccessNotification("E-book created.")
        : SuccessNotification("E-book changed.");
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
      title={id ? "Edit eBook-a" : "Novi eBook"}
      isLoading={actionInProgress}
      onClose={closeModal}
      destroyOnClose={true}
      className="bigModal"
    >
      <div className="container">
        <div className="relative ov-hidden">
          {loading === FetchStateEnum.LOADING && <Skeleton active />}
          {loading === FetchStateEnum.LOADED && (
            <Form
              {...layout}
              id="detailsForm"
              initialValues={getInitialValues(record!)}
              form={form}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Naziv"
                name="name"
                rules={[{ required: true, message: "Enter a title." }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Autor" name="author">
                <Input />
              </Form.Item>

              <Form.Item label="Godina publikacije" name="publishDate">
                <DatePickerComponent picker="year" format="YYYY" />
              </Form.Item>

              <Form.Item label="Opis" name="description">
                <Input />
              </Form.Item>

              <Form.Item
                label="Kategorija"
                name={"category"}
                rules={[
                  {
                    required: true,
                    message: "Unesite kategoriju",
                  },
                ]}
              >
                <SelectComponent dropdownValues={bookCategories} />
              </Form.Item>

              <Form.Item dependencies={["category"]} noStyle>
                {() => (
                  <Form.Item
                    label="Podkategorija"
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
                          ? bookSubCategories.filter(
                            (subCat) =>
                              subCat.parentCategory?.id ===
                              form.getFieldValue("category").id
                          )
                          : []
                      }
                    />
                  </Form.Item>
                )}
              </Form.Item>

              <Form.Item
                label="E-book (PDF)"
                name={["file", "browserFile"]}
                valuePropName="file"
                rules={[{ required: true, message: "Choose a book." }]}
              >
                <FileUploadComponent
                  multiple={false}
                  accept="application/pdf"
                />
              </Form.Item>

              <Form.Item
                label="Dozvoli preuzimanje za eksterne korisnike"
                name="allowDownloadToExternalUsers"
                valuePropName="checked"
              >
                <Checkbox />
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

export default ElectronicBookLibraryDetailsPage;
