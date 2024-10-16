import { useRef } from "react";
import { Link } from "react-router-dom";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

const SectionTop = () => {

    const sectionTopRef = useRef(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef, указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionTopRef); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    return (
        // делаем проверку в className,если onScreen.sectionTopIntersecting(если состояние sectionTopIntersecting true) true,то есть этот html элемент сейчас наблюдается обзервером,то указываем классы,в другом случае другие
        <section id="sectionTop" ref={sectionTopRef} className={onScreen.sectionTopIntersecting ? "sectionTop sectionTop__active" : "sectionTop"}>
            <div className="container">
                <div className="sectionTop__inner">
                    <div className="sectionTop__top">
                        <p className="sectionTop__subtitle">Welcome to shopery</p>
                        <h1 className="sectionTop__title">Fresh & Healthy
                            Organic Food</h1>
                        <p className="sectionTop__desc">Sale up to <span className="sectionTop__desc-orange">30% OFF</span></p>
                        <p className="sectionDesc__text">Free shipping on all your order. we deliver, you enjoy</p>
                        <Link to="/catalog" className="sectionTop__link">
                            <p className="sectionTop__link-text">Shop now</p>
                            <img src="/images/sectionTop/Group.png" alt="" className="sectionTop__link-img" />
                        </Link>
                    </div>
                    <div className="sectionTop__bottom">
                        <div className="sectionTop__bottom-item">
                            <img src="/images/sectionTop/delivery-truck 1.png" alt="" className="bottom__item-img" />
                            <div className="bottom__item-textBlock">
                                <h4 className="item__textBlock-title">Free Shipping</h4>
                                <p className="item__textBlock-desc">Free shipping on all your order</p>
                            </div>
                        </div>
                        <div className="sectionTop__bottom-item">
                            <img src="/images/sectionTop/headphones 1.png" alt="" className="bottom__item-img" />
                            <div className="bottom__item-textBlock">
                                <h4 className="item__textBlock-title">Customer Support 24/7</h4>
                                <p className="item__textBlock-desc">Instant access to Support</p>
                            </div>
                        </div>
                        <div className="sectionTop__bottom-item">
                            <img src="/images/sectionTop/shopping-bag.png" alt="" className="bottom__item-img" />
                            <div className="bottom__item-textBlock">
                                <h4 className="item__textBlock-title">100% Secure Payment</h4>
                                <p className="item__textBlock-desc">We ensure your money is save</p>
                            </div>
                        </div>
                        <div className="sectionTop__bottom-item">
                            <img src="/images/sectionTop/package.png" alt="" className="bottom__item-img" />
                            <div className="bottom__item-textBlock">
                                <h4 className="item__textBlock-title">Money-Back Guarantee</h4>
                                <p className="item__textBlock-desc">30 Days Money-Back Guarantee</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SectionTop;