import React from "react";
import Success from "./Passed";
import Fail from "./Failed";
import {useLocation} from "react-router";
import {ExamAttendeesInstance} from "../../../model/domain/classes/ExamAttendeesInstance";

const ResultPage = () => {
  const location = useLocation();
  const state = location.state as ExamAttendeesInstance;
  return (
    <div>
      {state.passed ?
          <Success score={state.score}/>
          :
          < Fail score={state.score}/>
      }
    </div>
  )
};

export default ResultPage
