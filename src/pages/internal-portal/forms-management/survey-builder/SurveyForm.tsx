import React, { useEffect, useState } from "react";
import { Button, Form, Pagination } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons/lib";
import draftToHtml from "draftjs-to-html";

import "./SurveyForm.scss"

import SingleAnswerSurvey from "./answers/SingleAnswerSurvey";
import MultipleAnswersSurvey from "./answers/MultipleAnswersSurvey";
import OpenAnswersSurvey from "./answers/OpenAnswerSurvey";
import CrosstabAnswersSurvey from "./answers/CrosstabAnswerSurvey";
import ClassicCrosstabAnswersSurvey from "./answers/ClassicCrostabAnswerSurvey";
import Infobox from "./answers/Infobox";
import { QuestionTypeEnum } from "../../../../model/domain/enums/QuestionTypeEnum";
import { SurveyQuestion } from "./SurveyBuilder";

const SurveyForm = (props: any) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationActive, setPaginationActive] = useState<boolean>(true);
  const [visitedPages, setVisitedPages] = useState<number[]>([1]);
  const [questionType, setQuestionType] = useState<QuestionTypeEnum>(props.questions[0].type);

  const onFinish = (values: any) => {
    let final = props.questions;
    final && final.forEach((items: any) => {
      if (items.type === QuestionTypeEnum.SINGLE_CHOICE) {
        let obj = items.answers;
        items.answered = [];
        items.answered.push(obj.find(({ id }: any) => id === values[items.id]));
      }
      if (items.type === QuestionTypeEnum.MULTIPLE_CHOICE) {
        let obj = items.answers;
        items.answered = [];
        values[items.id] && values[items.id].forEach((item: any) => {
          let x = obj.find(({ id }: any) => id === item);
          items.answered.push(x);
        });
      }
      if (items.type === QuestionTypeEnum.OPEN_ENDED) {
        items.answered = [];
        items.answered.push({
          id: items.answered.length,
          body:
            typeof values[items.id] === "object"
              ? draftToHtml(values[items.id])
              : values[items.id],
        });
      }
      if (items.type === "CROSSTAB") {
        items.answered = [];
        for (let item in values[items.id]) {
          let obj = items.answers;
          let x = obj.find(
            ({ body }: any) => body === (items.type === "CROSSTAB" && item)
          );
          // noinspection JSUnfilteredForInLoop
          !!x && (x.value = values[items.id][item]);
          !!x && items.answered.push(x);
        }
      }
      if (items.type === "CLASSIC_CROSSTAB") {
        items.answered = [];
        for (let item in values[items.id]) {
          let obj = items.answers;
          let x = obj.find(
            ({ body }: any) =>
              body === (items.type === "CLASSIC_CROSSTAB" && item)
          );
          // noinspection JSUnfilteredForInLoop
          !!x && (x.value = values[items.id][item]);
          !!x && items.answered.push(x);
        }
      }
      //return final;
    });
    props.onSubmitForm(final);
  };
  const handlePagination = () => {
    setPaginationActive(false)
  };

  const occurrences = (page: number) => {
    let count = 0;
    for (let i = 0; i < visitedPages.length; ++i) {
      if (visitedPages[i] === page)
        count++;
    }
    return count
  };

  function itemRender(current: any, type: any, originalElement: any) {
    if (type === 'prev') {
      return <LeftOutlined />;
    }
    if (type === 'next') {
      return <RightOutlined />;
    }
    return originalElement;
  }
  useEffect(() => {
  }, [questionType]);
  const handleQestionType = (type: QuestionTypeEnum) => {
    setQuestionType(type);
  };
  const test = () => {
    let questions = props.questions as Array<SurveyQuestion>;
    let array: any = [];
    questions &&
      questions.forEach((question: any, index) => {
        if (question.type === QuestionTypeEnum.SINGLE_CHOICE) {
          array.push(
            <SingleAnswerSurvey
              question={question}
              itemNo={index + 1}
              className={props.paginated && currentPage !== index + 1 ? "none" : ""}
              key={`answer_${index}`}
              isCountdown={props.paginated}
              handlePagination={handlePagination}
              handleQuestionType={handleQestionType}
              disabled={(props.paginated && occurrences(currentPage) < 2) || !props.paginated}
            />
          );
        } else if (question.type === QuestionTypeEnum.MULTIPLE_CHOICE) {
          array.push(
            <MultipleAnswersSurvey
              question={question}
              itemNo={index + 1}
              key={`answer_${index}`}
              className={props.paginated && currentPage !== index + 1 ? "none" : ""}
              isCountdown={props.paginated}
              handlePagination={handlePagination}
              handleQuestionType={handleQestionType}
              disabled={(props.paginated && occurrences(currentPage) < 2) || !props.paginated}
            />
          );
        } else if (question.type === QuestionTypeEnum.OPEN_ENDED) {
          array.push(
            <OpenAnswersSurvey
              question={question}
              itemNo={index + 1}
              key={`answer_${index}`}
              className={props.paginated && currentPage !== index + 1 ? "none" : ""}
              handleQuestionType={handleQestionType}
            />
          );
        } else if (question.type === QuestionTypeEnum.CROSSTAB) {
          array.push(
            <CrosstabAnswersSurvey
              question={question}
              itemNo={index + 1}
              key={`answer_${index}`}
              className={props.paginated && currentPage !== index + 1 ? "none" : ""}
              handleQuestionType={handleQestionType}
            />
          );
        } else if (question.type === QuestionTypeEnum.CLASSIC_CROSSTAB) {
          array.push(
            <ClassicCrosstabAnswersSurvey
              question={question}
              itemNo={index + 1}
              key={`answer_${index}`}
              className={props.paginated && currentPage !== index + 1 ? "none" : ""}
              handleQuestionType={handleQestionType}
            />
          );
        } else if (question.type === QuestionTypeEnum.INFOBOX) {
          array.push(
            <Infobox
              question={question}
              itemNo={index + 1}
              key={`answer_${index}`}
              className={props.paginated && currentPage !== index + 1 ? "none" : ""}
              handleQuestionType={handleQestionType}
            />
          );
        }
      });
    return array;
  };
  return (
    <Form
      layout={"vertical"}
      className={"question-preview single-answer w-100"}
      onFinish={onFinish}
    //component={false}
    >
      {props.paginated && <Pagination
        className={"simple-pagination"}
        simple
        showTotal={(total, range) => `${range[1] / 10} / ${total / 10}`}
        defaultCurrent={1}
        total={test().length * 10}
        showSizeChanger={false}
        itemRender={itemRender}
        onChange={(page) => {
          setPaginationActive(true);
          setCurrentPage(page);
          setVisitedPages([...visitedPages,
            page])
        }}

        disabled={
          (questionType === QuestionTypeEnum.MULTIPLE_CHOICE ||
            questionType === QuestionTypeEnum.SINGLE_CHOICE) && (occurrences(currentPage) < 2 && paginationActive)
        }
      />}
      <div>{test()}</div>
      <br />
      <br />
      {test().length > 0 && (
        <Form.Item className="custom-confirm">
          <Button className={"button"} onClick={props.onCancel}>
            Izađi
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className={"button"}
            onClick={props.onOk}
          >
            Završi
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default SurveyForm;
