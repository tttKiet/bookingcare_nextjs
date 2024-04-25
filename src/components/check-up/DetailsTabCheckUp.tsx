import dynamic from "next/dynamic";
import { LoadingPage } from "../spinners";

export interface IDetailsTabCheckUpProps {}
const HealthRecordDetails = dynamic(() => import("./HealthRecordDetails"), {
  loading: () => <LoadingPage />,
  ssr: false,
});

export default function DetailsTabCheckUp(props: IDetailsTabCheckUpProps) {
  return (
    <div>
      <HealthRecordDetails />
    </div>
  );
}
