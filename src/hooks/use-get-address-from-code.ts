import axios from "axios";
import { useState } from "react";

interface AddressCode {
  wardCode: string;
  districtCode: string;
  provinceCode: string;
}

export function useGetAddress({
  wardCode,
  districtCode,
  provinceCode,
}: AddressCode): {
  address: string;
} {
  const [address, setAddress] = useState<string>("");

  Promise.all([
    axios.get(`https://provinces.open-api.vn/api/w/${wardCode}`),
    axios.get(`https://provinces.open-api.vn/api/d/${districtCode}`),
    axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}`),
  ])
    .then(([w, d, p]: any) => {
      if (w?.status === 200 && d.status === 200 && p.status === 200) {
        setAddress(`${w.data.name}, ${d.data.name}, ${p.data.name}`);
      } else {
        setAddress("");
      }
    })
    .catch((error) => {
      console.log("Use get address from code is error!!!");
      console.log(error);
      setAddress("");
    });

  return { address };
}
