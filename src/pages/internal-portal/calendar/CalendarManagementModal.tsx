import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import moment from "moment";
import {Button, Col, Descriptions, Form, Input, Modal, Row, Select, TimePicker,} from "antd";

import {Logger} from "../../../core/logger";
import {DefaultDateFormat, DefaultTimeFormat} from "../../../core/Utils";
import {EventActionEnum} from "../../../model/ui/enums/EventActionEnum";
import UserPickerComponent from "../../../shared/components/user-picker/UserPicker";
import {Event} from "../../../model/domain/classes/Event";
import {CalendarEventTypeEnum} from "../../../model/domain/enums/CalendarEventTypeEnum";
import {MainRoutesEnum} from "../../../model/ui/routes/MainRoutesEnum";
import {InternalPortalRoutesEnum} from "../../../model/ui/routes/InternalPortalRoutesEnum";
import DatePickerComponent from "../../../shared/components/date-picker/DatePicker";
import {api} from "../../../core/api";
import {Location} from "../../../model/domain/classes/Location";
import SelectComponent from "../../../shared/components/multiple-select/Select";
import SeminarReminderComponent from "../../../shared/components/seminar-reminder/SeminarReminder";

const { RangePicker } = TimePicker;
const { Option } = Select;

type CalendarManagementModalProps = {
  action?: EventActionEnum;
  event: Event;
  onCreate(e: Event): Promise<void>;
  onEdit(e: Event): Promise<void>;
  onDelete(e: Event): Promise<void>;
  onCancel(): void;
};

