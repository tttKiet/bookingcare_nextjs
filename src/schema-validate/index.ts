import { Working } from "@/models";
import * as yup from "yup";
const FILE_SIZE = 2000000;
export const schemaValidateLoginForm = yup.object().shape({
  email: yup
    .string()
    .required("Vui lòng điền email.")
    .email("Email không đúng định dạng."),
  password: yup.string().required("Vui lòng điền mật khẩu."),
  rememberMe: yup.boolean(),
});

export const schemaValidateRegister = yup.object().shape({
  fullName: yup.string().required("Vui lòng điền tên của bạn."),
  email: yup
    .string()
    .required("Vui lòng điền email.")
    .email("Email không đúng định dạng."),

  phone: yup
    .string()
    .required("Vui lòng số điện thoại.")
    .test("phone", "Số điện thoại không đúng định dạng.", function (value) {
      const phoneRegExp = /^\+?[0-9]{10,}$/; // Định dạng số điện thoại, ví dụ: +84912345678 hoặc 0912345678
      return phoneRegExp.test(value);
    }),
  password: yup.string().required("Vui lòng điền mật khẩu."),
  rePassword: yup
    .string()
    .required("Vui lòng nhập lại mật khẩu.")
    .test("match", "Mật khẩu nhập lại không đúng.", function (value) {
      return value === this.parent.password;
    }),

  address: yup.string().required("Vui lòng nhập địa chỉ."),
  gender: yup.string().required("Vui lòng chọn giới tính."),
  checkTerm: yup
    .boolean()
    .oneOf([true], "Bạn chưa đồng ý với các điều khoản của chúng tôi."),
});

export const schemaHealthFacilityBody = yup.object().shape({
  email: yup
    .string()
    .required("Vui lòng điền email.")
    .email("Email không đúng định dạng."),

  phone: yup
    .string()
    .required("Vui lòng số điện thoại.")
    .test("phone", "Số điện thoại không đúng định dạng.", function (value) {
      const phoneRegExp = /^\+?[0-9]{10,}$/; // Định dạng số điện thoại, ví dụ: +84912345678 hoặc 0912345678
      return phoneRegExp.test(value);
    }),

  name: yup.string().required("Vui lòng nhập tên cơ sở y tế."),
  address: yup.string().required("Vui lòng nhập địa chỉ."),
  typeHealthFacilityId: yup.string().required("Vui lòng chọn loại bệnh viện."),
  files: yup
    .array()
    .min(1, "Vui lòng tải lên ảnh")
    .max(3, "Tối đa 3 ảnh")
    .test("fileType", "Định dạng không được hổ trợ", function (value) {
      if (!value || value.length === 0) return true; // Bỏ qua nếu không có tệp ảnh
      const isValid = value.every((file) => {
        return SUPPORTED_FORMATS.includes(file.type);
      });
      return isValid;
    })
    .test(
      "fileSize",
      "Vui lòng tải hình với kích thước < 2mb",
      function (value) {
        if (!value || value.length === 0) return true; // Bỏ qua nếu không có tệp ảnh
        const isValid = value.every((file) => {
          if (file?.size) {
            return file.size <= FILE_SIZE;
          }
          return true;
        });
        return isValid;
      }
    ),
});

const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png",
  "image/webp",
];

export const schemaSpecialistBody = yup.object().shape({
  name: yup.string().required("Vui lòng tên chuyên khoa."),
  descriptionDisease: yup
    .string()
    .required("Vui lòng điền mô tả của bác sỉ.")
    .max(1000, "Chỉ được điền từ đến 1000 kí tự tối đa."),
  descriptionDoctor: yup
    .string()
    .required("Vui lòng điền mô tả của bác sỉ.")
    .max(1000, "Chỉ được điền từ đến 1000 kí tự tối đa."),
});

export const schemaStaffBody = yup.object().shape({
  fullName: yup.string().required("Vui lòng điền tên nhân viên."),
  email: yup
    .string()
    .required("Vui lòng điền email.")
    .email("Email không đúng định dạng."),

  phone: yup
    .string()
    .required("Vui lòng số điện thoại.")
    .test("phone", "Số điện thoại không đúng định dạng.", function (value) {
      const phoneRegExp = /^\+?[0-9]{10,}$/; // Định dạng số điện thoại, ví dụ: +84912345678 hoặc 0912345678
      return phoneRegExp.test(value);
    }),
  password: yup.string().required("Vui lòng điền mật khẩu."),
  rePassword: yup
    .string()
    .required("Vui lòng nhập lại mật khẩu.")
    .test("match", "Mật khẩu nhập lại không đúng.", function (value) {
      return value === this.parent.password;
    }),
  address: yup.string().required("Vui lòng nhập địa chỉ."),
  gender: yup.string().required("Vui lòng chọn giới tính."),
  academicDegreeId: yup.string().required("Vui lòng chọn vị trí , danh hiệu."),
  specialistId: yup.string().required("Vui lòng chọn chuyên khoa."),
  experience: yup.string().required("Vui lòng điền kinh nghiệm làm việc."),
  certificate: yup.string().required("Vui lòng điền bằng cấp."),
});

export const schemaWorkingBody = yup.object().shape({
  staffId: yup.string().required("Vui lòng chọn bác sỉ."),
  healthFacilityId: yup.string().required("Vui lòng chọn cơ sở y tế."),
  startDate: yup.object().required("Vui lòng chọn ngày bắt đầu."),
  endDate: yup.object().nullable(),
});

export const schemaClinicRoomBody = yup.object().shape({
  roomNumber: yup.number().required("Vui lòng điền số phòng."),
  capacity: yup.number().required("Vui lòng điền sức chứa."),
});

export const schemaWorkClinicRoomBody = yup.object().shape({
  checkUpPrice: yup.number().required("Vui lòng điền số tiền khám."),
  workingId: yup.string().required("Vui lòng chọn bác sỉ cần thêm."),
  applyDate: yup.object().required("Vui lòng chọn ngày áp dụng."),
});

export const schemaCodeBody = yup.object().shape({
  key: yup.string().required("Vui lòng điền mã."),
  name: yup.string().required("Vui lòng chọn tên mã."),
  value: yup.string().required("Vui lòng điền giá trị."),
});

export const schemaCodeScheduleHealth = yup.object().shape({
  workingId: yup.string().required("Vui lòng chọn nhân viên."),
  timeCodeArray: yup
    .array()
    .required("Vui lòng chọn thời gian")
    .min(1, "Vui lòng chọn thời gian."),
  maxNumber: yup
    .number()
    .required("Vui điền số lượng tối đã khám trong một thời gian."),
  date: yup.object().required("Vui lòng chọn ngày khám."),
});

export const schemaCedicineBody = yup.object().shape({
  name: yup.string().required("Vui lòng tên thuốc."),
  price: yup
    .number()
    .required("Vui lòng điền đơn giá.")
    .min(0, "Giá không được <= 0 vnđ."),
});
