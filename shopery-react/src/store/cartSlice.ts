import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface ICartSliceInitialState{
    updateCartProducts:boolean
}

// создаем переменную дефолтного состояния слайса и указываем ей поля,и указываем ему тип на основе нашего интерфейса ICartSliceInitialState
const initialState:ICartSliceInitialState = {

    updateCartProducts:false

}

export const cartSlice = createSlice({

    name:'cartSlice', // указываем название этого slice

    initialState,  // указываем дефолтное состояние слайса(можно было написать initialState:initialState,но так как названия поля и значения совпадают,то можно записать просто initialState)

    // создаем здесь actions,которые потом смогут изменять состояние redux toolkit
    reducers:{

        // в параметре функции можно указать состояние(state) и action payload(данные,которые будем передавать этому action при вызове его в другом файле),указываем тип action payload(второму параметру этого action) PayloadAction и указываем в generic какой тип данных будем передавать потом при вызове этого action(в данном случае boolean),в данном случае в payload передаем переменную типа boolean(true или false),чтобы изменить поле у этого слайса(редьюсера)
        setUpdateCartProducts:(state,action:PayloadAction<boolean>)=>{

            state.updateCartProducts = action.payload;  // изменяем поле updateCartProducts у этого состояния на action.payload(данные,которые передадим этой функции потом при вызове,в данном случае будем передавать true или false,чтобы указать,что нужно обновить данные товаров в корзине)

        }

    }

})