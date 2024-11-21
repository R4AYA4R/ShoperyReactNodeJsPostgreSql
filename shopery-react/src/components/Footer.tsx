import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import $api, { API_URL } from "../http/http";
import { IAdminFields } from "../types/types";
import axios from "axios";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useState } from "react";

const Footer = () => {

    const [tabChangeTel, setTabChangeTel] = useState(false); // делаем состояние для таба изменения номера телефона для админа(будем показывать или не показывать инпут изменения номера телефона в зависимости от этого состояния)

    
    const [inputChangeTel,setInputChangeTel] = useState(''); // делаем состояние для инпута изменения телефона и указываем ему первоначальное значение,как предыдущий номер телефона,чтобы при показе инпут изменения номера телефона в нем изначально было значение предыдущего номера телефона,которое можно стереть


    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth,используя наш типизированный хук для useSelector

    // создаем функцию запроса и делаем запрос на сервер(при создании функции в useQuery запрос автоматически делается 1 раз при запуске страницы) для получения объекта админ полей(нужных полей текста и тд для сайта,чтобы потом мог админ их изменять в базе данных)
    const { data: dataAdminFields,refetch } = useQuery({
        queryKey: ['adminFields'],
        queryFn: async () => {
            // делаем запрос на сервер на получение объекта админ полей,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IAdminFields),используем тут обычный axios,так как не нужна здесь проверка на access токен пользователя
            const response = await axios.get<IAdminFields>(`${API_URL}/getAdminFields`);

            return response;
        }
    })



    // функция мутации(изменения данных) для изменения номера телефона(она будет для админа)
    const { mutate: mutatePhoneNumber } = useMutation({
        mutationKey: ['updatePhoneNumber'],
        mutationFn: async (objectAdminFields: IAdminFields) => {
            // делаем запрос на сервер и добавляем данные на сервер,указываем тип данных,которые нужно добавить на сервер(в данном случае IAdminFields),но здесь не обязательно указывать тип,передаем просто объект objectAdminFields как тело запроса,используем тут наш инстанс axios ($api),чтобы правильно обрабатывался этот запрос для проверки на access токен с помощью нашего authMiddleware на нашем сервере
            await $api.put<IAdminFields>(`${API_URL}/changeAdminFields`, objectAdminFields);
        },

        // при успешной мутации(изменения) номера телефона,переобновляем данные объекта админ полей
        onSuccess() {
            refetch();
            setTabChangeTel(false); // изменяем значение tabChangeTel на false,чтобы убрать инпут для изменения номера телефона
        }
    })


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

                            <div className="footer__blockTelLink">

                                {/* если состояние таба tabChangeTel false,то показываем номер телефона и кнопку,чтобы изменить номер телефона,если это состояние tabChangeTel будет равно true,то этот блок показываться не будет */}
                                {!tabChangeTel &&
                                    <div className="footer__changeTelBlock">
                                        {/* указываем значение этой ссылке как dataAdminFields?.data.phoneNumber,то есть поле номера телефона,которое получили из базы данных */}
                                        <a href="#" className="footer__leftBlock-telLink">{dataAdminFields?.data.phoneNumber}</a>

                                        {/* если user.roleId равно 2(то есть пользователь авторизован как администратор),то показываем кнопку админа для удаления товара из базы данных */}
                                        {user.roleId === 2 &&

                                            // в onClick(по клику этой кнопки) изменяем состояние tabChangeTel на true,чтобы показался инпут изменения телефона 
                                            <button className="footer__changeTel-closeBtn" onClick={() => setTabChangeTel(true)}>
                                                <img src="/images/sectionCart/Close.png" alt="" className="productItem__deleteProductBtn-img" />
                                            </button>
                                        }
                                    </div>
                                }


                                {/* если состояние таба tabChangeTel true,то показываем блок с инпутом изменения номера телефона,в другом случае он показан не будет */}
                                {tabChangeTel &&
                                    <div className="sectionProductsItemTop__priceBlockChange">
                                        <div className="sectionProductsItemTop__priceBlockChange-inputBlock">
                                            <p className="accountSettingsMain__item-text footer__changeTelText">Phone Number</p>

                                          
                                            <input type="text" className="CartBlock__inputBlock-input footer__changeTelBlock-inputChangeTel" onChange={(e)=>setInputChangeTel(e.target.value)} value={inputChangeTel} />
                                             
                                        </div>

                                        {/* в onClick(по клику на кнопку) вызываем функцию мутации(изменения данных) для изменения номера телефона,в mutatePhoneNumber разворачиваем весь объект dataAdminFields?.data(который изначально получили из базы данных),разворачиваем весь этот объект dataAdminFields?.data,чтобы не менялись другие поля,которые есть на сайте(то есть даем им такое же значение,как они и были до этого),а меняем только поле phoneNumber на значение состояния inputChangeTel(значение инпута изменения телефона),указываем этому объекту тип as IAdminFields,чтобы не было ошибки,что dataAdminFields?.data может быть undefined */}
                                        <button className="sectionProductItemTop__priceBlockChange-btn footer__changeTelBtn" onClick={()=>mutatePhoneNumber({...dataAdminFields?.data,phoneNumber:inputChangeTel} as IAdminFields)}><p className="footer__changeTelBtn-text">Save Changes</p></button>
                                    </div>
                                }

                            </div>

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