import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__inner">
                    <div className="footer__topBlock">
                        <div className="footer__leftBlock">
                            <Link to="/" className="logo">
                                <img src="/images/header/plant 1.png" alt="" className="logo__img" />
                                <h2 className="footer__logo-text">Shopery</h2>
                            </Link>
                            <p className="footer__leftBlock-desc">Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis dui, eget bibendum magna congue nec.</p>
                            <a href="#" className="footer__leftBlock-telLink">(219) 555-0114</a>
                        </div>
                        <ul className="footer__menu-list">
                            <li className="footer__list-item">
                                <h3 className="footer__item-title">Helps</h3>
                                <a href="#" className="footer__item-link">Contact</a>
                                <a href="#" className="footer__item-link">Faqs</a>
                                <a href="#" className="footer__item-link">Privacy Policy</a>
                            </li>
                            <li className="footer__list-item">
                                <h3 className="footer__item-title">My Account</h3>
                                <a href="#" className="footer__item-link">My Account</a>
                                <a href="#" className="footer__item-link">Shoping Cart</a>
                            </li>
                            <li className="footer__list-item">
                                <h3 className="footer__item-title">Proxy</h3>
                                <a href="#" className="footer__item-link">About</a>
                                <a href="#" className="footer__item-link">Home</a>
                                <a href="#" className="footer__item-link">Shop</a>
                            </li>
                            <li className="footer__list-item">
                                <h3 className="footer__item-title">Categories</h3>
                                <a href="#" className="footer__item-link">Fruit & Vegetables</a>
                                <a href="#" className="footer__item-link">Meat & Fish</a>
                                <a href="#" className="footer__item-link">Bread & Bakery</a>
                            </li>
                        </ul>
                    </div>
                    <div className="footer__bottomBlock">
                        <p className="footer__bottomBlock-text">Shopery eCommerce © 2021. All Rights Reserved</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;