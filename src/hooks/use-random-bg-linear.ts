const bg = {
  bg1: "linear-gradient(90deg, hsla(332, 53%, 82%, 0.8) 0%, hsla(176, 57%, 89%, 1) 80%)",
  bg2: "linear-gradient(90deg, hsla(186, 33%, 94%, 0.9) 0%, hsla(216, 41%, 79%, 1) 80%)",
};

export function userRandomBgLinearGradient() {
  const keys = Object.keys(bg);
  const randomIndex = Math.floor(Math.random() * keys.length);
  const randomKey = keys[randomIndex] as keyof typeof bg;
  return [bg[randomKey]];
}
