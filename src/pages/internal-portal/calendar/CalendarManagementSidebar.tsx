import React, { MutableRefObject, useEffect, useState } from "react";
import moment, { Moment } from "moment";
import { Button, DatePicker, Drawer, Form, Input } from "antd";
import {
  SearchOutlined,
  RedoOutlined,
  PlusOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import FullCalendar from "@fullcalendar/react";

import styles from "./Calendar.module.scss";

import {
  StandardFormat,
  DefaultDateFormat,
  DefaultTimeFormat,
} from "../../../core/Utils";
import { CalendarEvent } from "../../../model/domain/classes/CalendarEvent";
import { EventActionEnum } from "../../../model/ui/enums/EventActionEnum";
import { CalendarFilter, CalendarViewEnum } from "./CalendarManagementPage";

type CalendarManagementSidebarProps = {
  events: Array<CalendarEvent>;
  filter?: CalendarFilter;
  setFilter(filter?: CalendarFilter): void;
  calendarRef: MutableRefObject<FullCalendar | undefined>;
  showModal(action: EventActionEnum): void;
  setDrawerOpen(o: boolean): void;
};

function CalendarManagementSidebarComponent({
  events,
  filter,
  setFilter,
  setDrawerOpen,
  calendarRef,
  showModal,
}: CalendarManagementSidebarProps) {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<Moment | null>(null);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);
  let calendarApi = calendarRef.current?.getApi();

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => {
        const mobileSize = window.innerWidth < 1200;
        if (mobileSize !== isMobile) setIsMobile(mobileSize);
        setDrawerOpen(false);
      },
      false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const handleSetFilters = (filter: CalendarFilter) => {
    setFilter(filter);
  };

  const handleResetFilters = () => {
    form.resetFields();
    setFilter(undefined);
    calendarApi && calendarApi.changeView(CalendarViewEnum.MONTH);
  };

  const gotoDate = (date: Moment | null) => {
    calendarApi &&
      calendarApi.changeView(
        CalendarViewEnum.DAY,
        date?.format(StandardFormat)
      );
  };

  const showDrawer = () => {
    setVisible(true);
    setDrawerOpen(true);
  };

  const onClose = () => {
    setVisible(false);
    setDrawerOpen(false);
    setFilter(undefined);
  };

  const handleDrawerClose = () => {
    setVisible(false);
    setDrawerOpen(false);
    setFilter(undefined);
  };

  const handleMobileSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <div>
      <div className={styles.sidebar}>
        <div className={styles.selectDate + " flex-center"}>
          <DatePicker
            onChange={(e) => setCurrentDate(e)}
            format={DefaultDateFormat}
          />
          <Button
            type="primary"
            disabled={!currentDate}
            onClick={() => gotoDate(currentDate)}
          >
            GO
          </Button>
        </div>

        {isMobile ? (
          <Button
            type="link"
            onClick={handleMobileSearch}
            className={styles.search}
            icon={!showSearch ? <SearchOutlined /> : <CloseOutlined />}
          >
            Pretraga
          </Button>
        ) : (
          <Button
            type="link"
            onClick={!visible ? showDrawer : onClose}
            className={styles.search}
            icon={!visible ? <SearchOutlined /> : <CloseOutlined />}
          >
            Pretraga
          </Button>
        )}

        <Button
          className={styles.event}
          type="primary"
          onClick={() => showModal(EventActionEnum.ADD)}
          icon={<PlusOutlined />}
        >
          Dodaj event
        </Button>
      </div>

      {isMobile ? (
        showSearch && (
          <>
            <Form
              name="search-form"
              className={styles.searchForm}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              onFinish={handleSetFilters}
              form={form}
            >
              <Form.Item name="start" label="Start">
                <DatePicker />
              </Form.Item>
              <Form.Item name="end" label="Kraj">
                <DatePicker />
              </Form.Item>
              <Form.Item name="name" label="Naziv">
                <Input />
              </Form.Item>
              <Form.Item name="location" label="Lokacija">
                <Input />
              </Form.Item>
              <Form.Item name="desc" label="Opis">
                <Input />
              </Form.Item>

              <div className={styles.searchActions}>
                <Button
                  type="link"
                  htmlType="button"
                  onClick={handleResetFilters}
                >
                  <RedoOutlined />
                  Reset
                </Button>
                <Button type="primary" htmlType="submit">
                  <SearchOutlined />
                  Nađi
                </Button>
              </div>
            </Form>
            <div className={styles.list}>
              <h3>Rezultati</h3>
              {filter &&
                events.length > 0 &&
                events.map((item: CalendarEvent) => (
                  <div
                    key={item.id}
                    className={styles.listItem}
                    onClick={() =>
                      calendarApi &&
                      calendarApi.changeView(
                        CalendarViewEnum.DAY,
                        moment(item.start).toDate()
                      ) &&
                      calendarApi.scrollToTime({
                        hour: moment(item.start).get("hour"),
                      })
                    }
                  >
                    <span
                      className={styles.dot}
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      {moment(item.start).format(
                        `${DefaultDateFormat} ${DefaultTimeFormat}`
                      )}{" "}
                    </div>
                    <div>{item.name}</div>
                  </div>
                ))}
            </div>
          </>
        )
      ) : (
        <Drawer
          title={
            <div className="flex-center">
              <h2>Pretraga</h2>
              {/* <Button
                onClick={handleDrawerClose}
                style={{ color: "#000" }}
                type="link"
                icon={<CloseOutlined />}
              /> */}
            </div>
          }
          placement="right"
          //closable={false}
          onClose={handleDrawerClose}
          visible={visible}
          width={350}
        >
          {/* {showSearch && ( */}
          <>
            <Form
              name="search-form"
              className={styles.searchForm}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              onFinish={handleSetFilters}
              form={form}
            >
              <Form.Item name="start" label="Start">
                <DatePicker />
              </Form.Item>
              <Form.Item name="end" label="Kraj">
                <DatePicker />
              </Form.Item>
              <Form.Item name="name" label="Naziv">
                <Input />
              </Form.Item>
              <Form.Item name="location" label="Lokacija">
                <Input />
              </Form.Item>
              <Form.Item name="desc" label="Opis">
                <Input />
              </Form.Item>

              <div className={styles.searchActions}>
                <Button
                  type="link"
                  htmlType="button"
                  onClick={handleResetFilters}
                >
                  <RedoOutlined />
                  Reset
                </Button>
                <Button type="primary" htmlType="submit">
                  <SearchOutlined />
                  Nađi
                </Button>
              </div>
            </Form>
            <div className={styles.list}>
              <h3>Rezultati</h3>
              {filter &&
                events.length > 0 &&
                events.map((item: CalendarEvent) => (
                  <div
                    key={item.id}
                    className={styles.listItem}
                    onClick={() =>
                      calendarApi &&
                      calendarApi.changeView(
                        CalendarViewEnum.DAY,
                        moment(item.start).toDate()
                      ) &&
                      calendarApi.scrollToTime({
                        hour: moment(item.start).get("hour"),
                      })
                    }
                  >
                    <span
                      className={styles.dot}
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      {moment(item.start).format(
                        `${DefaultDateFormat} ${DefaultTimeFormat}`
                      )}{" "}
                    </div>
                    <div>{item.name}</div>
                  </div>
                ))}
            </div>
          </>
          {/* )} */}
        </Drawer>
      )}
    </div>
  );
}

export default CalendarManagementSidebarComponent;
