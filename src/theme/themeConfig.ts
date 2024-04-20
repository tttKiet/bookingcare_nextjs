import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {},

  components: {
    Layout: {
      colorTextBase: "#000",
      // colorFillContent: "#000",
    },
    Menu: {
      fontWeightStrong: 500,
      itemHoverBg: "transparent",
      itemSelectedBg: "#e6f4ff",
      itemSelectedColor: "#2884FF",
      itemHoverColor: "#66AAF9",
      itemMarginBlock: "6px",
      motionDurationSlow: "100",
    },
  },
};

export default theme;
