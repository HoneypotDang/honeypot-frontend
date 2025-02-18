import styled from "styled-components";

// Form container styles
export const FormContainer = styled.div`
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
`;

// Styled button
export const StyledButton = styled.button`
  background-color: #ffb84d;
  color: #1a1a1a;
  font-size: 16px;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ffa500;
  }

  &:disabled {
    background-color: #444;
    cursor: not-allowed;
  }
`;

// Styled form title
export const FormTitle = styled.h2`
  color: #fff;
  text-align: center;
  margin-bottom: 30px;
`;

export const Panel = styled.div`
  padding: 32px;
  width: 100%;
  background: var(--background-0);
  border-radius: 10px;
  box-shadow: 0px 4px 31px rgba(26, 33, 44, 0.04),
    0px 0.751293px 3.88168px rgba(26, 33, 44, 0.03);
  @media screen and (max-width: 800px) {
    padding: 20px;
  }
`;

export default Panel;
