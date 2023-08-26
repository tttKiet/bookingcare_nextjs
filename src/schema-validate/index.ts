import * as yup from "yup";

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
