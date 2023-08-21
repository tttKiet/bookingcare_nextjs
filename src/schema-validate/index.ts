import * as yup from "yup";

export const schemaValidateLoginForm = yup.object().shape({
  email: yup
    .string()
    .required("Vui lòng điền email!")
    .email("Email không đúng định dạng!"),
  password: yup.string().required("Vui lòng điền mật khẩu!"),
});