function CalendarManagementModalComponent({
  event,
  onCreate,
  onEdit,
  onDelete,
  onCancel,
  action,
}: CalendarManagementModalProps) {
  const [locations, setLocations] = useState<Array<Location>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [eventType, setEventType] = useState<CalendarEventTypeEnum>(event.eventType);
  const [startDate, setStartDate] = useState(moment(event.start).utc().format("YYYY-MM-DD"));
  const [eventStartDateString, setEventStartDateString] = useState(event.start);
  const seminarPath = `${MainRoutesEnum.INTERNAL_PORTAL}${InternalPortalRoutesEnum.SEMINARS}`;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLocations(await api.location.getAll());
  };

  const handleSubmit = async (e: Event) => {
    try {
      setIsLoading(true);
      if (action === EventActionEnum.ADD) {
        await onCreate(e);
      } else if (action === EventActionEnum.EDIT) {
        await onEdit(e);
      } else if (action === EventActionEnum.DELETE) {
        await onDelete(e);
      }
      setIsLoading(false);
      onCancel();
    } catch (e) {
      setIsLoading(false);
      Logger.error(e);
    }
  };

  const renderFooter = () => {
    if (
      action === EventActionEnum.ADD &&
      eventType === CalendarEventTypeEnum.SEMINAR
    ) {
      return [
        <Button key="backButton" disabled={isLoading} onClick={onCancel}>
          Zatvori
        </Button>,
        <Link key="create-new-seminar" to={`${seminarPath}/new`}>
          <Button type="primary">Kreiraj novi seminar</Button>
        </Link>,
      ];
    } else if (
      action === EventActionEnum.ADD ||
      action === EventActionEnum.EDIT
    ) {
      return [
        <Button key="backButton" disabled={isLoading} onClick={onCancel}>
          Zatvori
        </Button>,
        <Button
          key="submit"
          type="primary"
          form="eventForm"
          htmlType="submit"
          loading={isLoading}
          disabled={!eventType}
        >
          Snimi
        </Button>,
      ];
    } else if (action === EventActionEnum.DELETE) {
      return [
        <Button key="backButton" disabled={isLoading} onClick={onCancel}>
          Zatvori
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={() => handleSubmit(event)}
        >
          Obriši
        </Button>,
      ];
    } else if (action === EventActionEnum.VIEW) {
      return [
        <Button key="backButton" disabled={isLoading} onClick={onCancel}>
          Zatvori
        </Button>,
      ];
    }
  };

  function onRangeChange(time: any, dateString: any) {
    if (time) {
      setEventStartDateString(time[0].format(`${startDate} HH:mm`));
    }
  }

  function onChangeStartDate(date: any) {
    let startDate = moment(date).utc().format("YYYY-MM-DD");
    setStartDate(startDate);
  }

  return (
    <Modal
      title={`Event ID: ${event.name}`}
      centered
      visible={true}
      onCancel={onCancel}
      className={"bigModal"}
      footer={renderFooter()}
    >
      {action === EventActionEnum.DELETE && (
        <p>Da li želite da izbrišete ovaj događaj?</p>
      )}
      {(action === EventActionEnum.EDIT || action === EventActionEnum.ADD) && (
        <Form
          id="eventForm"
          layout={"vertical"}
          onFinish={handleSubmit}
          initialValues={event}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="eventType"
                label="Tip događaja"
                rules={[{ required: true, message: "Odaberite tip događaja." }]}
              >
                <Select
                  placeholder="Choose event type"
                  onChange={(value: CalendarEventTypeEnum) =>
                    setEventType(value)
                  }
                >
                  <Option value={CalendarEventTypeEnum.INTERNAL_MEETING}>
                    Interni sastanak
                  </Option>
                  <Option value={CalendarEventTypeEnum.EXTERNAL_MEETING}>
                    Eksterni sastanak
                  </Option>
                  <Option value={CalendarEventTypeEnum.CONFERENCE}>
                    Konferencija
                  </Option>
                  <Option value={CalendarEventTypeEnum.TRAINING}>Obuka</Option>
                  <Option value={CalendarEventTypeEnum.INITIAL_TRAINING}>
                    Inicijalna obuka
                  </Option>
                  {action === EventActionEnum.ADD && (
                    <Option value={CalendarEventTypeEnum.SEMINAR}>
                      Seminar
                    </Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Naziv"
                rules={[
                  { required: true, message: "Odaberite naziv događaja." },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          {eventType && eventType !== CalendarEventTypeEnum.SEMINAR && (
            <React.Fragment>
              <Row>
                <Col span={24}>
                  <Form.Item
                    name="start"
                    label="Datum"
                    rules={[
                      { required: true, message: "Odaberite datum dogadjaja." },
                    ]}
                  >
                    <DatePickerComponent
                      onChange={onChangeStartDate}
                      viewFormat={DefaultDateFormat}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="range"
                    label="Vrijeme"
                    rules={[
                      {
                        required: true,
                        message: "Odaberite trajanje dogadjaja.",
                      },
                    ]}
                  >
                    {/* <RangePicker
                      format={DefaultTimeFormat}
                      //defaultValue={eventStart}
                      showSecond={false}
                      onChange={onTimeChange}
                      value={eventStart}
                    /> */}

                    <RangePicker
                      //showTime={{ format: "HH:mm" }}
                      format="HH:mm"
                      onChange={onRangeChange}
                      //onOk={onOk}
                      //disabledDate={disabledDate}
                      allowClear
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="description" label="Opis događaja">
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="seminarLocation"
                    label="Lokacija"
                    rules={[
                      {
                        required: true,
                        message: "Odaberite lokaciju događaja.",
                      },
                    ]}
                  >
                    <SelectComponent dropdownValues={locations}
                    onChange={(e)=>console.log(e)}/>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="attendees"
                    label="Učesnici"
                    rules={[{ required: true, message: "Odaberite učesnike." }]}
                  >
                    <UserPickerComponent mode="multiple" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="eventReminders" label="Podsjetnik">
                <SeminarReminderComponent
                value={event.reminder}
                />
                {/*  <EventReminderComponent
                  eventStartDateString={eventStartDateString}
                  multiple={false}
                /> */}
              </Form.Item>
            </React.Fragment>
          )}
        </Form>
      )}

      {action === EventActionEnum.VIEW && (
        <Descriptions
          title={moment(event.start).format(DefaultDateFormat)}
          bordered
        >
          <Descriptions.Item label="Trajanje">
            {moment(event.start).format(DefaultTimeFormat) +
              " - " +
              moment(event.end).format(DefaultTimeFormat)}
          </Descriptions.Item>
          <Descriptions.Item label="Naziv">{event.name}</Descriptions.Item>
          <Descriptions.Item label="Lokacija">
            {event.location}
          </Descriptions.Item>
          <Descriptions.Item label="Opis">
            {event.description}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}

export default CalendarManagementModalComponent;
