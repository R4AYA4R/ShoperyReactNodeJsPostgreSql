import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AuthResponse, IProductCart } from "../types/types";
import { API_URL } from "../http/http";
import axios from "axios";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useActions } from "../hooks/useActions";
import { useQuery } from "@tanstack/react-query";

const Header = () => {


    const { user,isAuth,isLoading } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth,используя наш типизированный хук для useSelector

    const { checkAuthUser, setLoadingUser } = useActions(); // берем actions для изменения состояния пользователя у слайса(редьюсера) userSlice у нашего хука useActions уже обернутые в диспатч,так как мы оборачивали это в самом хуке useActions

    // делаем запрос на получение массива товаров корзины и указываем в queryKey название такое же,как и указывали в файле Cart.tsx(в корзине),чтобы лишние запросы на сервер на одинаковые данные(в данном случае массив товаров корзины) не шли из разных файлов и данные переобновлялись правильно автоматически,когда обновляется массив товаров корзины,если указать разные названия,то данные не будут автоматически обновляться сразу,а только после перезагрузки страницы
    const { data: dataProductsCart,refetch } = useQuery({
        queryKey: ['productsCart'],
        queryFn: async () => {
            // делаем запрос на сервер на получение всех товаров корзины,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IProductCart,и указываем,что это массив IProductCart[]),указываем query параметр userId со значением id пользователя,чтобы получать товары корзины для конкретного авторизованного пользователя
            const response = await axios.get<IProductCart[]>(`${API_URL}/getAllProductsBasket?userId=${user.id}`);

            return response;
        }
    })

    // при изменении состояния user(в userSlice в данном случае) (то есть когда пользователь логинится или выходит из аккаунта,или его поля меняются),то делаем повторный запрос на получения товаров корзины,чтобы данные о количестве товаров корзины сразу переобновлялись при изменения состояния user(то есть когда пользователь логинится или выходит из аккаунта,или его поля меняются)
    useEffect(()=>{

        refetch();

    },[user])


    // функция для проверки авторизован ли пользователь(валиден ли его refresh токен),делаем проверку авторизован ли пользователь и в компоненте Header.tsx(то есть в этом компоненте),чтобы при перезагрузке страницы каждый раз отправлялся запрос на проверку авторизован ли пользователь и это состояние пользователя(user в userSlice) было видно во всех компонентах и страницах,так как header находится на всех страницах,если этого не сделать,то после перезагрзки страницы не будет правильно отображаться авторизован пользователь или нет на всех страницах и не во всех компонентах(так как в некоторых компонентах просто берем состояния пользователя user из userSlice,без отправки запроса на проверку авторизован пользователь или нет)
    const checkAuth = async () => {

        setLoadingUser(true); // изменяем поле isLoading состояния пользователя в userSlice на true(то есть пошла загрузка)

        // оборачиваем в try catch,чтобы отлавливать ошибки
        try {

            // здесь используем уже обычный axios,указываем тип в generic,что в ответе от сервера ожидаем наш тип данных AuthResponse,указываем наш url до нашего роутера(/api) на бэкэнде(API_URL мы импортировали из другого нашего файла) и через / указываем refresh(это тот url,где мы выдаем access и refresh токены на бэкэнде),и вторым параметром указываем объект опций,указываем поле withCredentials true(чтобы автоматически с запросом отправлялись cookies)
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });

            console.log(response);

            checkAuthUser(response.data); // вызываем нашу функцию(action) для изменения состояния пользователя и передаем туда response.data(в данном случае это объект с полями accessToken,refreshToken и user,которые пришли от сервера)

        } catch (e: any) {

            console.log(e.response?.data?.message); // если была ошибка,то выводим ее в логи,берем ее из ответа от сервера  из поля message из поля data у response у e

        } finally {
            // в блоке finally будет выполнен код в независимости от try catch(то есть в любом случае,даже если будет ошибка)
            setLoadingUser(false); // изменяем поле isLoading состояния пользователя в userSlice на false(то есть загрузка закончена)
        }

    }


    // при запуске сайта будет отработан код в этом useEffect
    useEffect(() => {

        // если localStorage.getItem('token') true,то есть по ключу token в localStorage что-то есть
        if (localStorage.getItem('token')) {

            checkAuth(); // вызываем нашу функцию checkAuth(),которую описали выше для проверки авторизован ли пользователь

        }

        console.log(isAuth)
        console.log(user.userName)

    }, [])


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

                        {/* сделали ссылку на страницу aboutUs как обычную ссылку-заглушку,чтобы текст About Us был виден,но на эту страницу не переходило,так как в данном случае не сделали страницу About Us */}
                        <li className="header__menuList-item">
                            <a href="#" className="menuList__item-link">About Us</a>
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