import { ChangeEvent, useEffect, useRef, useState } from "react";
import SectionCatalogTop from "../components/SectionCatalogTop";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { IProduct } from "../types/types";
import SectionProductItemPageTop from "../components/SectionProductItemPageTop";
import PopularProducts from "../components/PopularProducts";

const ProductItemPage = () => {

    const [tab, setTab] = useState('Desc');

    const [activeStars, setActiveStars] = useState(0);

    const [activeForm, setActiveForm] = useState(false);

    const [inputAmountValue, setInputAmountValue] = useState<number>(1);

    const sectionProductItemTopRef = useRef(null);

    const onScreen = useIsOnScreen(sectionProductItemTopRef);

    const params = useParams(); // с помощью useParams получаем параметры из url (в данном случае id товара)

    const { pathname } = useLocation(); // берем pathname(url страницы) из useLocation()

    const { data, refetch } = useQuery({
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

    // при изменении pathname(url страницы),делаем запрос на обновление данных о товаре(иначе не меняются данные) и изменяем таб на desc(описание товара),если вдруг был включен другой таб,то при изменении url страницы будет включен опять дефолтный таб,также изменяем значение количества товара,если было выбрано уже какое-то,чтобы поставить первоначальное, и убираем форму добавления комментария,если она была открыта
    useEffect(() => {

        refetch();

        setTab('Desc');

        setInputAmountValue(1);

        setActiveForm(false);

    }, [pathname])

    return (
        <main className="main">
            <SectionProductItemPageTop product={data?.data} />
            <section className={onScreen.sectionProductItemTopIntersecting ? "sectionProductItemTop sectionProductItemTop--active" : "sectionProductItemTop"} id="sectionProductItemTop" ref={sectionProductItemTopRef}>
                <div className="container">
                    <div className="sectionProductItemTop__inner">
                        <img src={`/images/sectionDeals/${data?.data.image}`} alt="" className="sectionProductItemTop__img" />
                        <div className="sectionProductItemTop__info">
                            <h2 className="sectionProductItemTop__info-title">{data?.data.name}</h2>
                            <div className="deals__item-stars">
                                <img src="/images/sectionDeals/Star 4.png" alt="" className="stars__itemOrange stars__ProductItemPage" />
                                <img src="/images/sectionDeals/Star 4.png" alt="" className="stars__itemOrange stars__ProductItemPage" />
                                <img src="/images/sectionDeals/Star 4.png" alt="" className="stars__itemOrange stars__ProductItemPage" />
                                <img src="/images/sectionDeals/Star 4.png" alt="" className="stars__itemOrange stars__ProductItemPage" />
                                <img src="/images/sectionDeals/Star 5.png" alt="" className="stars__itemOrange stars__ProductItemPage" />
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
                                    <input type="number" className="CartBlock__inputBlock-input" onChange={changeInputValue} value={inputAmountValue} />
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

                    <div className="sectionProductItemTop__description">
                        <div className="sectionProductItemTop__description-tabs">
                            {/* если tab равно 'Desc',то показываем такие классы(показываем кнопку типа активной),в другом случае другие */}
                            <button className={tab === 'Desc' ? "description__tabs-btn description__tabs-btn--active" : "description__tabs-btn"} onClick={() => setTab('Desc')}>Description</button>
                            <button className={tab === 'Reviews' ? "description__tabs-btn description__tabs-btn--active" : "description__tabs-btn"} onClick={() => setTab('Reviews')}>Reviews</button>
                        </div>

                        {/* если состояние tab === 'Desc',то показываем блок с описанием товара,если tab равно 'Reviews',то показываем отзывы(это мы прописали ниже) */}
                        {tab === 'Desc' &&
                            <div className="sectionProductItemTop__description-mainBlock">
                                <div className="description__mainBlock-leftBlock">
                                    <p className="description__mainBlock-text">Sed commodo aliquam dui ac porta. Fusce ipsum felis, imperdiet at posuere ac, viverra at mauris. Maecenas tincidunt ligula a sem vestibulum pharetra. Maecenas auctor tortor lacus, nec laoreet nisi porttitor vel. Etiam tincidunt metus vel dui interdum sollicitudin. Mauris sem ante, vestibulum nec orci vitae, aliquam mollis lacus. Sed et condimentum arcu, id molestie tellus. Nulla facilisi. Nam scelerisque vitae justo a convallis. Morbi urna ipsum, placerat quis commodo quis, egestas elementum leo. Donec convallis mollis enim. Aliquam id mi quam. Phasellus nec fringilla elit.</p>
                                    <p className="description__mainBlock-text">Nulla mauris tellus, feugiat quis pharetra sed, gravida ac dui. Sed iaculis, metus faucibus elementum tincidunt, turpis mi viverra velit, pellentesque tristique neque mi eget nulla. Proin luctus elementum neque et pharetra.</p>
                                    <p className="description__mainBlock-text">Cras et diam maximus, accumsan sapien et, sollicitudin velit. Nulla blandit eros non turpis lobortis iaculis at ut massa. </p>
                                </div>
                                <div className="description__mainBlock-rightBlock">
                                    <div className="mainBlock__rightBlock-checkers">
                                        <div className="rightBlock__checkers-item">
                                            <img src="/images/sectionProductsItemTop/Check.png" alt="" className="checkers__item-img" />
                                            <p className="checkers__item-text">100 g of fresh leaves provides.</p>
                                        </div>
                                        <div className="rightBlock__checkers-item">
                                            <img src="/images/sectionProductsItemTop/Check.png" alt="" className="checkers__item-img" />
                                            <p className="checkers__item-text">Aliquam ac est at augue volutpat elementum.</p>
                                        </div>
                                        <div className="rightBlock__checkers-item">
                                            <img src="/images/sectionProductsItemTop/Check.png" alt="" className="checkers__item-img" />
                                            <p className="checkers__item-text">Quisque nec enim eget sapien molestie.</p>
                                        </div>
                                        <div className="rightBlock__checkers-item">
                                            <img src="/images/sectionProductsItemTop/Check.png" alt="" className="checkers__item-img" />
                                            <p className="checkers__item-text">Proin convallis odio volutpat finibus posuere.</p>
                                        </div>
                                    </div>
                                    <div className="mainBlock__rightBlock-discount">
                                        <div className="rightBlock__discount-item">
                                            <img src="/images/sectionProductsItemTop/price-tag 1.png" alt="" className="discount__item-img" />
                                            <div className="discount__item-info">
                                                <h4 className="discount__item-infoTitle">64% Discount</h4>
                                                <p className="discount__item-infoText">Save your 64% money with us</p>
                                            </div>
                                        </div>
                                        <div className="rightBlock__discount-item">
                                            <img src="/images/sectionProductsItemTop/leaf 1.png" alt="" className="discount__item-img" />
                                            <div className="discount__item-info">
                                                <h4 className="discount__item-infoTitle">100% Organic</h4>
                                                <p className="discount__item-infoText">100% Organic Vegetables</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        }

                        {tab === 'Reviews' &&
                            <div className="sectionProductItemTop__reviews">
                                {/* <div className="reviews__top">
                                    <h4 className="reviews__top-notFoundTitle">No reviews yet.</h4>
                                    <button className="reviews__top-addBtn">Add Review</button>
                                </div> */}

                                <div className="reviews__mainBlock">
                                    <div className="reviews__mainBlock-leftBlock">

                                        <div className="reviews__leftBlock-item">
                                            <div className="reviews__leftBlock-itemTop">
                                                <div className="leftBlock__itemTop-userBlock">
                                                    <img src="/images/sectionProductsItemTop/Profile.png" alt="" className="itemTop__userBlock-img" />
                                                    <div className="itemTop__userBlock-userInfo">
                                                        <h4 className="userBlock__userInfo-title">Jane Cooper</h4>
                                                        <div className="reviews__form-topStars">
                                                            <img src="/images/sectionDeals/Star 4.png" alt="" className="topStars__img"/>
                                                            <img src="/images/sectionDeals/Star 4.png" alt="" className="topStars__img"/>
                                                            <img src="/images/sectionDeals/Star 4.png" alt="" className="topStars__img"/>
                                                            <img src="/images/sectionDeals/Star 4.png" alt="" className="topStars__img"/>
                                                            <img src="/images/sectionDeals/Star 5.png" alt="" className="topStars__img"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="leftBlock__itemTop-dataText">30 Apr, 2021</p>
                                            </div>
                                            <div className="reviews__leftBlock__itemMain">
                                                <p className="leftBlock__itemMain-text">200+ Canton Pak Choi Bok Choy Chinese Cabbage Seeds Heirloom Non-GMO Productive Brassica rapa VAR. chinensis, a.k.a. Canton's Choice, Bok Choi, from USA
                                                .</p>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="reviews__mainBlock-rightBlock">

                                        <div className={activeForm ? "reviews__rightBlock-btnBlock reviews__rightBlock-btnBlockNone" : "reviews__rightBlock-btnBlock"}>
                                            <button className="reviews__top-addBtn" onClick={() => setActiveForm(true)}>Add Review</button>
                                        </div>

                                        <div className={activeForm ? "reviews__rightBlock-form reviews__rightBlock-form--active" : "reviews__rightBlock-form"}>
                                            <div className="reviews__form-topBlock">
                                                <div className="reviews__form-topUserBlock">
                                                    <img src="/images/sectionProductsItemTop/Profile.png" alt="" className="topUserBlock__img" />
                                                    <h1 className="topUserBlock-title">User</h1>
                                                </div>
                                                <div className="reviews__form-topStars">
                                                    {/* если activeStars равно 0,то показываем серую картинку звездочки,в другом случае оранжевую */}
                                                    <img src={activeStars === 0 ? "/images/sectionDeals/Star 5.png" : "/images/sectionDeals/Star 4.png"} alt="" className="topStars__img" onClick={() => setActiveStars(1)} />

                                                    {/* если activeStars больше или равно 2,то показывать оранжевую звезду,в другом случае серую */}
                                                    <img src={activeStars >= 2 ? "/images/sectionDeals/Star 4.png" : "/images/sectionDeals/Star 5.png"} alt="" className="topStars__img" onClick={() => setActiveStars(2)} />
                                                    <img src={activeStars >= 3 ? "/images/sectionDeals/Star 4.png" : "/images/sectionDeals/Star 5.png"} alt="" className="topStars__img" onClick={() => setActiveStars(3)} />
                                                    <img src={activeStars >= 4 ? "/images/sectionDeals/Star 4.png" : "/images/sectionDeals/Star 5.png"} alt="" className="topStars__img" onClick={() => setActiveStars(4)} />
                                                    <img src={activeStars >= 5 ? "/images/sectionDeals/Star 4.png" : "/images/sectionDeals/Star 5.png"} alt="" className="topStars__img" onClick={() => setActiveStars(5)} />
                                                </div>
                                            </div>
                                            <div className="reviews__form-main">
                                                <textarea className="reviews__form-textArea" placeholder="Enter your comment"></textarea>
                                            </div>
                                            <button className="reviews__form-submitBtn">Save Review</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        }

                    </div>
                </div>
            </section>
            <PopularProducts />
        </main>
    )
}

export default ProductItemPage;