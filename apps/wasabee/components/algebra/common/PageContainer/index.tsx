interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <div className="max-w-screen-xl mx-auto w-full flex flex-col items-center justify-center">
      {children}
    </div>
  );
};

export default PageContainer;
