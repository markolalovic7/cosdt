import * as React from "react";
import { Card, Col, Row, Statistic } from "antd";
import { useHistory, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { api } from "../../../core/api";
import { FailNotification, SuccessNotification } from "../../../shared/components/notifications/Notification";
import { Logger } from "../../../core/logger";
import SurveyStart from "../../../model/domain/classes/SurveyStart";
import SurveyForm from "../../internal-portal/forms-management/survey-builder/SurveyForm";
import { SurveyQuestion } from "../../internal-portal/forms-management/survey-builder/SurveyBuilder";


const ExamForm = () => {

  const [record, setRecords] = useState<SurveyStart>();
  const location = useLocation();
  const history = useHistory();
  //@ts-ignore
  const id = location.state.examId;

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function loadData() {
    try {
      let record = await api.examTest.get(parseInt(id));
      setRecords(record);
    } catch (error) {
      FailNotification("Greška pri učitavanju. Check the logs.");
      Logger.error(error);
    }
  }
  async function handleSubmitForm(
    questions: Array<SurveyQuestion>
  ) {
    try {
      let instanceId= record?.examInstanceId as number;
      let result = await api.examTest.submit(instanceId, questions);
      SuccessNotification("Ispit završen.");
      history.push({ pathname: "result", state: result })
    } catch (e) {
      FailNotification("Greška.");
      Logger.error(e);
      throw e;
    }
  }

  return (
    <>
      <h1>{record?.examFormDefinition?.name}</h1>
      <Row gutter={32}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Maksimalni broj pokušaja"
              value={record?.maxTries}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic
              title="Id ispita"
              value={record?.examInstanceId}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic
              title="Broj pokušaja"
              value={record?.noOfTries}
              valueStyle={{ color: '#1a64fb' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Potrebni rezultat"
              value={record?.minToPassExam}
              valueStyle={{ color: '#1a64fb' }}
              suffix={"%"}
            />
          </Card>
        </Col>
        {record?.examFormDefinition?.estimatedTime !==null &&
          <Col span={5}>
            <Card>
              <Statistic
                title="Predviđeno potrebno vrijeme"
                value={record?.examFormDefinition?.estimatedTime}
                valueStyle={{color: '#1a64fb'}}
                suffix={"min"}
              />
            </Card>
          </Col>
        }
      </Row>
      { record?.examFormDefinition?.questions &&
        <SurveyForm
          {...record?.examFormDefinition}
          paginated={record.examFormDefinition.pagination}
          onSubmitForm={handleSubmitForm}
        />
      }
    </>
  )
};

export default ExamForm;
