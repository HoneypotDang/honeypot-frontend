import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { StyledButton } from "../../styled";
import FormInput from "../../Input";
import { BtnWrapper, FormContainer } from "./styled";
import LogoUploader from "../../logoUploader";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import APIAccessPayment from "@/lib/abis/beravote/abi/APIAccessPayment.json";

const payContract = "0x7833fE2A60123b1873a6EB3277506df1416F829a";
const ethersProvider =
  typeof window !== "undefined" && window.ethereum
    ? new ethers.providers.Web3Provider(window.ethereum)
    : null;

const validationSchema = Yup.object({
  name: Yup.string()
    .max(20, "The space name cannot exceed 20 characters")
    .required("Name is required"),
  description: Yup.string().required("Description is required"),
  website: Yup.string().url("Please enter a valid website URL"),
  twitter: Yup.string().url("Please enter a valid Twitter URL"),
  forum: Yup.string().url("Please enter a valid forum URL"),
});

const createDaoSpace = async (requestBody) => {
  const cloudflareCorsProxy =
    "https://white-mud-e962.forgingblock.workers.dev/corsproxy/?apiurl=";
  try {
    const response = await fetch(
      cloudflareCorsProxy + "https://beravote.com/api/wlspaces",
      {
        method: "POST",
        //mode: 'no-cors',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Success:", data);
      return { success: true, data };
    } else {
      console.error("Error:", response.statusText);
      return { success: false, error: response.statusText };
    }
  } catch (error) {
    console.error("Request failed:", error);
    return { success: false, error };
  }
};

const handleYes = async (values, signer, paymentFee, handleNext) => {
  console.log("Form Data:", values);
  console.log("paymentFee", paymentFee);
  const address = await signer.getAddress();
  console.log(address);
  const paymentContract = new ethers.Contract(
    payContract,
    APIAccessPayment,
    signer
  );
  const tx = await paymentContract.purchaseAccessFor(address, {
    value: paymentFee,
  });
  const receipt = await tx.wait();
  if (receipt.status === 1) {
    toast.success("Transaction succeeded: Sign to create Governance Space", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    console.log("Transaction succeeded:", receipt);
    const timestamp = parseInt(Date.now() / 1000);
    const pubkey = address;

    const data = {
      name: values.name,
      description: values.description,
      symbol: values.ticker,
      decimals: 8, // usually 18, WBTC is 8 decimals
      logo: values.logo,
      website: values.website,
      forum: values.forum,
      twitter: values.twitter,
      assets: [
        {
          symbol: values.ticker,
          decimals: 8, // usually 18, WBTC is 8 decimals
          votingThreshold: "100000000", // "1000000000000000000", // voting threshold 1 token (18 decimals)
          type: "erc20",
          contract: "0x286F1C3f0323dB9c91D1E8f45c8DF2d065AB5fae",
          chain: "berachain-b2",
          votingWeight: 1,
          name: values.ticker,
          ss58Format: 80084,
        },
      ],
      weightStrategy: ["balance-of"],
      proposalThreshold: "0",
      pubkey: pubkey,
      address: pubkey,
      timestamp: timestamp,
    };

    const msg = JSON.stringify({
      ...data,
      timestamp: timestamp,
    });
    function stringToHex(str) {
      return (
        "0x" +
        Array.from(str)
          .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
          .join("")
      );
    }
    const hex = stringToHex(msg);
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [hex, address],
    });
    console.log(signature);
    const requestBody = {
      data,
      address: pubkey,
      signature: signature,
    };
    const result = await createDaoSpace(requestBody);

    if (result.success) {
      console.log("https://beravote.com/space/" + result.data.spaceId);
      toast.success(
        "Governance Space created: " +
          "https://beravote.com/space/" +
          result.data.spaceId,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    } else {
      toast.error("Failed to create Governance space", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Failed to create DAO space:", result.error);
    }
  } else {
    toast.error("Transaction failed!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    console.log("Transaction failed:", receipt);
  }
};

// Show confirmation dialog
const showConfirmation = async (values, handleNext) => {
  const signer = ethersProvider.getSigner();
  const paymentContract = new ethers.Contract(
    payContract,
    APIAccessPayment,
    signer
  );
  console.log(paymentContract);
  const paymentFee = await paymentContract.accessFee();
  confirmAlert({
    title: "Allow governance for [" + values.name + "]",
    message: (
      <div>
        Tip: while optional, creating DAO space can boost engagement.
        <br />
        Creation Price is {ethers.utils.formatEther(paymentFee)} BERA
      </div>
    ),
    buttons: [
      {
        label: "Create a Dao Space",
        onClick: () => handleYes(values, signer, paymentFee, handleNext),
      },
      // {
      //   label: 'No',
      //   onClick: () => console.log("User canceled")
      // }
    ],
  });
};

const Step1 = ({ currentStep, steps }) => {
  const [logoBase64, setLogoBase64] = useState(null);
  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setLogoBase64(base64String);
    };
    reader.readAsDataURL(file);
  };
  return (
    <Formik
      initialValues={{
        name: "",
        ticker: "",
        description: "",
        website: "",
        twitter: "",
        github: "",
        doc: "",
        forum: "",
        logo: null,
        createDaoSpace: false,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        if (values.createDaoSpace === true) {
          values.logo = logoBase64;
          values.ticker = "WBTC"; // for example we override ticker, as ticker should came from the contract address, 0x286F1C3f0323dB9c91D1E8f45c8DF2d065AB5fae in our example
          //showConfirmation(values, handleNext);
        } else {
          toast.error("We do nothing since user did not activated checkmark", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }}
    >
      {({ setFieldValue, values }) => (
        <FormContainer>
          <Form>
            {/* Name */}
            <FormInput
              label="Name"
              name="name"
              placeholder="Please enter the name of space"
            />

            {/* Ticker */}
            <FormInput
              label="Ticker"
              name="ticker"
              placeholder="Please enter the meme token ticker"
            />

            {/* Description */}
            <FormInput
              label="Description"
              name="description"
              as="textarea"
              placeholder="Please enter the project description"
            />

            <LogoUploader
              onChange={(event) => {
                const file = event.currentTarget.files[0];
                setFieldValue("logo", file);
                handleImageUpload(file);
              }}
              title="Image"
            />

            {/* Twitter (Optional) */}
            <FormInput
              label="Twitter Link"
              name="twitter"
              placeholder="Please enter the Twitter account URL"
              type="url"
            />

            {/* Forum (Optional) */}
            <FormInput
              label="Telegram Link"
              name="forum"
              placeholder="Please enter the forum link"
              type="url"
            />

            {/* Website (Optional) */}
            <FormInput
              label="Website"
              name="website"
              placeholder="Please enter the website URL"
              type="url"
            />

            {/* Create Dao Space Checkbox */}
            <div style={{ marginTop: "20px" }}>
              <Field
                id="createDaoSpace"
                name="createDaoSpace"
                type="checkbox"
              />
              <label htmlFor="createDaoSpace">
                Create Dao Space (Optional)
              </label>
            </div>

            <pre>{JSON.stringify(values, null, 2)}</pre>

            {/* Submit Button */}
            <BtnWrapper>
              <StyledButton
                type="submit"
                enabled={currentStep === steps.length - 1}
              >
                Create Coin
              </StyledButton>
            </BtnWrapper>
            <ToastContainer />
          </Form>
        </FormContainer>
      )}
    </Formik>
  );
};

export default Step1;
