import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AuthResponse, IProductCart } from "../types/types";
import { API_URL } from "../http/http";
import axios from "axios";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useActions } from "../hooks/useActions";
import { useQuery } from "@tanstack/react-query";

const Header = () => {


    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth,используя наш типизированный хук для useSelector

    // делаем запрос на получение массива товаров корзины и указываем в queryKey название такое же,как и указывали в файле Cart.tsx(в корзине),чтобы лишние запросы на сервер на одинаковые данные(в данном случае массив товаров корзины) не шли из разных файлов и данные переобновлялись правильно автоматически,когда обновляется массив товаров корзины,если указать разные названия,то данные не будут автоматически обновляться сразу,а только после перезагрузки страницы
    const { data: dataProductsCart } = useQuery({
        queryKey: ['productsCart'],
        queryFn: async () => {
            // делаем запрос на сервер на получение всех товаров корзины,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IProductCart,и указываем,что это массив IProductCart[]),указываем query параметр userId со значением id пользователя,чтобы получать товары корзины для конкретного авторизованного пользователя
            const response = await axios.get<IProductCart[]>(`${API_URL}/getAllProductsBasket?userId=${user.id}`);

            return response;
        }
    })

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
                            <NavLink to="/" className={({ isActive }) => isActive ? "menuList__item-link menuList__item-linkActive" : "menuList__item-link"}>Home</NavLink>
                        </li>
                        <li className="header__menuList-item">
                            <NavLink to="/catalog" className={({ isActive }) => isActive ? "menuList__item-link menuList__item-linkActive" : "menuList__item-link"}>Catalog</NavLink>
                        </li>
                        <li className="header__menuList-item">
                            <NavLink to="/aboutUs" className={({ isActive }) => isActive ? " menuList__item-linkActive" : "menuList__item-link"}>About Us</NavLink>
                        </li>
                        <li className="header__menuList-item menuList__item-cartAndUser">
                            <NavLink to="/cart" className="menuList__item-link menuList__item-linkCart">
                                <img src="/images/header/Rectangle.png" alt="" className="menuList__item-cartImg" />

                                {/* если user.userName true(то есть в user.userName есть какое-то значение,то есть пользователь авторизован,делаем эту проверку,чтобы данные количества товаров корзины правильно отображались сразу при выходе из аккаунта,если не сделать эту проверку,то после выхода из аккаунта данные количества товаров корзины будут правильно отображаться только после перезагрузки страницы) и dataProductsCart?.data.length true(то есть длина массива товаров корзины есть),то показываем длину массива товаров корзины,в другом случае показываем 0 */}
                                <span className="menuList__item-spanCart">{user.userName && dataProductsCart?.data.length ? dataProductsCart.data.length : 0}</span>
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