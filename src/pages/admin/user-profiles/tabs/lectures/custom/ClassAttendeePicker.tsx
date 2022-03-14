import React from 'react';
import {Select} from "antd";
import {ClassAttendee} from "../../../../../../model/domain/classes/ClassAttendee";

interface ClassAttendeePickerProps {
  attendees: Array<ClassAttendee>

  onChange(e: any): void;
}

const ClassAttendeePickerComponent = ({attendees, onChange}: ClassAttendeePickerProps) => {
  const {Option} = Select;

  const options = attendees.map(item => {
    return <Option key={`attendee_${item.id}`} value={item.id}>{item.profile.firstName} {item.profile.lastName}</Option>
  });
  return (
    <div style={{margin:10}}>
      <div>Pick Attendee</div>
      <Select
        size={"large"}
        showSearch
        style={{width: "100%"}}
        placeholder="Search to Select"
        onChange={e => onChange(e)}
      >
        {options}
      </Select>
    </div>
  )
};

export default ClassAttendeePickerComponent
