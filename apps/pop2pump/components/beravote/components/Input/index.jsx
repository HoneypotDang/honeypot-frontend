import { ErrorMessage, Field } from "formik";
import { InputWrapper, StyledError, StyledLabel } from "./styled";

// Common Input Component
const FormInput = ({
  label,
  name,
  type = "text",
  placeholder,
  as = "input",
  ...rest
}) => {
  return (
    <InputWrapper>
      <StyledLabel htmlFor={name}>{label}</StyledLabel>
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        as={as}
        className="outline-none w-full  h-[60px] bg-[#2F200B] pl-3 pr-4 py-3 rounded-2xl"
        {...rest}
      />
      <ErrorMessage name={name} component={StyledError} />
    </InputWrapper>
  );
};

export default FormInput;
