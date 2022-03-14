import React, {useContext} from "react"
import {Button} from "antd";
import {ExportOutlined} from "@ant-design/icons/lib";
import {Seminar} from "../../../../model/domain/classes/Seminar";
import {DataGridRowContext, DataGridRowContextType} from "../../../../model/ui/types/DataGridRowContextType";

interface customProps {
  onDetails(rec:Seminar): void
}

const CostSheetCustomRowComponent = ({onDetails}: customProps) => {
  let { record } = useContext<DataGridRowContextType<Seminar>>(
    DataGridRowContext
  );
  return (
    <div>
      <Button
        type="link"
        icon={<ExportOutlined/>}
        onClick={()=>onDetails(record)}
      >
        details
      </Button>
    </div>
  )
};
export default CostSheetCustomRowComponent;
