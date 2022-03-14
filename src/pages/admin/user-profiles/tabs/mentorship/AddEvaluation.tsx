import React from "react";
import {Button} from "antd";

interface AddEvaluationProps{
    disabled: boolean
    handleEvaluate(): void
}
const AddEvaluation = ({handleEvaluate, disabled}:AddEvaluationProps) =>{
    return(
        <Button type={"primary"} onClick={handleEvaluate} disabled={disabled}>Ocijeni</Button>
    )
}

export default AddEvaluation