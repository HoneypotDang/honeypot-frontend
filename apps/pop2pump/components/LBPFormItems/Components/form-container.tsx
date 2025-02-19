import React, { HTMLProps, PropsWithChildren } from 'react'

interface FormContainerProps extends PropsWithChildren<HTMLProps<HTMLDivElement>> { }

function FormContainer({ children, ...props }: FormContainerProps) {
   return (
      <div  {...props} className={`mt-[24px] text-[#202020] px-4 py-5 md:p-10 bg-white rounded-3xl border border-dashed border-black ${props.className}`}>{children}</div>
   )
}

export default FormContainer