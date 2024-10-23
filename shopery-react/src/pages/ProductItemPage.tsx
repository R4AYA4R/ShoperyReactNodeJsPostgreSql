import { ChangeEvent, useRef, useState } from "react";
import SectionCatalogTop from "../components/SectionCatalogTop";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { IProduct } from "../types/types";
import SectionProductItemPageTop from "../components/SectionProductItemPageTop";

const ProductItemPage = () => {

    const [inputAmountValue,setInputAmountValue] = useState<number>(1);

    const sectionProductItemTopRef = useRef(null);

    const onScreen = useIsOnScreen(sectionProductItemTopRef);

    const params = useParams(); // с помощью useParams получаем параметры из url (в данном случае id товара)

    const { data } = useQuery({
        queryKey: ['productIdPage'],
        queryFn: async () => {
            // делаем запрос на сервер по конкретному id(в данном случае указываем params.id, то есть id,который взяли из url),который достали из url,указываем тип данных,которые вернет сервер(в данном случае наш IProduct для товара)
            const response = await axios.get<IProduct>(`http://localhost:5000/api/getProductsCatalog/${params.id}`);

            return response;
        }
    })

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
            <SectionProductItemPageTop product={data?.data}/>
            <section className={onScreen.sectionProductItemTopIntersecting ? "sectionProductItemTop sectionProductItemTop--active" : "sectionProductItemTop"} id="sectionProductItemTop" ref={sectionProductItemTopRef}>
                <div className="container">
                    <div className="sectionProductItemTop__inner">
                        <img src={`/images/sectionDeals/${data?.data.image}`} alt="" className="sectionProductItemTop__img" />
                        <div className="sectionProductItemTop__info">
                            <h2 className="sectionProductItemTop__info-title">{data?.data.name}</h2>
                            <div className="deals__item-stars">
                                <img src="/images/sectionDeals/Star 4.png" alt="" className="stars__itemOrange" />
                                <img src="/images/sectionDeals/Star 4.png" alt="" className="stars__itemOrange" />
                                <img src="/images/sectionDeals/Star 4.png" alt="" className="stars__itemOrange" />
                                <img src="/images/sectionDeals/Star 4.png" alt="" className="stars__itemOrange" />
                                <img src="/images/sectionDeals/Star 5.png" alt="" className="stars__itemOrange" />
                            </div>
                            <p className="sectionProductItemTop__info-price">${data?.data.price}</p>
                            <div className="sectionProductItemTop__info-categoryBlock">
                                <div className="categoryBlock__category">
                                    <p className="categoryBlock__category-text">Category:</p>
                                    <p className="categoryBlock__category-subtext">
                                        {/* если categoryId у data?.data(то есть у объекта товара) равен 1,то показываем такой текст категории */}
                                        {data?.data.categoryId === 1 && 'Vegetables'}

                                        {data?.data.categoryId === 2 && 'Cooking'}

                                        {data?.data.categoryId === 3 && 'Beauty & Health'}
                                    </p>
                                </div>
                                <div className="categoryBlock__category">
                                    <p className="categoryBlock__category-text">Taste:</p>
                                    <p className="categoryBlock__category-subtext">
                                        {data?.data.tasteId === 1 && 'Sweet'}

                                        {data?.data.tasteId === 2 && 'Spicy'}

                                        {data?.data.tasteId === 3 && 'Bitter'}
                                    </p>
                                </div>
                            </div>
                            <p className="sectionProductItemTop__info-desc">Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla nibh diam, blandit vel consequat nec, ultrices et ipsum. Nulla varius magna a consequat pulvinar. </p>
                            <div className="sectionProductsItemTop__info-CartBlock">
                                <div className="info__CartBlock-inputBlock">
                                    <div className="CartBlock__inputBlock-inputBtn CartBlock__inputBlock-inputBtnMinus" onClick={handlerMinusBtn}>
                                        <img src="/images/sectionProductsItemTop/Minus.png" alt="" className="inputBlock__inputBtn-img" />
                                    </div>
                                    <input type="number" className="CartBlock__inputBlock-input" onChange={changeInputValue} value={inputAmountValue}/>
                                    <div className="CartBlock__inputBlock-inputBtn CartBlock__inputBlock-inputBtnPlus" onClick={handlerPlusBtn}>
                                        <img src="/images/sectionProductsItemTop/plus 1.png" alt="" className="inputBlock__inputBtn-img" />
                                    </div>
                                </div>
                                <button className="info__CartBlock-btn">
                                    <p className="CartBlock__btn-text">Add to Cart</p>
                                    <img src="/images/sectionProductsItemTop/Rectangle.png" alt="" className="CartBlock__btn-img" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default ProductItemPage;