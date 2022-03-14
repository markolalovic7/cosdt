import React, {useEffect, useState} from "react";
import {Form, Radio, Comment} from "antd";
import {SurveyQuestion} from "../SurveyBuilder";
import "./questions.scss";
import CountdownTimer from "../Timer";
import {InfoCircleOutlined} from "@ant-design/icons/lib";
import {QuestionTypeEnum} from "../../../../../model/domain/enums/QuestionTypeEnum";

interface SingleAnswerProps {
  question: SurveyQuestion;
  itemNo: number;
  className: string;
  isCountdown: boolean;
  disabled: boolean

  handlePagination(): any;

  handleQuestionType(type: QuestionTypeEnum): void

}

const SingleAnswerSurvey = (
  {question, itemNo, className, isCountdown, handlePagination, disabled, handleQuestionType}: SingleAnswerProps) => {

  const radioStyle = {
    display: "flex",
    height: "30px",
    lineHeight: "30px",
    alignItems: "center",
  };
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const [openedCount, setOpenedCount] = useState<number>(0);
  useEffect(() => {
    setOpenedCount(openedCount + 1);
    setType()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [className]);
  const timeUp = () => {
    setDisableForm(true);
    handlePagination()
  };
  const setType = () => {
    handleQuestionType(QuestionTypeEnum.SINGLE_CHOICE)
  };
  return (
    <div
      className={className}
    >{
      disabled && !className &&
      <CountdownTimer time={question.timer} isCountdown={isCountdown} disableForm={timeUp}/>
    }
      <Form.Item
        name={question.id}
        label={itemNo + ". " + question.name}
        className={"form-item table-header-label " + className}
      >
        <Radio.Group>
          {question.answers.map((answer) => (
            <Radio
              className="radio-answers"
              style={radioStyle}
              value={answer.id}
              key={`answer_${answer.id}`}
              onChange={handlePagination}
              disabled={!disabled || disableForm}
            >
              {answer.body}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      {question.note &&
      <Comment
          author={<a>Note</a>}
          avatar={<InfoCircleOutlined style={{fontSize: 32, color: "#1890ff"}}/>}
          content={
            question.note
          }
      />
      }
    </div>
  );
};
export default SingleAnswerSurvey;
