import { Button, Result } from "antd";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import MainLayoutComponent from "../../shared/layout/main-layout/MainLayout";

function ErrorPage() {
  const { params } = useRouteMatch<TemplateParams>();

  return (
    <MainLayoutComponent>
      <Result
        status="404"
        title={params.title}
        subTitle={params.description}
        extra={
          <Button href="/" type="primary">
            Back Home
          </Button>
        }
      />
    </MainLayoutComponent>
  );
}

export default ErrorPage;
