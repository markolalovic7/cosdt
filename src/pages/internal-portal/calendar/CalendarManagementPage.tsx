import React, {useEffect, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import {Spin} from "antd";
import moment, {Moment} from "moment";

import styles from "./Calendar.module.scss";

import FullCalendar, {DatesSetArg} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import momentPlugin from "@fullcalendar/moment";
import interactionPlugin from "@fullcalendar/interaction";

import {api} from "../../../core/api";
import {Logger} from "../../../core/logger";
import {setTimeOnDate, StandardFormat} from "../../../core/Utils";
import {CalendarEvent} from "../../../model/domain/classes/CalendarEvent";
import {ApiParams} from "../../../model/ui/types/ApiParams";
import {EventActionEnum} from "../../../model/ui/enums/EventActionEnum";
import {Event} from "../../../model/domain/classes/Event";
import {Location} from "../../../model/domain/classes/Location";
import {CalendarEventTypeEnum} from "../../../model/domain/enums/CalendarEventTypeEnum";
import {MainRoutesEnum} from "../../../model/ui/routes/MainRoutesEnum";
import {InternalPortalRoutesEnum} from "../../../model/ui/routes/InternalPortalRoutesEnum";
import {FailNotification, SuccessNotification,} from "../../../shared/components/notifications/Notification";
import CalendarManagementEventComponent from "./CalendarManagementEvent";
import CalendarManagementModalComponent from "./CalendarManagementModal";
import CalendarManagementSidebarComponent from "./CalendarManagementSidebar";

interface CalendarManagementPageProps {
  profileId?: number;
}

interface CalendarDateRange {
  start: Moment | null;
  end: Moment | null;
}

enum CalendarFilterParamsEnum {
  NAME = "name.contains",
  LOCATION = "location.contains",
  DESCRIPTION = "description.contains",
  START = "start.greaterThanOrEqual",
  END = "end.lessThanOrEqual",
  ATTENDEES = 'attendeesId.in'
}

export interface CalendarFilter extends CalendarDateRange {
  name: string;
  description: string;
  location: string;
}

export enum CalendarViewEnum {
  DAY = "timeGridDay",
  WEEK = "timeGridWeek",
  MONTH = "dayGridMonth",
}

function CalendarManagementPage({ profileId }: CalendarManagementPageProps) {
  const calendarView =
    (localStorage.getItem("CalendarView") as CalendarViewEnum) ||
    CalendarViewEnum.WEEK;
  const calendarRef = useRef<FullCalendar>();
  const [events, setEvents] = useState<Array<CalendarEvent>>([]);
  const [event, setEvent] = useState<Event>();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [action, setAction] = useState<EventActionEnum>(EventActionEnum.VIEW);
  const [dateRange, setDateRange] = useState<CalendarDateRange>({
    start: null,
    end: null,
  });
  const [locations, setLocations] = useState<Location[]>();
  const [filter, setFilter] = useState<CalendarFilter>();
  const [selectedSlot, setSelectedSlot] = useState<Moment>();
  const history = useHistory();
  const calendarApi = calendarRef.current?.getApi();

  useEffect(() => {
    loadFromDataRange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);
  useEffect(() => {
    api.location.getAll().then(response => {
      setLocations(response);
    })
  }, []);
  useEffect(() => {
    if (!filter) loadFromDataRange();
    else loadFiltered();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function loadFromDataRange() {
    if (filter || !dateRange.start || !dateRange.end) return;
    try {
      setEvents([]);
      setIsLoading(true);
      const events = await api.event.getAllCalendarEvents(
        dateRange.start.format(StandardFormat),
        dateRange.end.format(StandardFormat)
      );
      setEvents(events);
    } catch (e) {
      FailNotification("Greška prilikom učitavanja događaja.");
      Logger.error("Greška prilikom učitavanja događaja.");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadFiltered() {
    if (!filter) return;
    try {
      setEvents([]);
      setIsLoading(true);
      let params: ApiParams = {
        [CalendarFilterParamsEnum.NAME]: filter.name,
        [CalendarFilterParamsEnum.LOCATION]: filter.location,
        [CalendarFilterParamsEnum.DESCRIPTION]: filter.description,
        [CalendarFilterParamsEnum.START]: filter.start?.utc().format(),
        [CalendarFilterParamsEnum.END]: filter.end?.utc().format(),
        sort: "start,asc",
      };
      if (profileId)
        params[CalendarFilterParamsEnum.ATTENDEES] = profileId;
      const events = await api.event.getAll(params);
      let min = moment.min(events.map((d) => moment(d.start)));
      calendarApi && min && calendarApi.gotoDate(min.format(StandardFormat));
      setEvents(events);
    } catch (e) {
      FailNotification("Greška prilikom učitavanja događaja.");
      Logger.error("Greška prilikom učitavanja događaja.");
    } finally {
      setIsLoading(false);
    }
  }

  function setCalendarView(view: CalendarViewEnum) {
    calendarApi && calendarApi.changeView(view);
    localStorage.setItem("CalendarView", view);
  }

  function handleDateChange(dateInfo: DatesSetArg) {
    const start = moment(dateInfo.view.currentStart);
    const end = moment(dateInfo.view.currentEnd);
    if (!start.isSame(dateRange.start) || !end.isSame(dateRange.end)) {
      setDateRange({
        start,
        end,
      });
    }
  }

  async function showSeminarModal(action: EventActionEnum, eventId: string) {
    const calEvent = events.find((e) => e.id.toString() === eventId);
    if (calEvent) {
      if (action === EventActionEnum.EDIT) {
        try {
          let seminar = await api.seminar.get(calEvent.targetId);
          let url = `${MainRoutesEnum.INTERNAL_PORTAL}${InternalPortalRoutesEnum.SEMINARS
            }/${seminar.id}/${seminar.name
              .toLowerCase()
              .replace(/\s+/g, "-")}/general`;
          history.push(url);
        } catch (e) {
          FailNotification("Can't open seminar.");
          Logger.error("Can't open seminar.");
        }
      }
    }
  }

  async function showModal(action: EventActionEnum, eventId?: string) {
    let calendarEvent;
    if (!eventId) {
      calendarEvent = new Event();
      const selUtc = (selectedSlot?.clone() || moment()).utc();
      calendarEvent.start = selUtc.format();
      calendarEvent.end = selUtc.add({ minutes: 30 }).format();
    } else {
      const calEvent = events.find((e) => e.id.toString() === eventId);
      if (calEvent && calEvent.eventType!==CalendarEventTypeEnum.SEMINAR) {
        try {
          calendarEvent = await api.event.get(calEvent.targetId);
        } catch (e) {
          FailNotification("Can't open event.");
          Logger.error("Can't open event.");
        }
      } else {
        showSeminarModal(EventActionEnum.EDIT, calEvent!.id)
      }
    }
    if (calendarEvent) {
      setAction(action);
      setEvent({
        ...calendarEvent,
        range: [moment(calendarEvent.start), moment(calendarEvent.end)],
      });
    }
  }

  const findLocationName = (id: number|string) => {
    let locationObject = locations?.find((obj: any) => {
      return obj.id === id;
    });
    return locationObject?.name
  };

  function hideModal() {
    setAction(EventActionEnum.VIEW);
    setEvent(undefined);
  }

  async function handleCreateEvent(e: Event) {
    try {
      setIsLoading(true);
      const start = setTimeOnDate(e.start, e.range[0]);
      const end = setTimeOnDate(e.start, e.range[1]);
      const response = await api.event.create({
        ...e,
        start: start.utc().format(),
        end: end.utc().format(),

        location: findLocationName(e.seminarLocation.name),
        // @ts-ignore
        seminarLocation: { id: parseInt(e.seminarLocation.id) }
      });
      setEvents([...events, response]);
      SuccessNotification("Događaj uspješno kreiran.");
    } catch (e) {
      FailNotification("Greška prilikom snimanja događaja.");
      Logger.error("Greška prilikom snimanja događaja.");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEditEvent(e: Event) {
    try {
      setIsLoading(true);
      let locID = e.seminarLocation.id;
      //@ts-ignore
      delete e["seminarLocation.id"];
      const start = setTimeOnDate(e.start, e.range[0]);
      const end = setTimeOnDate(e.start, e.range[1]);
      const response = await api.event.update({
        ...event,
        ...e,
        start: start.utc().format(),
        end: end.utc().format(),
        location: findLocationName(locID),
        reminder: {
          ...e.reminder,
          //@ts-ignore
          secondsBefore: e.reminder?.secondsBefore === null ? 0 : e.reminder?.secondsBefore
        },
        //@ts-ignore
        seminarLocation: {
          ...event?.seminarLocation,
          id: locID
        }
      });

      const recordIndex = events.findIndex(
        (ev) =>
          ev.targetId === response.targetId &&
          ev.targetType === CalendarEventTypeEnum.EVENT
      );
      const data = [...events];
      data.splice(recordIndex, 1, response);
      setEvents(data);
      SuccessNotification("Događaj uspješno izmijenjen.");
    } catch (e) {
      FailNotification("Greška prilikom snimanja događaja.");
      Logger.error("Greška prilikom snimanja događaja.");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteEvent(e: Event) {
    try {
      setIsLoading(true);
      await api.event.delete(e.id);
      const recordIndex = events.findIndex(
        (ev) =>
          ev.targetId === e.id && ev.targetType === CalendarEventTypeEnum.EVENT
      );
      const data = [...events];
      data.splice(recordIndex, 1);
      setEvents(data);
      SuccessNotification("Događaj uspješno obrisan.");
    } catch (e) {
      FailNotification("Greška prilikom brisanja događaja.");
      Logger.error("Greška prilikom brisanja događaja.");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }

  const evs = events.map((event) => ({
    id: event.id.toString(),
    title: event.name,
    start: event.start,
    end: event.end,
    backgroundColor: event.color,
    extendedProps: {
      description: event.description,
      location: event.location,
      targetType: event.targetType,
    },
  }));

  return (
    <div
      className={
        drawerOpen
          ? "calendar-container drawer-opened"
          : "calendar-container drawer-closed"
      }
    >
      {isLoading && (
        <div className={styles.actionInProgress}>
          <Spin size={"large"} />
        </div>
      )}
      <CalendarManagementSidebarComponent
        events={events}
        filter={filter}
        setFilter={setFilter}
        calendarRef={calendarRef}
        showModal={showModal}
        setDrawerOpen={setDrawerOpen}
      />
      <div>
        <FullCalendar
          ref={calendarRef as any}
          events={evs}
          eventContent={(event) => (
            <CalendarManagementEventComponent
              event={event}
              showModal={showModal}
              showSeminarModal={showSeminarModal}
            />
          )}
          dateClick={(info) => {
            setSelectedSlot(moment(info.dateStr));
          }}
          initialView={calendarView}
          datesSet={handleDateChange}
          customButtons={{
            timeGridDay: {
              text: "Dan",
              click: () => setCalendarView(CalendarViewEnum.DAY),
            },
            timeGridWeek: {
              text: "Sedmica",
              click: () => setCalendarView(CalendarViewEnum.WEEK),
            },
            dayGridMonth: {
              text: "Mjesec",
              click: () => setCalendarView(CalendarViewEnum.MONTH),
            },
          }}
          buttonText={{
            today: "Danas",
            month: "Mjesec",
            week: "Sedmica",
            day: "dan",
            list: "list",
          }}
          headerToolbar={{
            left: "",
            right: "title,today,prev,next",
            center: "timeGridDay,timeGridWeek,dayGridMonth",
          }}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            momentPlugin,
          ]}
          locale={"sr-Latn-RS"}
          height={600}
          navLinks={true}
          slotEventOverlap={false}
          nowIndicator={true}
          selectable={true}
          // hiddenDays={[0]}
          // slotMinTime={"00:00:00"}
          // slotMaxTime={"24:30:00"}
          allDaySlot={false}
          expandRows={true}
          slotDuration={"00:30:00.001"}
          slotLabelFormat={{
            hour: "numeric",
            minute: "2-digit",
            omitZeroMinute: false,
            meridiem: "short",
          }}
        />
        {event && (
          <CalendarManagementModalComponent
            action={action}
            event={event}
            onCreate={handleCreateEvent}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            onCancel={hideModal}
          />
        )}
      </div>
    </div>
  );
}

export default CalendarManagementPage;
