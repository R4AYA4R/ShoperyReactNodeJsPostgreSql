import { ChangeEvent, useEffect, useState } from "react";
import { IProductCart } from "../types/types";

interface IProductItemCart{
    productBasket:IProductCart
}

const ProductItemCart = ({productBasket}:IProductItemCart) => {

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

    return (
        <div className="tableCart__product-item">
            <div className="tableCart__item-leftBlock">
                <img src={`/images/sectionDeals/${productBasket.image}`} alt="" className="tableCart__item-img" />
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
            <p className="tableCart__item-subtotal">${productBasketPrice}</p>
            <button className="tableCart__item-closeBtn">
                <img src="/images/sectionCart/Close.png" alt="" className="closeBtn__img" />
            </button>
        </div>
    )
}

export default ProductItemCart;