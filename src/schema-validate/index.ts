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

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

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
  roleId: yup.string().required("Vui lòng chọn quyền nhân viên"),
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
