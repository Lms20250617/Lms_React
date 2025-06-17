import { atom } from 'recoil';

// 모달 생성을 도와주는 전역상태
// isOpen : 모달을 생성의 유무 (true: 열림, false: 닫힘)
// type : 모달 역할에 대한 명시, 페이지 내에 여러 모달이 있는 경우 사용하면 될 듯
// payload : 모달이 생성되었을 때, props로 넘겨줄 값
interface IModalState {
  isOpen: boolean;
  type?: string | null;
  payload?: unknown;
  // unknown
  // 모든 타입에 값을 할당될 수 있는 any와 비슷하나,
  // unknown 타입은 any 타입 외의 어떤 타입에도 할당할 수 없다

  // 예시)
  // let unknownType:unknown
  // let booleanType:boolean = unknownType
  // error boolean 타입에는 unknown 타입을 할당할 수 없음

  // let booleanType:boolean = true
  // let unknownType:unknown = unknownType
  // 반대로 unknown 타입에 boolean 타입을 할당하는 건 할 수 있습니다.
  // 출처. https://xionwcfm.tistory.com/394
}

export const modalState = atom<IModalState>({
  key: 'modalState',
  default: {
    isOpen: false,
    type: null,
    payload: undefined,
  },
});
