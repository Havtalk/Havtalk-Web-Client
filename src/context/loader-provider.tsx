'use client';
 
import { ProgressProvider } from '@bprogress/next/app';
 
const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider 
      height="4px"
      color="oklch(0.35 0.28 293)"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};
 
export default LoaderProvider;