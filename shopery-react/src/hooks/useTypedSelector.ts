import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "../store/store";

export const useTypedSelector:TypedUseSelectorHook<RootState> = useSelector; // создаем и экспортируем наш хук для useSelector,только теперь он будет типизирован,указываем тип TypedUseSelectorHook и в generic указываем тип нашего состояния,который мы создали в store файле,это чтобы был типизирован хук,и были подсказки,какие редьюсеры есть у этого состояния