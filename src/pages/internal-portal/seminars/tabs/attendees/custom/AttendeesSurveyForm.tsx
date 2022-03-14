import React, {useEffect, useState} from "react";
import {useHistory, useRouteMatch} from "react-router-dom";
import {Modal} from "antd";

import {api} from "../../../../../../core/api";
import {Logger} from "../../../../../../core/logger";
import {FailNotification, SuccessNotification} from "../../../../../../shared/components/notifications/Notification";
import FormSurvey from "../../../../../../model/domain/classes/FormSurvey";
import {goBack} from "../../../../../../core/Utils";
import {SurveyQuestion} from "../../../../survey-management/survey-builder/SurveyBuilder";
import SurveyForm from "../../../../survey-management/survey-builder/SurveyForm";
import {UserProfile} from "../../../../../../model/domain/classes/UserProfile";

type SeminarParams = {
  id: string;
  seminarId: string;
  seminarName: string;

}

function AttendeesSurveyFormDetails() {
  const [questions, setQuestions] = useState<FormSurvey>();
  const [pitanja, postaviPitanja]  = useState<Array<SurveyQuestion>>();
  let {url, params} = useRouteMatch<SeminarParams>();
  let history = useHistory();

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  async function loadData() {
    try {
      let response = await api.takeSurvey.takeSurvey(parseInt(params.seminarId), parseInt(params.id));
      let pitanjaNiz = response?.questions;
      !!response &&
      pitanjaNiz.map((item: SurveyQuestion) => {
        if (item.isLecturer) {
          response?.lecturers?.map((lecturer: UserProfile) => {
            pitanjaNiz.push({
              ...item,
              name: `Pitanje o predavaču ${lecturer.firstName} ${lecturer.lastName}: ${item.name}`,
              lecturerId: lecturer.id,
              isLecturer: true,
              id: parseInt(`${item.id}${lecturer.id}`)
            })
          });

        }
        item.isLecturer && (pitanjaNiz = pitanjaNiz.filter(function( obj:SurveyQuestion ) {
          return obj.id !== item.id;}));
      });
      pitanjaNiz = pitanjaNiz.sort((a:any, b:any) => parseFloat(a.lecturerId) - parseFloat(b.lecturerId));
      postaviPitanja(pitanjaNiz);
      setQuestions(response);
    } catch (e) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(e);
    } finally {
    }
  }

  async function handleSubmitForm(
    questions: Array<SurveyQuestion>
  ) {
    try {
      let result = await api.takeSurvey.submitSurvey(parseInt(params.seminarId), parseInt(params.id), questions);
      SuccessNotification("Survey submitted.");
      handleOk();
    } catch (e) {
      FailNotification("Unable to submit survey.");
      Logger.error(e);
      throw e;
    }
  }

  function handleOk() {
    try {
      handleCancel();
    } catch (e) {
      FailNotification("Error. Check the logs.");
      Logger.error(e);
    }
  }

  function handleCancel() {
    goBack(history, url, 2);
  }

  return (
    <Modal
      visible={true}
      className={"bigModal custom-modal"}
      okText="Confirm"
      title={"Questions"}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      {!!pitanja && !!pitanja[0] && !!pitanja[0].type  && questions && (
        <SurveyForm
          lecturers={questions?.lecturers}
          questions={pitanja}
          onCancel={handleCancel}
          onSubmitForm={(e: any) => handleSubmitForm(e)}
        />
      )}
    </Modal>
  );
}

export default AttendeesSurveyFormDetails;
