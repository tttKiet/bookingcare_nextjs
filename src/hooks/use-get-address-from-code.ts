import axios from "axios";
import { useState } from "react";

interface AddressCode {
  wardCode: string;
  districtCode: string;
  provinceCode: string;
}

export async function useGetAddress({
  wardCode,
  districtCode,
  provinceCode,
}: AddressCode): Promise<{
  address: string;
}> {
  try {
    const [p, w, d] = await Promise.all([
      axios.get(`https://vapi.vnappmob.com/api/province`),
      axios.get(`https://vapi.vnappmob.com/api/province/ward/${districtCode}`),
      axios.get(
        `https://vapi.vnappmob.com/api/province/district/${provinceCode}`
      ),
    ]);
    // .then(([p, w, d]: any) => {

    // })
    // .catch((error) => {
    //   console.log("Use get address from code is error!!!");
    //   console.log(error);
    //   setAddress("...F5");
    // });

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

      return {
        address: `${wFilter?.ward_name}, ${dFilter?.district_name}, ${pFilter?.province_name}`,
      };
    } else {
      return { address: "" };
    }
  } catch (e) {
    console.log("Error fetching location !!!");
    return { address: "" };
  }
}
