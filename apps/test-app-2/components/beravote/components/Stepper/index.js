import { Step, StepLabel, StepperContainer, StepLabelContainer } from "./styled"; // Adjust styled imports if necessary

// Stepper Component
const Stepper = ({ steps, currentStep, handleNext, handleprevious }) => {
  return (
    <StepperContainer>
      <StepLabelContainer>
        {steps.map((step, index) => (
          <Step
            key={index}
            isActive={currentStep === index}
            isCompleted={currentStep > index}
          >
            <StepLabel isActive={currentStep >= index}>{step.label}</StepLabel>
          </Step>
        ))}
      </StepLabelContainer>

        {steps.map((step, index) => (
          currentStep === index && (
            <step.Component
              key={index}
              handleNext={handleNext}
              handleprevious={handleprevious}
              currentStep={currentStep}
              steps={steps}
            />
          )
        ))}
    </StepperContainer>
  );
};

export default Stepper;
