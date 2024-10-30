import { useDispatch } from "react-redux";
import { totalPagesSlice } from "../store/totalPagesSlice";
import { useMemo } from "react";
import { bindActionCreators } from "@reduxjs/toolkit";
import { userSlice } from "../store/userSlice";

const rootActions = {
    ...totalPagesSlice.actions, // разворачиваем все actions(функции,через которые будем менять состояние в redux toolkit) из нашего слайса в этот объект

    ...userSlice.actions  // разворачиваем все actions из нашего слайса userSlice в этот объект
}

export const useActions = ()=>{

    const dispatch = useDispatch(); // указываем диспатч

    // возвращаем хук useMemo,чтобы данные кешировались и изменялись только при изменении dispatch(указываем его в квадартных скобках),bindActionCreators-фукция,которая позволяет обернуть все actions в диспатч,чтобы было удобнее потом использовать диспатч(чтобы потом не прописывать отдельно dispatch,а сразу указывать action из этого хука useActions)
    return useMemo(()=>bindActionCreators(rootActions,dispatch),[dispatch]);
}