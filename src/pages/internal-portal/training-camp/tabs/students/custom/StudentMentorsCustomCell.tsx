import React, {useState} from "react";
import {Button, Modal} from "antd";
import {Link} from "react-router-dom";
import {getValue} from "../../../../../../core/Utils";
import {Mentor} from "../../../../../../model/domain/classes/Mentor";
import {AdminRoutesEnum} from "../../../../../../model/ui/routes/AdminRoutesEnum";
import StudentsMentorsDetails from "../StudentsMentors";
import "./StudentMentorsCustomCell.scss"
import {ClassAttendee} from "../../../../../../model/domain/classes/ClassAttendee";

interface StudentMentorsCustomCellProps {
  record: ClassAttendee;
  dataIndex: string;
  handleClose: () => void
  editable: boolean
}

function StudentMentorsCustomCell({record, dataIndex, handleClose, editable}: StudentMentorsCustomCellProps) {
  let mentors: Array<Mentor> = getValue(record, dataIndex) || [];
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <React.Fragment>

      <div style={{display: "flex", flexDirection: 'column', alignItems: "center"}}>
        {
          mentors.map((mentor: Mentor) => (
            mentor.mentor && <div>
                <Button
                    className={"tag"}
                    type={"link"}
                    key={`tag-${mentor.mentor.id}`}
                >
                    <Link
                        to={{
                          pathname: `/admin-panel${AdminRoutesEnum.USER_PROFILES}/${mentor.mentor.id}/${mentor.mentor.username}/mentorship`,
                          state: {
                            tab: !editable,
                            expand: [mentor.id],
                            filters: {firstName: [record.profile.firstName], lastName: [record.profile.lastName]}
                          }
                        }}>
                      {mentor.mentor.firstName} {mentor.mentor.lastName}
                    </Link>
                </Button>
            </div>
          ))
        }
        <Button
          type={"dashed"}
          onClick={() => setShowModal(true)}
        >
          Edit mentors
        </Button>
      </div>
      {showModal && (
        <Modal
          title={"Mentors"}
          visible={true}
          className={"bigModal"}
          cancelText={"Close"}
          okButtonProps={{style: {display: "none"}}}
          onCancel={() => {
            setShowModal(false);
            handleClose()
          }}
          destroyOnClose
        >
          <StudentsMentorsDetails
            profile={record}
            id={record.id}
            editable={editable}
          />
        </Modal>
      )
      }
    </React.Fragment>
  );
}

export default StudentMentorsCustomCell;
