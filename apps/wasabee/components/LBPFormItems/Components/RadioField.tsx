import {
  RadioGroup,
  Radio,
  useRadio,
  VisuallyHidden,
  RadioProps,
  cn,
} from "@nextui-org/react";

const RadioField = (props: RadioProps) => {
  const {
    Component,
    children,
    isSelected,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio({
    classNames: {
      labelWrapper: "ml-0",
      label: "text-xl",
    },
    ...props,
  });
  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group inline-flex items-center justify-between hover:bg-[#86521533]",
        "w-fit cursor-pointer border-1 border-[#b56d16] rounded-xl gap-4 px-6 py-1.5",
        "data-[selected=true]:bg-[#865215] data-[selected=true]:font-extrabold"
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
        <span {...getWrapperProps()}>
          <span {...getControlProps()} />
        </span>
      </VisuallyHidden>
      <div {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <span className="text-small text-foreground opacity-70">
            {description}
          </span>
        )}
      </div>
    </Component>
  );
};

export default RadioField;
