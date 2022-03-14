import React, {useState} from 'react';
import {Input, Modal, Select,} from "antd";
import ClassAttendeePickerComponent  from "./ClassAttendeePicker";
import {ClassAttendee} from "../../../../../../model/domain/classes/ClassAttendee";
import {useParams} from "react-router";
import {DiaryGrades} from "../../../../../../model/domain/classes/DiaryGrades";


interface AddGradeModalProps {
  closeModal():void
  attendees: Array<ClassAttendee>
  handleOk(value:DiaryGrades): void
}
const AddGradeModal = ({closeModal, attendees, handleOk}:AddGradeModalProps) => {
  const [record, setRecord] = useState<DiaryGrades>({});
const params = useParams() as {id:string, lectureId:string};



  const handleCancel = () => {
    closeModal();
  };

  const handleSetAttendee = (e:any) =>{
    let attendee = (attendees.find(x => x.id === e));
    let rec = record;
    rec.firstName = attendee?.profile.firstName;
    rec.lastName = attendee?.profile.lastName;
    rec.classAttendeesId = attendee?.id;
    rec.attendeeProfileId = attendee?.profile.id;
    rec.lecturerId = parseInt(params.id);
    rec.classLectureId= parseInt(params.lectureId);

  };
  const Option = Select;
  const { TextArea } = Input;
  return (
  <>
    <Modal title="Basic Modal" visible={true} onOk={()=>handleOk(record)} onCancel={handleCancel}>
      <ClassAttendeePickerComponent attendees={attendees}
        onChange={handleSetAttendee}
      />
      <div style={{margin:10}}>
        <div>Grade</div>
        <Select
          onChange={e=> e && setRecord({...record, ocjena: e.toString()})}
          style={{width: "100%"}}
          placeholder="Grade"
          >
          <Option value={'Zadovoljava'}>Zadovoljava</Option>
          <Option value={'Ne Zadovoljava'}>Ne zadovoljava</Option>
          <Option value={'Neocijenjen'}>Neocijenjen</Option>
        </Select>
      </div>
      <div style={{margin:10}}>
        <div>Description</div>
        <TextArea
          size={"large"}
          onChange={e=>setRecord({...record, opis: e.target.value})}
          style={{width: "100%"}}
          placeholder="Description"
        />
      </div>
    </Modal>
  </>
  )
};

export default AddGradeModal;
