import React, {useEffect} from "react";
import { SurveyQuestion } from "../SurveyBuilder";
//@ts-ignore
import ReactHtmlParser from 'react-html-parser';
import "./questions.scss";
import {QuestionTypeEnum} from "../../../../../model/domain/enums/QuestionTypeEnum";

interface InfoboxProps {
  question: SurveyQuestion;
  itemNo: number;
  className: string
  handleQuestionType(type:QuestionTypeEnum): void

}

const Infobox = ({ question, className, handleQuestionType }: InfoboxProps) => {
  useEffect(() => {
    setType()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [className]);
  const setType = ()=>{
    handleQuestionType(QuestionTypeEnum.INFOBOX)
  };
  return (
    <div className={className}>
      { ReactHtmlParser(question.name) }
    </div>
  );
};

export default Infobox;
