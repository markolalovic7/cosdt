import React from "react";
import { Button, Result } from "antd";
import { useRouteMatch } from "react-router-dom";
import MainLayoutComponent from "../../shared/layout/main-layout/MainLayout";

function SuccessPage() {
  const { params } = useRouteMatch<TemplateParams>();

  return (
    <MainLayoutComponent>
      <Result
        status="success"
        title={params.title}
        subTitle={params.description}
        extra={[
          <Button href="/" type="primary">
            Back Home
          </Button>,
        ]}
      />
    </MainLayoutComponent>
  );
}

export default SuccessPage;
