import { Result, Button } from 'antd';
import React from 'react';
import {useHistory} from "react-router";

interface Result {
  score?: number
}
const Success = ({score}:Result) => {
  const history=useHistory();
  return (
    <Result
      status="success"
      title="Položili ste!"
      subTitle={"Ostvarnih bodova: "+score}
      extra={[
        <Button type="primary" key="console" onClick={()=>history.push("/")}>
          OK
        </Button>,

      ]}
    />
  );
};

export default Success
