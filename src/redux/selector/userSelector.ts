import { RootState } from "../store";

export function getProfileLoginStore(state: RootState) {
  return state.user;
}
