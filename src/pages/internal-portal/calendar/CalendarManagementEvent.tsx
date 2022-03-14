import React, { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { EventContentArg } from "@fullcalendar/react";
import styles from "./Calendar.module.scss";
import { EventActionEnum } from "../../../model/ui/enums/EventActionEnum";
import { CalendarEventTypeEnum } from "../../../model/domain/enums/CalendarEventTypeEnum";

type CalendarManagementEventProps = {
  event: EventContentArg;
  showModal(action: EventActionEnum, eventId: string): void;
  showSeminarModal(action: EventActionEnum, eventId: string): void;
};

function CalendarManagementEventComponent({
  event,
  showModal,
  showSeminarModal,
}: CalendarManagementEventProps) {
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const isOpen = false;

  const getContrastYIQ = (hexcolor: string) => {
    hexcolor = hexcolor.replace("#", "");
    let r = parseInt(hexcolor.substr(0, 2), 16);
    let g = parseInt(hexcolor.substr(2, 2), 16);
    let b = parseInt(hexcolor.substr(4, 2), 16);
    let yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
  };

  const open = {
    maxHeight: "500px",
    overflow: "hidden",
    transition: "max-height 0.25s ease-in",
  };

  const close = {
    maxHeight: "0px",
    overflow: "hidden",
    transition: "max-height 0.25s ease-in",
  };

  const fontColor = getContrastYIQ(event.event.backgroundColor);

  return (
    <div
      style={{ width: "100%" }}
      onMouseEnter={() => setIsHidden(false)}
      onMouseLeave={() => setIsHidden(true)}
    >
      <div
        onClick={() => showModal(EventActionEnum.VIEW, event.event.id)}
        className={styles.eventWrap}
        style={{
          backgroundColor: event.event.backgroundColor,
          color: fontColor,
        }}
      >
        <div>
          <span>
            <small>
              {event.timeText} {event.event.title} <br></br>
              <b>Lokacija: </b>
              {event.event.extendedProps.location}
            </small>
          </span>
          <div style={isOpen ? open : close}>
            <div>Opis: {event.event.extendedProps.description}</div>
          </div>
        </div>
      </div>
      {event.event.extendedProps.targetType === CalendarEventTypeEnum.EVENT && (
        <div className={isHidden ? "hidden" : "showIcons"}>
          <EditOutlined
            className={styles.editOutlined}
            onClick={() => showModal(EventActionEnum.EDIT, event.event.id)}
          />
          <DeleteOutlined
            onClick={() => showModal(EventActionEnum.DELETE, event.event.id)}
            className={styles.deleteOutlined}
          />
        </div>
      )}
      {event.event.extendedProps.targetType ===
        CalendarEventTypeEnum.SEMINAR && (
        <div className={isHidden ? "hidden" : "showIcons"}>
          <EditOutlined
            className={styles.editOutlined}
            onClick={() =>
              showSeminarModal(EventActionEnum.EDIT, event.event.id)
            }
          />
        </div>
      )}
    </div>
  );
}

export default CalendarManagementEventComponent;
