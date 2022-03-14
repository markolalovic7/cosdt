import React, {useContext, useEffect, useState} from "react";
import {DataGridRowContext, DataGridRowContextType,} from "../../../../../../model/ui/types/DataGridRowContextType";
import {Button, Modal, Progress} from "antd";
import {CaretRightOutlined, CheckOutlined} from "@ant-design/icons/lib";
import {useHistory} from "react-router";
import {ExamAttendeeEnum} from "../../../../../../model/domain/enums/ExamAttendeeEnum";
import {ExamAttendee} from "../../../../../../model/domain/classes/ExamAttendee";
import {AdminRoutesEnum} from "../../../../../../model/ui/routes/AdminRoutesEnum";
import {api} from "../../../../../../core/api";

interface ExamsProps {
  type: ExamAttendeeEnum | undefined

  onAccept?(examId: number, userId: number): Promise<void>
  handleApply?(examId:number): Promise<void>
}

function ExamsCustomRowActionsComponent({
                                          type,
                                          onAccept,
                                          handleApply
                                        }: ExamsProps) {
  const [modal, setModal] = useState<boolean>(false);
  const [profile, setProfile] = useState<number>();
  let {record} = useContext<DataGridRowContextType<ExamAttendee>>(
    DataGridRowContext
  );
  useEffect(()=>{
    // noinspection JSIgnoredPromiseFromCall
    getUser()
  },[]);
  async function getUser(){
    let rec = await api.userProfile.getUserProfile();
    setProfile(rec.id)

  }
  const history = useHistory();
  const examId = record.exam?.id;
  const routeChange = () => {
    let path = `/admin-panel${AdminRoutesEnum.EXAM_FORM}`;
    history.push({
      pathname: path,
      state: {examId}
    });
  };
  const addProgress = (number: number, color: string) => {
    let array = [];
    for (let i = 0; i < number; i++) {
      array.push(<Progress percent={100} steps={0} strokeColor={color} showInfo={false}/>)
    }
    return array
  };

  let maxTries = record.exam?.maxTries === undefined ? 0 : record.exam?.maxTries;
  const noOfTriesRemaining = () => {
    let array = [];
    array.push(addProgress((maxTries - record?.noOfTries), "green"));
    array.push(addProgress((record?.noOfTries), "#cecece"));
    return array
  };
  return (
    <React.Fragment>
      {record &&
      type !== ExamAttendeeEnum.EXAM_FAILED &&
      type !== ExamAttendeeEnum.EXAM_PASSED &&
      type !== ExamAttendeeEnum.INVITATION_SENT &&
      type !== undefined &&
      profile === record.profile.id &&(
        <Button
          onClick={() => setModal(true)}
          icon={<CaretRightOutlined/>}
          type="link"
          style={{marginRight: 4}}
        >Započni polaganje</Button>
      )}
      {record &&
      onAccept &&
      type === ExamAttendeeEnum.INVITATION_SENT && (
        <Button
          onClick={() => onAccept(record.exam.id, record.id)}
          icon={<CheckOutlined/>}
          type="link"
          style={{marginRight: 4}}
        >Prihvati pozivnicu</Button>
      )}
      {record &&
      handleApply &&
       (
        <Button
          onClick={() => handleApply(record.id)}
          icon={<CheckOutlined/>}
          type="link"
          style={{marginRight: 4}}
        >Izaberi ispit</Button>
      )}
      {modal &&
      <Modal
          title={"eLearning"}
          visible={true}
          className={"smallModal"}
          cancelText={"Close"}
          onOk={routeChange}
          okButtonProps={maxTries <= record.noOfTries ? {style: {display: "none"}} : undefined}
          onCancel={() => setModal(false)}
          destroyOnClose
      >
          <h1>{record.exam?.name}</h1>
          <h3>Pokušaji:</h3>
          <div>
              <div style={{display: "flex"}}>
                {noOfTriesRemaining()}
              </div>
          </div>
        {maxTries > record.noOfTries ? "Da li ste sigurni da Želite da pokrenete test?" : "Nemate više pokušaja!"}
      </Modal>
      }
    </React.Fragment>
  );
}

export default ExamsCustomRowActionsComponent;
