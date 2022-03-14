import React, { useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";

import { Form, Input, Button, Checkbox, Select, Skeleton, Radio } from "antd";

import { api } from "../../../../core/api";
import { Logger } from "../../../../core/logger";
import { backLink } from "../../../../core/Utils";
import { GenderEnum } from "../../../../model/domain/enums/GenderEnum";
import { FetchStateEnum } from "../../../../model/ui/enums/FetchStateEnum";
import NoDataComponent from "../../../../shared/components/no-data/NoData";
import DefaultSpinner from "../../../../shared/components/spinners/DefaultSpinner";
import { AbstractAuditingEntity } from "../../../../model/domain/classes/AbstractAuditingEntity";
import { Institution } from "../../../../model/domain/classes/Institution";
import { ProfileFunction } from "../../../../model/domain/classes/ProfileFunction";
import { ProfileClass } from "../../../../model/domain/classes/ProfileClass";
import { UserProfile } from "../../../../model/domain/classes/UserProfile";
import ColorPickerComponent from "../../../../shared/components/color-picker/ColorPicker";
import { detailsFormLayout } from "../../../../shared/components/datagrid/DetailsFormLayout";
import SelectComponent from "../../../../shared/components/multiple-select/Select";
import SystemInfoComponent from "../../../../shared/components/system-info/SystemInfo";
import FileUploadComponent, {
  BrowserFile,
  BrowserFileType,
} from "../../../../shared/components/file-upload/FileUpload";
import {
  FailNotification,
  SuccessNotification,
} from "../../../../shared/components/notifications/Notification";

const { Option } = Select;

function GeneralPropertiesTab() {
  const [record, setRecord] = useState<UserProfile>();
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);
  const [institutions, setInstitutions] = useState<Array<Institution>>([]);
  const [profileFunctions, setProfileFunctions] = useState<
    Array<ProfileFunction>
  >([]);
  const [profileClasses, setProfileClasses] = useState<Array<ProfileClass>>([]);

  const { layout, tailLayout } = detailsFormLayout;
  let { url, params } = useRouteMatch<DetailsParams>();
  const [form] = Form.useForm();
  const id = +params.id;

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      let record = await api.userProfile.get(id);
      setRecord(record);
    } catch (error) {
      FailNotification("Unable to load data.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }

    try {
      setLoading(FetchStateEnum.LOADING);
      let institutions = await api.institution.getAll();
      let profileFunctions = await api.profileFunction.getAll();
      let profileClasses = await api.profileClass.getAll();
      setProfileFunctions(profileFunctions);
      setProfileClasses(profileClasses);
      setInstitutions(institutions);
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification(
        "Greška prilikom učitavanja podataka o institucijama/funkcijama/klasama korisnika. Check the logs."
      );
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  function getInitialValues(record?: UserProfile) {
    if (!record) return record;
    return {
      ...record,
      phonePrefix: record?.telephoneNumber?.slice(0, 3) || "382",
      telephoneNumber: record?.telephoneNumber?.slice(3),
      color: record?.color || "#FF0000",
      photo: record.photo
        ? {
            file: null,
            name: "Profile photo",
            type: BrowserFileType.IMAGE,
            url: api.userProfile.getProfilePhotoUrl(record.photo as string),
          }
        : null,
    };
  }

  async function onFinish(rec: UserProfile) {
    try {
      setActionInProgress(true);
      const origPhoto = record?.photo;
      let newPhoto = rec.photo as BrowserFile;
      const { phonePrefix, ...updated } = {
        ...record,
        ...rec,
        telephoneNumber: rec.telephoneNumber
          ? `${rec.phonePrefix}${rec.telephoneNumber}`
          : undefined,
        photo: origPhoto,
      };
      let response = await api.userProfile.update(updated);
      if (newPhoto && newPhoto.file) {
        const data = new FormData();
        data.append("file", newPhoto.file);
        response = await api.userProfile.uploadPhoto(data);
      }
      const intialVals = getInitialValues(response);
      form.setFieldsValue(intialVals);
      setRecord(response);
      SuccessNotification("Podaci snimljeni.");
    } catch (error) {
      FailNotification("Saving data error. Check the logs.");
      Logger.error(error);
    } finally {
      setActionInProgress(false);
    }
  }

  const onFinishFailed = () => {
    FailNotification("Invalid data. Check the form.");
  };

  const phonePrefix = (
    <Form.Item name="phonePrefix" noStyle>
      <Select disabled suffixIcon={null}>
        <Option value="382">+382</Option>
      </Select>
    </Form.Item>
  );

  return (
    <React.Fragment>
      {loading === FetchStateEnum.LOADING && <Skeleton active />}
      {loading === FetchStateEnum.FAILED && <NoDataComponent />}
      {loading === FetchStateEnum.LOADED && (
        <Form
          {...layout}
          initialValues={getInitialValues(record)}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          form={form}
        >
          <Form.Item label="Korisničko ime" name="username">
            <Input readOnly />
          </Form.Item>

          <Form.Item label="E-mail" name="email">
            <Input readOnly />
          </Form.Item>

          <Form.Item label="Ime" name="firstName">
            <Input readOnly />
          </Form.Item>

          <Form.Item label="Ime oca" name="imeOca">
            <Input/>
          </Form.Item>

          <Form.Item label="Prezime" name="lastName">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="JMBG" name="jmbg">
            <Input />
          </Form.Item>

          <Form.Item label="Adresa" name="adresa">
            <Input />
          </Form.Item>

          <Form.Item
            label="Telefon"
            name="telephoneNumber"
            rules={[
              {
                pattern: new RegExp(/^\d+$/),
                message: "Neispravan format",
              },
            ]}
          >
            <Input addonBefore={phonePrefix} />
          </Form.Item>

          <Form.Item
            label="Funkcija"
            name="function"
            rules={[
              {
                required: true,
                message: "Unesite funkciju",
              },
            ]}
          >
            <SelectComponent dropdownValues={profileFunctions} />
          </Form.Item>

          <Form.Item
            label="Institucija"
            name="institution"
            rules={[
              {
                required: true,
                message: "Unesite instituciju",
              },
            ]}
          >
            <SelectComponent dropdownValues={institutions} />
          </Form.Item>

          <Form.Item
            label="Klasa korisnika"
            name="profileClasses"
            rules={[
              {
                required: true,
                message: "Unesite klasu korisnika",
              },
            ]}
          >
            <SelectComponent mode="multiple" dropdownValues={profileClasses} />
          </Form.Item>

          <Form.Item
            label="Dana seminara"
            name="seminarDays"
            // rules={[
            //   {
            //     required: true,
            //     message: "Enter a user classes",
            //   },
            // ]}
          >
            <Input readOnly disabled />
          </Form.Item>
          <Form.Item
            label="Sati obuke na seminarima"
            name="seminarHours"
            // rules={[
            //   {
            //     required: true,
            //     message: "Enter a user classes",
            //   },
            // ]}
          >
            <Input readOnly disabled />
          </Form.Item>
          <Form.Item label="Pol" name="gender">
            <Radio.Group>
              <Radio value={GenderEnum.MALE}>Muški</Radio>
              <Radio value={GenderEnum.FEMALE}>Ženski</Radio>
              <Radio value={GenderEnum.OTHER}>Drugo</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Fotografija" name="photo" valuePropName="file">
            <FileUploadComponent
              multiple={false}
              accept="image/*"
              preview={false}
            />
          </Form.Item>

          <Form.Item label="Boja u kalendaru" name="color">
            <ColorPickerComponent />
          </Form.Item>

          <Form.Item
            label="Inostrani predavač"
            name="isForeignLecturer"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>

          <SystemInfoComponent entity={record as AbstractAuditingEntity} />

          <Form.Item {...tailLayout}>
            <Link className="ant-btn ant-btn-link" to={backLink(url, 2)}>
              Zatvori
            </Link>
            <Button type="primary" htmlType="submit" loading={actionInProgress}>
              Snimi
            </Button>
          </Form.Item>
        </Form>
      )}
      {actionInProgress && <DefaultSpinner />}
    </React.Fragment>
  );
}

export default GeneralPropertiesTab;
