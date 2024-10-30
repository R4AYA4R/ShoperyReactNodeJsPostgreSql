import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthResponse, IUser, IUserInitialState } from "../types/types";

// создаем переменную дефолтного состояния слайса и указываем ей поля,и указываем ему тип на основе нашего интерфейса IUserInitialState
const initialState:IUserInitialState = {
    user:{} as IUser, // указываем поле user и даем ей значение объекта с типом как наш IUser 

    isAuth:false, // переменная для проверки,авторизован пользователь или нет

    isLoading:false // переменная для проверки загрузки

}

// создаем и экспортируем slice(то есть редьюсер)
export const userSlice = createSlice({
    name:'userSlice', // указываем название этого slice

    initialState, // указываем дефолтное состояние слайса(можно было написать initialState:initialState,но так как названия поля и значения совпадают,то можно записать просто initialState)

    // создаем здесь actions,которые потом смогут изменять состояние redux toolkit
    reducers:{

        // в параметре функции можно указать состояние(state) и action payload(данные,которые будем передавать этому action при вызове его в другом файле),указываем тип action payload(второму параметру этого action) PayloadAction и указываем в generic какой тип данных будем передавать потом при вызове этого action(в данном случае IUser),в данном случае в payload передаем объект response(ответ от сервера),который пришел от сервера
        registrationForUser:(state,action:PayloadAction<AuthResponse>)=>{

            localStorage.setItem('token',action.payload.accessToken); // сохраняем accessToken в localStorage по ключу token,чтобы мы могли добавлять его к каждому запросу

            state.isAuth = true; // изменяем поле isAuth этого класса на true,так как уже авторизованы

            state.user = action.payload.user; // изменяем поле user у состояния на action.payload.user(данные пользователя,которые пришли от сервера,в данном случае мы передали в эту функцию registrationForUser объект с данными,которые уже пришли от сервера),так как уже авторизованы

        }

    }

})