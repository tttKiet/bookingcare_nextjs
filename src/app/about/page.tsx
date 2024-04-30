import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/react/20/solid";
import flask from "../../assets/images/hospital.png";
import Image from "next/image";
export default function AboutPage() {
  return (
    <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
          />
        </svg>
      </div>
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <p className="text-base font-semibold leading-7 text-indigo-600">
                Booking care
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Đặt lịch nhanh hơn
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-700">
                Với trang web được thế kế tối giản, đội ngủ desginer cũng nhập
                các lập trình viên đã cố gắn làm việc để mang đến cho người dùng
                một dịch vụ tốt nhất. Bên cạnh đó người dùng có thể tìm kiếm và
                đặt lịch một cách nhanh chóng.
              </p>
            </div>
          </div>
        </div>
        <div className="lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden flex flex-col gap-3">
          <div className="flex gap-3 items-center justify-center p-3">
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
          </div>
          <div className="flex gap-3 items-center justify-center p-3 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
          </div>
          <div className="flex gap-3 items-center justify-center p-3">
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
          </div>
          <div className="flex gap-3 items-center justify-center p-3 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
          </div>
          <div className="flex gap-3 items-center justify-center p-3">
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
          </div>
          <div className="flex gap-3 items-center justify-center p-3 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
          </div>
          <div className="flex gap-3 items-center justify-center p-3">
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
            <div className="ring-1 bg-black/50 w-[400px] p-4 rounded-xl "></div>
          </div>
        </div>
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
              <p>
                Giúp người dùng truy cập vào bệnh viện đặt lịch và thanh toán dể
                dàng mà không cần vào bệnh viện, điều đó giúp mọi người dể dàng
                hơn trong việc quản lý thời gian.
              </p>
              <ul role="list" className="mt-8 space-y-8 text-gray-600">
                <li className="flex gap-x-3">
                  <CloudArrowUpIcon
                    className="mt-1 h-5 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Kinh nghiệm
                    </strong>
                    Với hơn một thập kỷ kinh nghiệm, chúng tôi đã xây dựng được
                    uy tín vững chắc trong ngành và luôn không ngừng phát triển
                    để cung cấp những sản phẩm và dịch vụ tối ưu nhất. Sự sáng
                    tạo, chất lượng và tận tâm là những giá trị cốt lõi tạo nên
                    sự khác biệt của Booking care.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <LockClosedIcon
                    className="mt-1 h-5 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Bảo mật toàn diện.
                    </strong>
                    Với các dịch vụ bảo mật trên website giúp người dùng bảo mật
                    lịch khám của mình.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <LockClosedIcon
                    className="mt-1 h-5 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Chứng chỉ quốc tế.
                    </strong>{" "}
                    Các Bác sĩ có nhiều kinh nghiệm bên cạnh đó cũng có nhiều
                    bằng cấp đặc biệt là chứng chỉ quố tế.
                  </span>
                </li>
              </ul>
              <p className="mt-8">
                Tầm nhìn của chúng tôi là trở thành đối tác đáng tin cậy hàng
                đầu, mang lại giá trị lâu dài cho khách hàng và cộng đồng. Sứ
                mệnh của chúng tôi là xây dựng và phát triển một môi trường làm
                việc tích cực, nơi mọi thành viên đều có cơ hội phát triển và
                góp phần vào sự thành công chung của công ty.
              </p>
              <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
                Server truy cập nhanh
              </h2>
              <p className="mt-6">
                Máy chủ được cấu hình cực mạnh điều đó giúp người dùng có tốc độ
                truy cập nhanh chóng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
