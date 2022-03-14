import React, {useState} from "react";
import moment from "moment";
import {Button, Checkbox, Row, Form, Select, Divider} from "antd";
import {CheckboxChangeEvent} from "antd/lib/checkbox";
import {PlusOutlined} from "@ant-design/icons";

import styles from "./SeminarReminder.module.scss";

import {setTimeOnDate} from "../../../core/Utils";
import {SeminarReminder} from "../../../model/domain/classes/SeminarReminder";

const {Option} = Select;

interface SeminarReminderProps {
  value?: Array<SeminarReminder> | SeminarReminder;

  onChange?(reminders: Array<SeminarReminder> | SeminarReminder): void;

  multiple?: boolean;
  //seminarId?: number;
}

function SeminarReminderComponent({
                                    value,
                                    onChange,
                                    //seminarId,
                                    multiple = true,
                                  }: SeminarReminderProps) {
  const values = !value
    ? []
    : multiple
      ? (value as Array<SeminarReminder>)
      : [value as SeminarReminder];
  const firstTime = values[0] ? moment(values[0].start) : undefined;
  const [selected, setSelected] = useState<number>();

  function triggerChange(reminders: Array<SeminarReminder>) {
    onChange && onChange(multiple ? reminders : reminders[0]);
  }

  function handleAddDate() {
    const reminder = new SeminarReminder();
    reminder.secondsBeforeStart = 0;
    reminder.start = setTimeOnDate(moment().utc().format(), firstTime)
      .utc()
      .format();
    triggerChange([...values, reminder]);
  }

  function handleRemoveDate(index: number) {
    const reminders = [...values];
    reminders.splice(index, 1);
    triggerChange(reminders);
  }

  function handleSetNotification(
    e: CheckboxChangeEvent,
    type: string,
    index: number
  ) {
    const reminders = [...values];
    reminders[index] = {
      ...reminders[index],
      [type]: e.target.checked,
    };
    triggerChange(reminders);
  }

  function handleSecondsBeforeStart(secondsBeforeStart: number, index: number) {
    //const secondsBeforeStart = value;
    const reminders = [...values];
    reminders[index] = {
      ...reminders[index],
      secondsBeforeStart: secondsBeforeStart,
    };

    triggerChange(reminders);
  }

  return (
    <Row className="systemInfo">
      <div className={styles.remindersWrap}>
        {values.map((val, index) => (
          <article key={`reminder_${index}`}>
            <Form.Item label="">
              {index + 1}. Reminder:{" "}
              <b>
                {val &&
                moment(val.start).subtract(selected, 'seconds')
                  .format("DD-MM-YYYY HH:mm")}
              </b>
            </Form.Item>
            <Form.Item label="">
              <Select
                placeholder="Izaberi vreme podsjetnika pre početka"
                onChange={(value: number) => {
                  setSelected(value);
                  handleSecondsBeforeStart(value, index)
                }
                }
                defaultValue={val.secondsBeforeStart === null ? undefined : val.secondsBeforeStart}
              >
                <Option value={300}>5 min</Option>
                <Option value={600}>10 min</Option>
                <Option value={900}>15 min</Option>
                <Option value={1800}>30 min</Option>
                <Option value={3600}>1 sat</Option>
                <Option value={7200}>2 sata</Option>
                <Option value={21600}>6 sati</Option>
                <Option value={43200}>12 sati</Option>
                <Option value={86400}>1 dan</Option>
                <Option value={172800}>2 dana</Option>
                <Option value={432000}>5 dana</Option>
                <Option value={604800}>7 dana</Option>
              </Select>{" "}
              <div className="flex-center">
                <Checkbox
                  checked={val.smsNotification}
                  onChange={(e) =>
                    handleSetNotification(e, "smsNotification", index)
                  }
                >
                  SMS
                </Checkbox>
                <Checkbox
                  checked={val.pushNotification}
                  onChange={(e) =>
                    handleSetNotification(e, "pushNotification", index)
                  }
                >
                  Push
                </Checkbox>
                <Checkbox
                  checked={val.emailNotification}
                  onChange={(e) =>
                    handleSetNotification(e, "emailNotification", index)
                  }
                >
                  E-mail
                </Checkbox>
                <Button
                  className={styles.remove}
                  type="link"
                  danger
                  // icon={<CloseOutlined />}
                  onClick={() => handleRemoveDate(index)}
                >
                  Remove
                </Button>
              </div>
            </Form.Item>
            <Divider/>
          </article>
        ))}

        {/* {(multiple || values.length === 0) && !!firstTime && ( */}
        <Button
          type="dashed"
          block
          icon={<PlusOutlined/>}
          onClick={handleAddDate}
        >
          Add date
        </Button>
        {/* )} */}
      </div>
    </Row>
  );
}

export default SeminarReminderComponent;
