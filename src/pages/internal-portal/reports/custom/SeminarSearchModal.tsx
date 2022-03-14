import React, {useEffect, useState} from "react";
import styles from "../../../../shared/components/datagrid/DataGrid.module.scss";
import stylesReport from "../Reports.module.scss";
import {Button, Form, Modal, Select} from "antd";
import {Institution} from "../../../../model/domain/classes/Institution";
import {ProfileFunction} from "../../../../model/domain/classes/ProfileFunction";
import {FetchStateEnum} from "../../../../model/ui/enums/FetchStateEnum";
import {api} from "../../../../core/api";
import {FailNotification, SuccessNotification} from "../../../../shared/components/notifications/Notification";
import {Logger} from "../../../../core/logger";
import {saveAs} from "file-saver";


interface SeminarsSearchModalProps {
  onDeleteSelected?(id: Array<number>): Promise<void>;

  onCreate?(): Promise<void>

  onDownloadDescription?(id: Array<number>): Promise<void>

  handleSubmit(e: any): void
}

const SeminarsSearchModal = ({

                               handleSubmit
                             }: SeminarsSearchModalProps) => {

  const [modal, setModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.LOADED);
  const [institutions, setInstitutions] = useState<Array<Institution>>([]);
  const [profileFunctions, setProfileFunctions] = useState<Array<ProfileFunction>>([]);
  const [fOptions, setFoptions] = useState<Array<any>>([]);
  const [iOptions, setIoptions] = useState<Array<any>>([]);
  const {Option} = Select;

  useEffect(() => {
    loadData()

  }, []);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let institutions = await api.institution.getAll();
      let profileFunctions = await api.profileFunction.getAll();
      setProfileFunctions(profileFunctions);
      setInstitutions(institutions);
      setLoading(FetchStateEnum.LOADED);
      const functionOptions = profileFunctions.map(func => {
        return {name: func.name, value: func.id}
      });
      const institutionOptions = institutions.map(institution => {
        return {name: institution.name, value: institution.id}
      });
      setFoptions(functionOptions);
      setIoptions(institutionOptions)
    } catch (error) {
      FailNotification(
        "Greška prilikom učitavanja podataka o institucijama/funkcijama korisnika. Check the logs."
      );
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  const options = [];
  for (let i = 2020; i < 2100; i++) {
    const value = `${i}`;
    options.push({
      value,
    });
  }

  const [form] = Form.useForm();
  const [formYear] = Form.useForm();
  const handleFinish = (values: any) => {
    console.log(values);
    handleSubmit(values);
    setModal(false);
  };
  const reportByYear = async (year: string) => {
    try {
      setLoading(FetchStateEnum.LOADING);
      const data = await api.report.getSeminarReportByYear(year);
      let blob = new Blob([data], {type: "application/zip"});
      saveAs(blob, `${year}.xlsx`);
      SuccessNotification("Download started.");
    } catch (e) {
      FailNotification("Unable to download report.");
      Logger.error(e);
      throw e;
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  };
  const handleFinishYear = (values: any) => {
    reportByYear(values.year);
    console.log(values)
  };

  const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
  };
  const selectLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 14},
  };

  const renderFoptions = fOptions.map(item => {
    return <Option value={item.value}>{item.name}</Option>
  });
  const renderIoptions = iOptions.map(item => {
    return <Option value={item.value}>{item.name}</Option>
  });
  return (
    <div className={styles.dataGridActions}>
      <div className={stylesReport.customReportsControl}>
        <div>
          <Button
            onClick={() => setModal(true)}
            type="primary"
            className={styles.dataGridActionsButton}
          >
            Search
          </Button>

        </div>
        <Form form={formYear}
              onFinish={handleFinishYear}
              {...selectLayout}
              className={stylesReport.formSelect}
        >
          <Form.Item name={'year'} label={'Report by year'}>
            <Select
              style={{width: '100%'}}
              placeholder="Select year"
              options={options}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              className={styles.dataGridActionsButton}
              htmlType="submit"
            >
              Export
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Modal
        visible={modal}
        onOk={() => form.submit()}
        onCancel={() => setModal(false)}
        destroyOnClose
        title="Pretraga"
      >
        <Form
          form={form}
          onFinish={handleFinish}
          {...layout}
        >
          <Form.Item
            label="Funkcija"
            name="function"
          >
            <Select mode={"multiple"}>{renderFoptions}</Select>
          </Form.Item>

          <Form.Item
            label="Institucija"
            name="institution"
          >
            <Select mode={"multiple"}>{renderIoptions}</Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
};

export default SeminarsSearchModal;
