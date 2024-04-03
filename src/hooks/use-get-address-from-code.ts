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
  const [address, setAddress] = useState<string>("loading...");
  console.log("address", { wardCode, districtCode, provinceCode });

  Promise.all([
    axios.get(`https://vapi.vnappmob.com/api/province`),
    axios.get(`https://vapi.vnappmob.com/api/province/ward/${districtCode}`),
    axios.get(
      `https://vapi.vnappmob.com/api/province/district/${provinceCode}`
    ),
  ])
    .then(([p, w, d]: any) => {
      if (w?.status === 200 && d.status === 200 && p.status === 200) {
        const pFilter = p.data.results.find(
          (province: any) => province.province_id === provinceCode
        );
        const wFilter = w.data.results.find(
          (ward: any) => ward.ward_id === wardCode
        );
        const dFilter = d.data.results.find(
          (district: any) => district.district_id === districtCode
        );

        setAddress(
          `${wFilter?.ward_name}, ${dFilter?.district_name}, ${pFilter?.province_name}`
        );
      } else {
        setAddress("");
      }
    })
    .catch((error) => {
      console.log("Use get address from code is error!!!");
      console.log(error);
      setAddress("...F5");
    });

  return { address };
}
