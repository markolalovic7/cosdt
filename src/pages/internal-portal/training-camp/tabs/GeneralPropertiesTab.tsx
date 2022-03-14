import React, { useState } from "react";
import { Button } from "antd";
import TrainingCampDetailsForm from "./TrainingCampDetailsForm";

function GeneralPropertiesTab() {
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);

  return (
    <>
      <TrainingCampDetailsForm
        actionInProgress={actionInProgress}
        setActionInProgress={setActionInProgress}
        footer={
          <Button type="primary" htmlType="submit" loading={actionInProgress}>
            Save
          </Button>
        }
      />
    </>
  );
}

export default GeneralPropertiesTab;
