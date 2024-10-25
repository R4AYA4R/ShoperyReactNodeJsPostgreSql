import { ChangeEvent, useState } from "react";
import SectionCartTop from "../components/SectionCartTop";

const Cart = () => {

    const [activeStars, setActiveStars] = useState(0);

    const [inputAmountValue, setInputAmountValue] = useState<number>(1);

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

    return (
        <main className="main">
            <SectionCartTop />
            <section className="sectionCart">
                <div className="container">
                    <div className="sectionCart__inner">
                        <h1 className="sectionCart__title">Shopping Cart</h1>
                        <div className="sectionCart__main">
                            <div className="sectionCart__main-tableCart">
                                <div className="tableCart__top">
                                    <p className="tableCart__top-text">Product</p>
                                    <p className="tableCart__top-text">Price</p>
                                    <p className="tableCart__top-text">Quantity</p>
                                    <p className="tableCart__top-text">Subtotal</p>
                                </div>
                                <div className="tableCart__products">

                                    <div className="tableCart__product-item">
                                        <div className="tableCart__item-leftBlock">
                                            <img src="/images/sectionDeals/Product Image.png" alt="" className="tableCart__item-img" />
                                            <p className="tableCart__item-text">Green Capsicum</p>
                                        </div>
                                        <p className="tableCart__item-price">$14.00</p>
                                        <div className="info__CartBlock-inputBlock">
                                            <div className="CartBlock__inputBlock-inputBtn CartBlock__inputBlock-inputBtnMinus" onClick={handlerMinusBtn}>
                                                <img src="/images/sectionProductsItemTop/Minus.png" alt="" className="inputBlock__inputBtn-img" />
                                            </div>
                                            <input type="number" className="CartBlock__inputBlock-input" onChange={changeInputValue} value={inputAmountValue} />
                                            <div className="CartBlock__inputBlock-inputBtn CartBlock__inputBlock-inputBtnPlus" onClick={handlerPlusBtn}>
                                                <img src="/images/sectionProductsItemTop/plus 1.png" alt="" className="inputBlock__inputBtn-img" />
                                            </div>
                                        </div>
                                        <p className="tableCart__item-subtotal">$70.00</p>
                                        <button className="tableCart__item-closeBtn">
                                            <img src="/images/sectionCart/Close.png" alt="" className="closeBtn__img" />
                                        </button>
                                    </div>

                                </div>

                                <div className="tableCart__bottomBlock">
                                    <button className="tableCart__bottomBlock-btn">Update Cart</button>
                                </div>
                            </div>
                            <div className="sectionCart__main-rightBlock">
                                <h4 className="sectionCart__rightBlock-title">Cart Total</h4>
                                <div className="sectionCart__rightBlock-item">
                                    <p className="sectionCart__rightBlock-itemTitle">Subtotal:</p>
                                    <p className="sectionCart__rightBlock-itemText">$84.00</p>
                                </div>
                                <div className="sectionCart__rightBlock-item">
                                    <p className="sectionCart__rightBlock-itemTitle">Shipping:</p>
                                    <p className="sectionCart__rightBlock-itemText">Free</p>
                                </div>
                                <div className="sectionCart__rightBlock-item sectionCart__rightBlock-itemBorderTop">
                                    <p className="sectionCart__rightBlock-itemTitle">Total:</p>
                                    <p className="sectionCart__rightBlock-itemText sectionCart__rightBlock-itemTextBold">$84.00</p>
                                </div>
                                <button className="sectionCart__rightBlock-btn">
                                Proceed to checkout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Cart;