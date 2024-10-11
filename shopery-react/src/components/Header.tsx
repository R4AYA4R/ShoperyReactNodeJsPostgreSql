import { NavLink } from "react-router-dom";

const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <div className="header__inner">
                    <NavLink to="/" className="logo">
                        <img src="/images/header/plant 1.png" alt="" className="logo__img" />
                        <h2 className="logo__text">Shopery</h2>
                    </NavLink>
                    <ul className="header__menuList">
                        <li className="header__menuList-item">
                            <NavLink to="/" className={({isActive})=> isActive ? "menuList__item-link menuList__item-linkActive" : "menuList__item-link"}>Home</NavLink>
                        </li>
                        <li className="header__menuList-item">
                            <NavLink to="/catalog" className={({isActive})=> isActive ? "menuList__item-link menuList__item-linkActive" : "menuList__item-link"}>Catalog</NavLink>
                        </li>
                        <li className="header__menuList-item">
                            <NavLink to="/aboutUs" className={({isActive})=> isActive ? " menuList__item-linkActive" : "menuList__item-link"}>About Us</NavLink>
                        </li>
                        <li className="header__menuList-item menuList__item-cartAndUser">
                            <NavLink to="/cart" className="menuList__item-link menuList__item-linkCart">
                                <img src="/images/header/Rectangle.png" alt="" className="menuList__item-cartImg" />
                                <span className="menuList__item-spanCart">0</span>
                            </NavLink>

                            <NavLink to="/user" className="menuList__item-link">
                                <img src="/images/header/user_3 1.png" alt="" className="menuList__item-userImg" />
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}

export default Header;