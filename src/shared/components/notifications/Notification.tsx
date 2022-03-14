import React from "react";
import { notification } from "antd";

export const notificationId = "progressNotificationId";

export function ProgressNotification(msg: string, callback: ((event?: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void)) {
  notification.close(notificationId);
  notification.info({
    key: notificationId,
    message: (
      <div>
        {msg}{" "}
        <span role={"presentation"} className="refreshLink" onClick={callback}>
          Refresh
        </span>{" "}
        to fetch changes.
      </div>
    ),
    duration: 0
  });
}

export function FailNotification(msg: string) {
  notification["error"]({
    message: "Error",
    description: <div>{msg}</div>
  });
}

export function SuccessNotification(msg: string) {
  notification["success"]({
    message: <div>{msg}</div>
  });
}

export function WarningNotification(msg: string) {
  notification["warning"]({
    message: "Warning",
    description: <div>{msg}</div>
  });
}
