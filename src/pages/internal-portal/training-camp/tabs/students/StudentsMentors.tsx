import React, { useEffect, useState } from "react";
import { api } from "../../../../../core/api";
import { Logger } from "../../../../../core/logger";
import { FetchStateEnum } from "../../../../../model/ui/enums/FetchStateEnum";
import { FailNotification, SuccessNotification, } from "../../../../../shared/components/notifications/Notification";
import { Mentor } from "../../../../../model/domain/classes/Mentor";
import { ClassAttendee } from "../../../../../model/domain/classes/ClassAttendee";
import MentorsForm from "./custom/MentorsForm";
import { UserProfile } from "../../../../../model/domain/classes/UserProfile";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons/lib";

interface StudentsMentorsDetails {
  id: number;
  profile: any
  editable: boolean
}

function StudentsMentorsDetails({ id, profile, editable }: StudentsMentorsDetails,) {
  const [record, setRecord] = useState<ClassAttendee>();
  const [records, setRecords] = useState<Array<Mentor>>([]);
  const [form, setForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);


  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      setRecord(await api.classAttendee.get(id));
      await api.classAttendee.get(id).then(rec => setRecords(rec.mentors));
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function onCreate(rec: Mentor): Promise<void> {
    try {
      let updatedRecord = {
        record,
        ...rec,
        atendee: profile
      };
      let response;
      response = await api.classAttendeeMentor.create(updatedRecord);
      SuccessNotification("Mentor created.");
      setRecords([
        ...records,
        response]);
      setForm(false);
    } catch (error) {
      FailNotification("Saving data error. Check the logs.");
      Logger.error(error);
    }


  }


  async function handleUpdate(record: any, mentor: UserProfile, id: number): Promise<void> {
    try {
      setLoading(FetchStateEnum.LOADING);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === record.id);
      const updatedRecord: Mentor = {
        mentor: mentor,
        ...record,
        atendee: profile,
        id: id
      };
      data[recordIndex] = await api.classAttendeeMentor.update(updatedRecord);
      setRecords(data);
      SuccessNotification("Mentor changed.");
    } catch (error) {
      FailNotification("Saving data error.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  async function handleDelete(id: number) {
    try {
      setLoading(FetchStateEnum.LOADING);
      await api.classAttendeeMentor.delete(id);
      let data = [...records];
      const recordIndex = data.findIndex((rec) => rec.id === id);
      data.splice(recordIndex, 1);
      setRecords(data);
      SuccessNotification("Mentor deleted.");
    } catch (error) {
      FailNotification("Deleting error.");
      Logger.error(error);
    } finally {
      setLoading(FetchStateEnum.LOADED);
    }
  }


  const listMentors = () => {
    return records?.map(item => {
      return (
        <MentorsForm
          mentor={item}
          handleUpdate={handleUpdate}
          editable={editable}
          handleDelete={handleDelete} />
      )
    })
  };
  return (
    <div>
      {editable && <Button type={"primary"} icon={<PlusOutlined />}
        onClick={() => setForm(true)}
      >Add mentor</Button>}
      {form &&
        <MentorsForm handleCreate={onCreate} editable={editable} onCancel={() => setForm(false)}
        />
      }
      {listMentors()}
    </div>
  )
}

export default StudentsMentorsDetails;
