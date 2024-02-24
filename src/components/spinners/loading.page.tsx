import { ClipLoader } from "react-spinners";

export interface LoadingPageProps {}

export function LoadingPage(props: LoadingPageProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-[2px] backdrop-saturate-50 flex items-center justify-center">
      <ClipLoader color="#3431a87d" size={28} />
    </div>
  );
}
