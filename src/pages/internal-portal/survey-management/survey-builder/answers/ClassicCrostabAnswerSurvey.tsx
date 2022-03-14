import React, {useEffect} from "react";

import {Comment, Form, Input} from "antd";
import {SurveyQuestion} from "../SurveyBuilder";
//import styles from "./CrosstabAnswerSurvey.module.scss";
import "./questions.scss";
import {QuestionTypeEnum} from "../../../../../model/domain/enums/QuestionTypeEnum";
import {InfoCircleOutlined} from "@ant-design/icons/lib";

interface CrosstabAnswerProps {
  question: SurveyQuestion;
  itemNo: number|string;
  className: string;
  handleQuestionType(type: QuestionTypeEnum): void

}

const ClassicCrosstabAnswersSurvey = ({
                                        question,
                                        itemNo,
                                        className,
                                        handleQuestionType
                                      }: CrosstabAnswerProps) => {
  useEffect(() => {
    setType()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [className]);
  const setType = () => {
    handleQuestionType(QuestionTypeEnum.CLASSIC_CROSSTAB)
  };
  let arrayRange = [
    <div
      //className={styles.answers}
      style={{
        width: "20%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderBottom: "2px solid #f0f0f0",
      }}
    >
      Answers
    </div>,
  ];
  let radioRange = [];
  let questionRange = [];
  for (let i = 0; i < question.headOptions.length; i++) {
    arrayRange.push(
      <div
        style={{
          display: "flex",
          height: "100%",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          borderBottom: "2px solid #f0f0f0",
        }}
      >
        {!!question.headOptions.length ? question.headOptions[i] : i + 1}
      </div>
    );
    radioRange.push(
      <Form.Item noStyle rules={[{required: true}]}>
        <Input style={{width: "100%"}}/>
      </Form.Item>
    );
  }
  const input = (rec: number) => {
    let radioRange = [];
    for (let i = 0; i < question.headOptions.length; i++) {
      radioRange.push(
        <Form.Item
          name={[
            question.id,
            question.answers[rec].body,
            question.headOptions[i],
            ]}
          style={{margin: "0 10px", flex: 1}}
          rules={[{required: true}]}
        >
          <Input style={{width: "100%"}}/>
        </Form.Item>
      );
    }
    return <div style={{display: "flex", flex: 1}}>{radioRange}</div>;
  };
  for (let i = 0; i < question.answers.length; i++) {
    questionRange.push(
      <Form.Item>
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "space-around",
            width: "100%",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "20%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRight: "2px solid #fafafa",
              borderBottom: "2px solid #fafafa",
              padding: "15px 5px",
            }}
          >
            {question.answers[i].body}
          </div>
          <Input.Group style={{display: "flex", width: "80%"}}>
            {input(i)}
          </Input.Group>
        </div>
      </Form.Item>
    );
  }
  return (
    <>
      <Form.Item
        className={className}
      >
        <div
          className={"question-preview single-answer w-100"}
          style={{flexDirection: "column"}}
        >
          <div className={"table-header-label"}>
            {itemNo + ". "+(question.lecturerName?("Pitanje o predavaču "+question.lecturerName+": "): " ") + question.name}          </div>
          <div
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "space-around",
              width: "100%",
              padding: "10px 0",
              lineHeight: "2",
              background: "white",
              borderRadius: "2px",
            }}
          >
            {arrayRange}
          </div>
          <div
            style={{flex: 1, justifyContent: "space-around", flexWrap: "wrap"}}
          >
            {questionRange}
          </div>
        </div>
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
    </>
  );
};

export default ClassicCrosstabAnswersSurvey;
