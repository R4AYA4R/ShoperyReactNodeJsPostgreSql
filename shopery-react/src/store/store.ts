import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { totalPagesSlice } from "./totalPagesSlice";
import { userSlice } from "./userSlice";

// если несколько редьюсеров на сайте,то можно их объединить с помощью combineReducers и передать потом в store, в данном случае slice(редьюсер) для totalPages делаем просто для практики в redux toolkit,это можно было и не делать через redux toolkit
const reducers = combineReducers({

    totalPagesReducer: totalPagesSlice.reducer, // даем название редьюсеру и указываем этот слайс totalPagesSlice(редьюсер),указываем через точку редьюсер из нашего слайса,так как не эспортировали его отдельно,но и так можно

    userSlice:userSlice.reducer // указываем еще один слайс(редьюсер) для авторизации пользователя

});

// создаем и экспортируем store
export const store = configureStore({

    reducer:reducers // указываем в reducer наш редьюсер(в данном случае мы объединили редьюсеры с помощью combineReducers и поместили в переменную reducers,их и указываем)

})

export type RootState = ReturnType<typeof store.getState> // экспортируем тип,который берем у нашего состояния в store с помощью getState