async function sendCaptchPhone() {
  const phoneAuthProvider = new firebase.auth.PhoneAuthProvider();
  return phoneAuthProvider.verifyPhoneNumber(
    "+84967688854",
    window.recaptchaVerifier
  );
}

React.useEffect(() => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      elementRef?.current,
      {
        size: "invisible",
      }
    );
  }
});
