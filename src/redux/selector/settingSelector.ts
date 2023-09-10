import { RootState } from "../store";

export function getMode(state: RootState) {
  return state.setting.mode;
}
