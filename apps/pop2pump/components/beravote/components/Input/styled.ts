import { Field } from "formik";
import styled from "styled-components";

export const InputWrapper = styled.div`
  margin-bottom: 20px;
`;

export const StyledLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 5px;
`;

export const StyledField = styled(Field)`
  color: var(--white);
  box-sizing: border-box;
  padding: 12px 0;
  width: 100%;
  border: none;
  background: var(--background-1);
  outline: none;
  ::placeholder {
    color: var(--white);
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const StyledError = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;
