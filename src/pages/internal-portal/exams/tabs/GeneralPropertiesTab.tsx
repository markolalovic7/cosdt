import React, { useState } from "react";
import { Button } from "antd";
import ExamsDetailsForm from "./ExamsDetailsForm";

function GeneralPropertiesTab() {
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);
  
  return (
    <ExamsDetailsForm
      actionInProgress={actionInProgress}
      setActionInProgress={setActionInProgress}
      footer={
        <Button type="primary" htmlType="submit" loading={actionInProgress}>
          Save
        </Button>
      }
    />
  );
}

export default GeneralPropertiesTab;
