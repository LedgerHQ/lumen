import { createContext, useContext, useState } from 'react';

const SandboxContext = createContext<{
  active: string;
  setIsActive: (active: string) => void;
}>({
  active: '',
  setIsActive: () => {
    return;
  },
});

export const SandboxProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [active, setIsActive] = useState('');

  return (
    <SandboxContext.Provider value={{ active, setIsActive }}>
      {children}
    </SandboxContext.Provider>
  );
};

export const useSandboxContext = () => {
  return useContext(SandboxContext);
};
