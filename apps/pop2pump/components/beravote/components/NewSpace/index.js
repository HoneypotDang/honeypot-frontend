import { useState } from "react";
import Stepper from "../Stepper";
import Step1 from "./Steps/Step1";
import Panel from "../styled";
import styled from "styled-components";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
`;

const NewSpace = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { label: "Space profile", Component: Step1 },
    // { label: "Vote Tokens", Component: Step2 },
    // { label: "Strategies", Component: Step3 },
  ];
  const handleprevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  return (
    <Wrapper>
      <Panel>
        <Stepper
          steps={steps}
          currentStep={currentStep}
          handleNext={handleNext}
          handleprevious={handleprevious}
        />
      </Panel>
      {/* <Panel>
        <div>sider</div>
      </Panel> */}
    </Wrapper>
  );
};

export default NewSpace;
