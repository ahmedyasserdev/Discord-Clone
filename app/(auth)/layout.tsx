const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="h-full flex-center">{children}</div>
    );
  };
  
  export default AuthLayout;