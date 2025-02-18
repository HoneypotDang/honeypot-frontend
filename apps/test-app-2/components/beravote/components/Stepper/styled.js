import styled from 'styled-components';

export const StepperContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StepLabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
`;

export const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StepLabel = styled.span`
  color: ${({ isActive, isCompleted }) => (isCompleted ? `var(--white)` : isActive ? `var(--yellow-1)` : 'grey')};
  font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
`;

