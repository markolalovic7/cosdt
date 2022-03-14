import React from "react";
import moment from "moment";
import { Col, Collapse, Row } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { AbstractAuditingEntity } from "../../../model/domain/classes/AbstractAuditingEntity";
import { DefaultDateTimeFormat } from "../../../core/Utils";

const { Panel } = Collapse;

interface SystemInfoProps {
  entity: AbstractAuditingEntity;
}

function SystemInfoComponent({ entity }: SystemInfoProps) {
  if (!entity.id) return null;

  const genExtra = () => (
    <InfoCircleOutlined
      onClick={(event) => {
        // If you don't want click extra trigger collapse, you can prevent this:
        event.stopPropagation();
      }}
    />
  );

  return (
    <Row className="systemInfo">
      <Col offset={6} span={16}>
        <Collapse ghost>
          <Panel header="System info" key="1" extra={genExtra()}>
            <div>
              <div>
                <b>Created </b> {entity.createdBy && `by ${entity.createdBy}`}{" "}
                on {moment(entity.createdDate).format(DefaultDateTimeFormat)}
              </div>
              <div>
                <b>Modified </b>{" "}
                {entity.lastModifiedBy && `by ${entity.lastModifiedBy}`} on{" "}
                {moment(entity.lastModifiedDate).format(DefaultDateTimeFormat)}
              </div>
            </div>
          </Panel>
        </Collapse>
      </Col>
    </Row>
  );
}

export default SystemInfoComponent;
