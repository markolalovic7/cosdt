import React, {useEffect, useState} from "react";
import {Button, Form, Pagination} from "antd";
import {LeftOutlined, RightOutlined} from "@ant-design/icons/lib";
import draftToHtml from "draftjs-to-html";

import "./SurveyForm.scss"

import SingleAnswerSurvey from "./answers/SingleAnswerSurvey";
import MultipleAnswersSurvey from "./answers/MultipleAnswersSurvey";
import OpenAnswersSurvey from "./answers/OpenAnswerSurvey";
import CrosstabAnswersSurvey from "./answers/CrosstabAnswerSurvey";
import ClassicCrosstabAnswersSurvey from "./answers/ClassicCrostabAnswerSurvey";
import Infobox from "./answers/Infobox";
import {QuestionTypeEnum} from "../../../../model/domain/enums/QuestionTypeEnum";
import {SurveyQuestion} from "./SurveyBuilder";
import {matchPath, useHistory, useLocation, useParams} from "react-router";
import {api} from "../../../../core/api";
import {UserProfile} from "../../../../model/domain/classes/UserProfile";
import {MainRoutesEnum} from "../../../../model/ui/routes/MainRoutesEnum";
import {FailNotification, SuccessNotification} from "../../../../shared/components/notifications/Notification";

interface seminar {
  seminarId?: number,
  seminar?: number
  id: number,
  seminarName: string
}

