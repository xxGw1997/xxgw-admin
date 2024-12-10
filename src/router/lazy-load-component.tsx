import { Suspense } from "react";
import { Loader } from "lucide-react";

const LazyLoadComponent = ({
  Component,
}: {
  Component: React.LazyExoticComponent<() => JSX.Element>;
}) => {
  return (
    <Suspense fallback={<Loader className="animate-spin" />}>
      <Component />
    </Suspense>
  );
};

export default LazyLoadComponent;
