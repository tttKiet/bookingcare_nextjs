export {};

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

export interface ResData {
  statusCode: number;
  msg: string;
  data?: any;
}
