import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormContainer, StyledButton, FormTitle } from "../../styled";
import FormInput from "../../Input";
import { BtnWrapper } from "./styled";

const validationSchema = Yup.object({
  name: Yup.string()
    .max(20, "The space name cannot exceed 20 characters")
    .required("Name is required")
    .matches(/^[a-zA-Z0-9\s]+$/, "Special characters are not allowed"),
  description: Yup.string().required("Description is required"),
  website: Yup.string().url("Please enter a valid website URL"),
  twitter: Yup.string().url("Please enter a valid Twitter URL"),
  github: Yup.string().url("Please enter a valid GitHub URL"),
  doc: Yup.string().url("Please enter a valid documentation URL"),
  forum: Yup.string().url("Please enter a valid forum URL"),
});

const Step2 = ({ currentStep, steps, handleNext, handleprevious }) => {
  return (
    <Formik
      initialValues={{
        name: "",
        description: "",
        website: "",
        twitter: "",
        github: "",
        doc: "",
        forum: "",
      }}
      // validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Form Data:", values);
        handleNext();
      }}
    >
      {({ setFieldValue }) => (
        <FormContainer>
          <Form>
            {/* Name */}
            <FormInput
              label="Name"
              name="name"
              placeholder="Please enter the name of space"
            />

            {/* Description */}
            <FormInput
              label="Description"
              name="description"
              as="textarea"
              placeholder="Please enter the project description"
            />

            {/* Website (Optional) */}
            <FormInput
              label="Website (Optional)"
              name="website"
              placeholder="Please enter the website URL"
              type="url"
            />

            {/* Twitter (Optional) */}
            <FormInput
              label="Twitter (Optional)"
              name="twitter"
              placeholder="Please enter the Twitter account URL"
              type="url"
            />

            {/* GitHub (Optional) */}
            <FormInput
              label="GitHub (Optional)"
              name="github"
              placeholder="Please enter the GitHub account URL"
              type="url"
            />

            {/* Documentation (Optional) */}
            <FormInput
              label="Documentation (Optional)"
              name="doc"
              placeholder="Please enter the documentation link"
              type="url"
            />

            {/* Forum (Optional) */}
            <FormInput
              label="Forum (Optional)"
              name="forum"
              placeholder="Please enter the forum link"
              type="url"
            />

            {/* Submit Button */}
            <BtnWrapper>
              <StyledButton
                disabled={currentStep === 0}
                onClick={handleprevious}
              >
                Back
              </StyledButton>
              <StyledButton
                type="submit"
                disabled={currentStep === steps.length - 1}
              >
                Next
              </StyledButton>
            </BtnWrapper>
          </Form>
        </FormContainer>
      )}
    </Formik>
  );
};

export default Step2;
