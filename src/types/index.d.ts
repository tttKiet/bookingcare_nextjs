export {};

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export interface ResData {
  statusCode: number;
  msg: string;
  data?: any;
}
export interface MenuItem {
  title: string;
  href: string;
}
