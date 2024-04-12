import CheckUpDetails from "@/components/admin-box/CheckUpDetails";

export interface ICheckUpDetailsPageProps {
  params: { bookingId: string };
}

export default function CheckUpDetailsPage({
  params,
}: ICheckUpDetailsPageProps) {
  return (
    <div className="">
      <CheckUpDetails bookingId={params.bookingId} />
    </div>
  );
}
