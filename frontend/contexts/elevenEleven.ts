import { createContext, Dispatch, SetStateAction } from "react";

export interface IElevenEleven {
  isElevenEleven: boolean;
  setIsElevenEleven: Dispatch<SetStateAction<boolean>>;
}

export const ElevenEleven = createContext<IElevenEleven>({
  isElevenEleven: false,
  setIsElevenEleven: () => null,
});
