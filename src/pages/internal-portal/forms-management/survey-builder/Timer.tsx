import React, { useEffect, useState } from "react";
import { Progress } from "antd";

const moment = require("moment");

interface TimerProps {
  time?: number,
  isCountdown: boolean;

  disableForm(): any;
}


const CountdownTimer = ({ time, isCountdown, disableForm }: TimerProps) => {
  const [remainingTime, setRemainingTime] = useState<number | undefined>(time);
  useEffect(() => {
    if (!remainingTime) {
      time!==null && disableForm();
      return
    }
    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setRemainingTime(remainingTime - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingTime]);


  return (
    <>
      {isCountdown && time &&
        <div>
          <Progress
            strokeColor={!!remainingTime && remainingTime <= 10 ? "red" : "#0647a5"}
            percent={!!time && remainingTime ? 100 / time * remainingTime : 0}
            format={percent => `${!!time && remainingTime && percent
              ? moment.utc(remainingTime * 1000).format('mm:ss')
              : "00:00"}`}
          />
        </div>}
    </>
  )
};

export default CountdownTimer
