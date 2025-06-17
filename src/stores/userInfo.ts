import { atom } from 'recoil';
import type { ILoginInfo } from '../model/ILogin';

export const loginInfoState = atom<ILoginInfo>({
  key: 'loginInfoState',
  default: {},
});
