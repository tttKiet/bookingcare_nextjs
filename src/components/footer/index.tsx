import { Divider } from "antd";
import * as React from "react";

export default function Footer() {
  return (
    <div className=" bg-black pt-8 ">
      <div className="flex justify-center">
        <div className="container">
          <div className="grid grid-cols-12 gap-8 text-base">
            <div className="col-span-6">
              <h4 className="text-xl mb-2 text-fuchsia-500">BOOKING CARE</h4>
              <p className="text-white ">
                Chăm sóc sức khỏe hàng đầu tại Việt Nam
              </p>
            </div>
            <div className="col-span-3">
              <ul className="m-0 p-0">
                <li className="text-white">Liên hệ hợp tác</li>
                <li className="text-white mt-2">Danh bạ y tế</li>
                <li className="text-white mt-2">Sức khỏe danh nghiệp</li>
                <li className="text-white mt-2">Tuyển dụng</li>
                <li className="text-white mt-2">Câu hỏi thường gặp</li>
                <li className="text-white mt-2">Điều khoản sử dụng</li>
                <li className="text-white mt-2">Quy chế hoạt động</li>
                <li className="text-white mt-2">Quy trình khiếu nại</li>
              </ul>
            </div>
            <div className="col-span-3">
              <h4 className="text-base mb-2 text-white font-medium">Đối tác</h4>
              <p className="text-white ">Hello Doctor</p>
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-hidden">
        <Divider
          children={
            <span className="text-white text-sm">
              {" "}
              Cảm ơn bạn đã sử dụng dịch vụ
            </span>
          }
          style={{ borderColor: "#f5f5f5" }}
          orientation="center"
          className="py-16"
        />
      </div>
    </div>
  );
}
