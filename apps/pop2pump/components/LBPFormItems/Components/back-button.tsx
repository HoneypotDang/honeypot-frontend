import { Button, ButtonProps } from "@nextui-org/react";

const BackIcon = () => {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="Frame">
        <g clip-path="url(#clip0_4822_41546)">
          <rect width="30" height="30" rx="6.25" transform="matrix(0 -1 -1 0 30 30)" fill="#202020" />
          <path id="Vector" d="M18.75 22.5L11.25 15L18.75 7.5" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_4822_41546">
          <rect width="30" height="30" rx="6.25" transform="matrix(0 -1 -1 0 30 30)" fill="white" />
        </clipPath>
      </defs>
    </svg>

  );
};

const BackButton = (props: ButtonProps) => {
  return (
    <Button color="default" startContent={<BackIcon />} variant="light" {...props} className="p-0">
      <span className="text-2xl leading-7 text-black">Back</span>
    </Button>
  );
};



export default BackButton;
