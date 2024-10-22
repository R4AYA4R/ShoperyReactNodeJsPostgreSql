import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialPagesState, IPayloadPages } from "../types/types";

// создаем переменную дефолтного состояния слайса и указываем ей объект с полем totalPages,и указываем ему тип на основе нашего интерфейса IInitialPagesState
const initialState:IInitialPagesState = {
    totalPages:0
}

// создаем и экспортируем slice(то есть редьюсер)
export const totalPagesSlice = createSlice({
    name:'totalPagesSlice', // указываем название этого slice

    initialState, // указываем дефолтное состояние слайса(можно было написать initialState:initialState,но так как названия поля и значения совпадают,то можно записать просто initialState)

    // создаем здесь actions,которые потом смогут изменять состояние redux toolkit
    reducers:{

        // в параметре функции можно указать состояние(state) и action payload(данные,которые будем передавать этому action при вызове его в другом файле),указываем тип action payload(второму параметру этого action) PayloadAction и указываем в generic какой тип данных будем передавать потом при вызове этого action(в данном случае IPayloadPages)
        changeTotalPages:(state,action:PayloadAction<IPayloadPages>)=>{
            state.totalPages = Math.ceil(action.payload.totalCount / action.payload.limit); // изменяем поле totalPages у состояния на значение деления totalCount на limit(которые находятся в payload(мы их передаем при вызове потом этого action)),используем Math.ceil() - она округляет получившееся значение в большую сторону к целому числу(например,5.3 округлит к 6)
        }

    }
})