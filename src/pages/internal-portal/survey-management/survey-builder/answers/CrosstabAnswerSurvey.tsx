import React, {useEffect} from "react";

import {Radio, Form, Comment} from "antd";
import {SurveyQuestion} from "../SurveyBuilder";

import styles from "./CrosstabAnswerSurvey.module.scss";
import "./questions.scss";
import {QuestionTypeEnum} from "../../../../../model/domain/enums/QuestionTypeEnum";
import {InfoCircleOutlined} from "@ant-design/icons/lib";

interface CrosstabAnswerProps {
  question: SurveyQuestion;
  itemNo: number | string;
  className: string;

  handleQuestionType(type: QuestionTypeEnum): void
}

const CrosstabAnswersSurvey = ({question, itemNo, className, handleQuestionType}: CrosstabAnswerProps) => {
  let arrayRange = [<div className={styles.answers}>Answers</div>];
  let radioRange = [];
  let questionRange = [];
  useEffect(() => {
    setType()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [className]);
  const setType = () => {
    handleQuestionType(QuestionTypeEnum.CROSSTAB)
  };

  for (let i = 0; i < question.range; i++) {
    arrayRange.push(
      <div key={"radio_" + i} className={styles.numbers}>
        {i + 1}
      </div>
    );
    radioRange.push(<Radio className={styles.radio} value={i + 1} key={`key-${question}${i}`}/>);
  }
  //name={`${question.id}_${question.lecturerId}`}

  for (let i = 0; i < question.answers.length; i++) {
    questionRange.push(
      <Form.Item
        name={[question.id, question.answers[i].body]}
        key={`answer_${i}_${itemNo}`}
      >
        <div className={styles.wrapQuestionAnswers}>
           <div className={styles.questionAnswers}>
            {question.answers[i].body}
          </div>
           <Radio.Group className={styles.test}>{radioRange}</Radio.Group>
          {/*<div className={styles.test}>
            <Rate className={styles.customRate} count={question.range}/>
          </div>*/}
        </div>
      </Form.Item>
    );
  }


  return (
    <>
    {/*<Form.Item
        className={className}
      >*/}
        <div
          className={"question-preview single-answer w-100"}
          style={{flexDirection: "column"}}
          key={question.id}
        >
          <div className={"table-header-label"}>
            {itemNo + ". "+(question.lecturerName?("Pitanje o predavaču "+question.lecturerName+": "): " ") + question.name}          </div>
          <div className={styles.arrayRange}>{arrayRange}</div>
          <div className={styles.questionRange}>{questionRange}</div>
        </div>
  { /* </Form.Item>*/}
      {question.note &&
      <Comment
          author={<a>Note</a>}
          avatar={<InfoCircleOutlined style={{fontSize: 32, color: "#1890ff"}}/>}
          content={
            question.note
          }
      />
      }    </>
  );
};

export default CrosstabAnswersSurvey;
