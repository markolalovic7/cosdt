import React, { useState } from "react";
import { Button } from "antd";
import SeminarsDetailsForm from "./SeminarsDetailsForm";

function GeneralPropertiesTab() {
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);

  return (
    <SeminarsDetailsForm
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
