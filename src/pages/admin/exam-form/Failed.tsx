import { Result, Button } from 'antd';
import React from 'react';
import {useHistory} from "react-router";
interface Result {
  score?: number
}

const Fail= ({score}:Result) => {
  const history=useHistory();
  return (
    <Result
      status="error"
      title="Niste položili"
      subTitle={"Ostvarenih bodova: "+ score}
      extra={[
        <Button type="primary" key="console" onClick={()=>history.push("/")}>
          OK
        </Button>,
      ]}
    >
    </Result>
  );
};


export default Fail
