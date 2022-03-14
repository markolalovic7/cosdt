import React, { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { goBack } from "../../../core/Utils";
import DataGridModalComponent from "../../../shared/components/datagrid/DataGridModal";
import TrainingCampDetailsForm from "./tabs/TrainingCampDetailsForm";


function TrainingPageDetailsModal() {
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);

  let { url } = useRouteMatch();
  let history = useHistory();

  const closeModal = () => {
    goBack(history, url);
  };

  return (
    <DataGridModalComponent
      title="Create new class"
      className="bigModal"
      isLoading={actionInProgress}
      onClose={closeModal}
      destroyOnClose={true}
    >
      <TrainingCampDetailsForm
        actionInProgress={actionInProgress}
        setActionInProgress={setActionInProgress}
        onFinish={closeModal}
      />
    </DataGridModalComponent>
  );
}

export default TrainingPageDetailsModal;
