import { ChangeEvent, useEffect, useState } from "react";
import { IProductCart } from "../types/types";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useActions } from "../hooks/useActions";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../http/http";

interface IProductItemCart{
    productBasket:IProductCart,
    refetchDataProductsCart:()=>{} // указываем полю refetchDataProductsCart что это стрелочная функция 
}

// берем пропс(параметр) refetchDataProductsCart из пропсов этого компонента,эту функцию refetchDataProductsCart передаем как пропс(параметр) в этот компонент в файле Cart.tsx,эта функция для обновления массива товаров корзины
const ProductItemCart = ({productBasket,refetchDataProductsCart}:IProductItemCart) => {

    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth,используя наш типизированный хук для useSelector

    const {updateCartProducts} = useTypedSelector(state => state.cartSlice); // указываем наш слайс(редьюсер) под названием cartSlice и деструктуризируем у него поле состояния updateCartProducts,используя наш типизированный хук для useSelector

    const {setUpdateCartProducts} = useActions(); // берем actions для изменения состояния слайса(редьюсера) cartSlice у нашего хука useActions уже обернутые в диспатч,так как мы оборачивали это в самом хуке useActions


    const { mutate: mutateCartProduct } = useMutation({
        mutationKey: ['updateCartProduct'],
        mutationFn: async (productCart: IProductCart) => {
            // делаем запрос на сервер для изменения данных товара корзины,указываем тип данных,которые нужно добавить на сервер(в данном случае IProductCart),но здесь не обязательно указывать тип,передаем просто объект productCart как тело запроса
            await axios.put<IProductCart>(`${API_URL}/updateCartProduct`, productCart);
        },

        // при успешной мутации обновляем весь массив товаров корзины с помощью функции refetchDataProductsCart,которую мы передали как пропс (параметр) этого компонента
        onSuccess(){
            refetchDataProductsCart();
        }
        
    })


    const {mutate:mutateDeleteCartProduct} = useMutation({
        mutationKey:['deleteCartProduct'],
        mutationFn: async (productCart:IProductCart) => {
            // делаем запрос на сервер для удаление товара корзины, указываем тип данных,которые нужно добавить на сервер(в данном случае IProductCart),но здесь не обязательно указывать тип,передаем просто объект productCart как тело запроса
            await axios.delete<IProductCart>(`${API_URL}/deleteCartProduct/${productCart.id}`);
        },

        // при успешной мутации обновляем весь массив товаров корзины с помощью функции refetchDataProductsCart,которую мы передали как пропс (параметр) этого компонента
        onSuccess(){
            refetchDataProductsCart();
        }
    })


    const [inputAmountValue, setInputAmountValue] = useState<number>(productBasket.amount);

    const [productBasketPrice,setProductBasketPrice] = useState(productBasket.price);

    const changeInputValue = (e: ChangeEvent<HTMLInputElement>) => {
        // если текущее значение инпута > 99,то изменяем состояние инпута цены на 99,указываем + перед e.target.value,чтобы перевести текущее значение инпута из строки в число
        if (+e.target.value > 99) {
            setInputAmountValue(99);
        } else if (+e.target.value <= 0) {
            // если текущее значение инпута < или равно 0,то ставим значение инпуту 0,чтобы меньше 0 не уменьшалось
            setInputAmountValue(0);
        } else {
            setInputAmountValue(+e.target.value); // изменяем состояние инпута цены на текущее значение инпута,указываем + перед e.target.value,чтобы перевести текущее значение инпута из строки в число
        }
    }

    const handlerMinusBtn = () => {
        // если значение инпута количества товара больше 1,то изменяем это значение на - 1,в другом случае указываем ему значение 1,чтобы после нуля не отнимало - 1
        if (inputAmountValue > 1) {
            setInputAmountValue((prev) => prev - 1)
        } else {
            setInputAmountValue(1);
        }
    }

    const handlerPlusBtn = () => {
        // если значение инпута количества товара меньше 99 и больше или равно 0,то изменяем это значение на + 1,в другом случае указываем ему значение 99,чтобы больше 99 не увеличивалось
        if (inputAmountValue < 99 && inputAmountValue >= 0) {
            setInputAmountValue((prev) => prev + 1)
        } else {
            setInputAmountValue(99);
        }
    }

    // при изменении inputAmountValue изменяем состояние productBasketPrice
    useEffect(()=>{

        setProductBasketPrice(productBasket.price * inputAmountValue);

    },[inputAmountValue])

    // при изменении поля updateCartProducts у состояния слайса(редьюсера) cartSlice делаем запрос на сервер на обновление данных о товаре в корзине
    useEffect(()=>{

        console.log(updateCartProducts);

        // если updateCartProducts true, то обновляем данные товара,делаем эту проверку,чтобы не циклился запрос на переобновление массива товаров корзины,который мы делаем при обновлении данных товара,если эту проверку не сделать,то будут циклиться запросы на сервер и не будет нормально работать сайт
        if(updateCartProducts){
            mutateCartProduct({...productBasket,amount:inputAmountValue,totalPrice:productBasketPrice}); // делаем запрос на обновление данных товара корзины,разворачиваем весь объект productBasket,то есть вместо productBasket будут подставлены все поля из объекта productBasket,в поля amount и totalPrice указываем значения состояний количества(inputAmountValue) и цены товара(productBasketPrice) на этой странице
        }
        

        setUpdateCartProducts(false); // изменяем поле updateCartProducts у состояния слайса(редьюсера) cartSlice на false,чтобы указать,что данные товара обновились и потом можно было опять нажимать на кнопку обновления всех товаров корзины

    },[updateCartProducts])

    

    return (
        <div className="tableCart__product-item">
            <div className="tableCart__item-leftBlock">
                <img src={productBasket.image} alt="" className="tableCart__item-img" />
                <p className="tableCart__item-text">{productBasket.name}</p>
            </div>
            <p className="tableCart__item-price">${productBasket.price}</p>
            <div className="info__CartBlock-inputBlock">
                <div className="CartBlock__inputBlock-inputBtn CartBlock__inputBlock-inputBtnMinus" onClick={handlerMinusBtn}>
                    <img src="/images/sectionProductsItemTop/Minus.png" alt="" className="inputBlock__inputBtn-img" />
                </div>
                <input type="number" className="CartBlock__inputBlock-input" onChange={changeInputValue} value={inputAmountValue} />
                <div className="CartBlock__inputBlock-inputBtn CartBlock__inputBlock-inputBtnPlus" onClick={handlerPlusBtn}>
                    <img src="/images/sectionProductsItemTop/plus 1.png" alt="" className="inputBlock__inputBtn-img" />
                </div>
            </div>
            {/* указываем здесь значение productBasketPrice.toFixed(2),используем метод toFixed() (этот метод есть по дефолту в javaScript),этот метод форматирует число до определенного количества символов после запятой(может быть значение от 2 до 20,если значение не указать в toFixed,то по умолчанию будет 0),также этот метод автоматически округляет число к большему где это нужно(типа число 123.67 он округлит до 123.7,если стоит toFixed(1) ),в данном случае указываем это,чтобы цены товаров корзины показывались максимум с 2 цифрами после запятой,если это не указать,то у некоторых цен могут быть числа с кучей цифр после запятой */}
            <p className="tableCart__item-subtotal">${productBasketPrice.toFixed(2)}</p>
            <button className="tableCart__item-closeBtn" onClick={()=>mutateDeleteCartProduct(productBasket)}>
                <img src="/images/sectionCart/Close.png" alt="" className="closeBtn__img" />
            </button>
        </div>
    )
}

export default ProductItemCart;