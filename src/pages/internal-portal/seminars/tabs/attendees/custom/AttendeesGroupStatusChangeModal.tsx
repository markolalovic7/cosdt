import React, {useContext, useEffect, useState} from 'react';
import {Modal, Select} from "antd";
import {SeminarAttendeeStatusEnum} from "../../../../../../model/domain/enums/SeminarAttendeeStatusEnum";
import {SeminarAttendee} from "../../../../../../model/domain/classes/SeminarAttendee";
import {DataGridContext, DataGridContextType} from "../../../../../../model/ui/types/DataGridContextType";

interface AttendeesGroupStatusChangeModalProps {
  onClose(): void
  visible: boolean
  attendees: Array<SeminarAttendee>;
  groupChangeStatus(attendees:Array<SeminarAttendee>, status:SeminarAttendeeStatusEnum):void

}
const values= [
  {
    id: SeminarAttendeeStatusEnum.INVITED,
    name: "Invited",
  },
  {
    id: SeminarAttendeeStatusEnum.NOT_INVITED,
    name: "Not invited",
  },
  {
    id: SeminarAttendeeStatusEnum.ATTENDED,
    name: "Attended",
  },
  {
    id: SeminarAttendeeStatusEnum.CERTIFIED,
    name: "Certified",
  },
  {
    id: SeminarAttendeeStatusEnum.REGISTERED,
    name: "Registered",
  },
];



const AttendeesGroupStatusChangeModal = ({onClose, visible, attendees,groupChangeStatus}: AttendeesGroupStatusChangeModalProps) => {
  const [status, setStatus] = useState<SeminarAttendeeStatusEnum>();
  const {selection} = useContext<DataGridContextType<SeminarAttendee>>(DataGridContext);

  const renderOptions =()=> {
    return values.map(item => {
      return (<Select.Option value={item.id} key={`select_${item.id}`}>{item.name}</Select.Option>)
    })
  };

  function handleChange(value:SeminarAttendeeStatusEnum) {
    setStatus(value);
  }

  const handleChangeStatus=()=>{
    groupChangeStatus(selection, status!)
  };

useEffect(()=>{});
  return (
    <Modal
      onCancel={onClose}
      title={'Choose Status'}
      visible={visible}
      destroyOnClose={true}
      className={'smallModal'}
      onOk={status && handleChangeStatus}
    >
      <Select style={{width:'100%'}} onChange={handleChange}>
        {renderOptions()}
      </Select>
    </Modal>)
};

export default AttendeesGroupStatusChangeModal
