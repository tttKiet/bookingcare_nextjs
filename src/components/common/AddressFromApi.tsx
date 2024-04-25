import { useGetAddress } from "@/hooks/use-get-address-from-code";
import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";

export interface IAddressFromApiProps {
  code: string[];
}

export default function AddressFromApi({ code }: IAddressFromApiProps) {
  const [address, setAddress] = useState("");
  useEffect(() => {
    useGetAddress({
      wardCode: code?.[0] || "",
      districtCode: code?.[1] || "",
      provinceCode: code?.[2] || "",
    })
      .then((ob) => setAddress(ob.address))
      .catch((e) => "");
  }, [code?.[1], code?.[2], code?.[3]]);
  return <div>{address || <PulseLoader color="gray" size={4} />}</div>;
}