const SurveyForm = (props: any) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationActive, setPaginationActive] = useState<boolean>(true);
  const [visitedPages, setVisitedPages] = useState<number[]>([1]);
  const [survey, setSurvey] = useState<any>();
  const [questionType, setQuestionType] = useState<QuestionTypeEnum>();
  const [pitanja, postaviPitanja] = useState<Array<SurveyQuestion>>();
  const [isPreview, setIsPreview] = useState<boolean>();
  const location = useLocation();
  const history = useHistory();
  const params = useParams() as unknown as seminar;
  useEffect(() => {
    if (props.questions===undefined) {
       loadQuestions();
      setIsPreview(false)
    }
  }, []);
  useEffect(() => {
    if (props.match && props.match.path === "/s/:seminarId") {
      alert('ok')
    }
    setIsPreview(!!matchPath(location.pathname, {
      path: "/internal-portal/survey-builder/:id",
      exact: true,
      strict: false
    }));
  }, [location]);

  const SubmitSurveyAnonimous = async (data: any) => {
    console.log('anonimni');
    console.log(data);
    try {
      params?.seminar && await api.survey.submit(+params?.seminar, data);
      history.push(`${MainRoutesEnum.SUCCESS_TEMPLATE}/HVALA/uspjesno/`)
    } catch (e) {
      console.error(e)
    }
  };
  const SubmitSurvey = async (data: any) => {
    try {
      params.seminarId && await api.takeSurvey.submitSurvey(+params.seminarId, params.id, data);
      SuccessNotification("Anketa je poslata.");
      props.onCancel && props.onCancel();
    } catch (e) {
      FailNotification("Anketa nije poslata!");
      console.error(e)
    }
  };
  const onFinish = (values: any) => {
    let final = props.questions ? props.questions : pitanja;
    console.log(values);
    final.forEach((items: any,) => {
      console.log(items);
      if (items.type === QuestionTypeEnum.SINGLE_CHOICE) {
        let obj = items.answers;
        items.answered = [];
        console.log(values[items.id]);
        items.answered.push(obj.find(({id}: any) => id === values[items.id]));
      }
      if (items.type === QuestionTypeEnum.MULTIPLE_CHOICE) {
        let obj = items.answers;
        items.answered = [];
        values[items.id].forEach((item: any) => {
          let x = obj.find(({id}: any) => id === item);
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
            ({body}: any) => body === (items.type === "CROSSTAB" && item)
          );
          // noinspection JSUnfilteredForInLoop
          !!x && (x.value = values[items.id][item]);
          !!x && items.answered.push(x);
        }
      }
      if (items.type === "CLASSIC_CROSSTAB") {
        items.answered = [];
        let answered = values[items.id];
        let test = [...items.answers];
        items.answered = (test.map((a1: any) => {
          return {...a1, value: answered[a1.body]}
        }));
      }

    });
    props.questions ? SubmitSurvey(final) : SubmitSurveyAnonimous(final)
  };
  const handlePagination = () => {
    setPaginationActive(false)
  };


  function itemRender(current: any, type: any, originalElement: any) {
    if (type === 'prev') {
      return <LeftOutlined/>;
    }
    if (type === 'next') {
      return <RightOutlined/>;
    }
    return originalElement;
  }

  useEffect(() => {
  }, [questionType, survey]);
  const handleQestionType = (type: QuestionTypeEnum) => {
    setQuestionType(type);
  };
  const loadQuestions = async () => {
    try {
      let response =  (params.seminar || params.seminarId) && await api.survey.getSurvey(params.seminarId?params.seminarId!:params.seminar!);
      let pitanjaNiz = response?.questions;
      !!response &&
      pitanjaNiz.map((item: SurveyQuestion, index: number) => {
        if (item.isLecturer) {
          response?.lecturers?.map((lecturer: UserProfile) => {
            pitanjaNiz.push({
              ...item,
              name:  item.name,
              lecturerId: lecturer.id,
              lecturerName: lecturer.firstName + " " + lecturer.lastName,
              isLecturer: true,
              id: parseInt(`${index}${lecturer.id}`)
            })
          });

        }
        item.isLecturer && (pitanjaNiz = pitanjaNiz.filter(function (obj: SurveyQuestion) {
          return obj.id !== item.id;
        }));
      });
      pitanjaNiz = pitanjaNiz.sort((a: any, b: any) => parseFloat(a.lecturerId) - parseFloat(b.lecturerId));
      postaviPitanja(pitanjaNiz);
      setSurvey(response)
    } catch (e) {
      console.log(e);
      history.push(`${MainRoutesEnum.ERROR_TEMPLATE}/GREŠKA/${e}`)
    }
  };

  const test = () => {
    const questions = pitanja ? pitanja : props.questions as Array<SurveyQuestion>;
    let array: any = [];
    !!questions && !isPreview &&
    questions.map((question: any, index: number) => {
      if (question.type === QuestionTypeEnum.SINGLE_CHOICE /*&& !question.isLecturer*/) {
        array.push(
          <SingleAnswerSurvey
            question={question}
            itemNo={index + 1}
            className={props.paginated && currentPage !== index + 1 ? "none" : ""}
            key={`answer_${index}`}
            isCountdown={props.paginated}
            handlePagination={handlePagination}
            handleQuestionType={handleQestionType}
          />
        );
      } else if (question.type === QuestionTypeEnum.MULTIPLE_CHOICE /*&& !question.isLecturer*/) {
        array.push(
          <MultipleAnswersSurvey
            question={question}
            itemNo={index + 1}
            key={`answer_${index}`}
            className={props.paginated && currentPage !== index + 1 ? "none" : ""}
            isCountdown={props.paginated}
            handlePagination={handlePagination}
            handleQuestionType={handleQestionType}
          />
        );
      } else if (question.type === QuestionTypeEnum.OPEN_ENDED /*&& !question.isLecturer*/) {
        array.push(
          <OpenAnswersSurvey
            question={question}
            itemNo={index + 1}
            key={`answer_${index}`}
            className={props.paginated && currentPage !== index + 1 ? "none" : ""}
            handleQuestionType={handleQestionType}
          />
        );
      } else if (question.type === QuestionTypeEnum.CROSSTAB /*&& !question.isLecturer*/) {
        array.push(
          <CrosstabAnswersSurvey
            question={question}
            itemNo={index + 1}
            key={`answer_${index}`}
            className={props.paginated && currentPage !== index + 1 ? "none" : ""}
            handleQuestionType={handleQestionType}
          />
        );
      } else if (question.type === QuestionTypeEnum.CLASSIC_CROSSTAB /*&& !question.isLecturer*/) {
        array.push(
          <ClassicCrosstabAnswersSurvey
            question={question}
            itemNo={index + 1}
            key={`answer_${index}`}
            className={props.paginated && currentPage !== index + 1 ? "none" : ""}
            handleQuestionType={handleQestionType}
          />
        );
      } else if (question.type === QuestionTypeEnum.INFOBOX && !question.isLecturer) {
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
    !!questions && !!isPreview &&
    questions.map((question: any, index: number) => {
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
      />}
      <div>{test()}</div>
      <br/>
      <br/>
      {test().length > 0 && (
        <Form.Item className="custom-confirm">
          <Button className={"button"} onClick={props.onCancel}>
            Exit
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className={"button"}
            onClick={props.onOk}
          >
            Finish
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default SurveyForm;
