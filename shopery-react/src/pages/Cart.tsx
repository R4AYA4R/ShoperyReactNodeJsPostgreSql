import { ChangeEvent, useEffect, useRef, useState } from "react";
import SectionCartTop from "../components/SectionCartTop";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useActions } from "../hooks/useActions";
import { AuthResponse, IProductCart } from "../types/types";
import { API_URL } from "../http/http";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import ProductItemCart from "../components/ProductItemCart";

const Cart = () => {

    // const sectionCartRef = useRef(null);

    // const onScreen = useIsOnScreen(sectionCartRef);

    const [totalCheckPrice,setTotalCheckPrice] = useState<number>();

    
    const { updateCartProducts } = useTypedSelector(state => state.cartSlice); // указываем наш слайс(редьюсер) под названием cartSlice и деструктуризируем у него поле состояния updateCartProducts,используя наш типизированный хук для useSelector


    const { isAuth, user,isLoading } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth,используя наш типизированный хук для useSelector

    const { checkAuthUser, setLoadingUser,setUpdateCartProducts } = useActions(); // берем actions для изменения состояния пользователя у слайса(редьюсера) userSlice у нашего хука useActions уже обернутые в диспатч,так как мы оборачивали это в самом хуке useActions,также берем и другие actions для изменения других состояний у других слайсов


    // функция для проверки авторизован ли пользователь(валиден ли его refresh токен)
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

    }, [])

    const {mutate:mutateDeleteCartProduct} = useMutation({
        mutationKey:['deleteCartProduct'],
        mutationFn: async (productCart:IProductCart) => {
            // делаем запрос на сервер для удаление товара корзины, указываем тип данных,которые нужно добавить на сервер(в данном случае IProductCart),но здесь не обязательно указывать тип,передаем просто объект productCart как тело запроса
            await axios.delete<IProductCart>(`${API_URL}/deleteCartProduct/${productCart.id}`);
        },

        // при успешной мутации обновляем весь массив товаров корзины с помощью функции refetchDataProductsCart,которую мы передали как пропс (параметр) этого компонента
        onSuccess(){
            refetchDataProductsCart();
        }
    })

    // берем из useQuery поле isFetching,оно обозначает,что сейчас идет загрузка запроса на сервер,используем его для того,чтобы показать лоадер(загрузку) при загрузке запроса на сервер
    const { data: dataProductsCart,isFetching,refetch:refetchDataProductsCart } = useQuery({
        queryKey: ['productsCart'],
        queryFn: async () => {
            // делаем запрос на сервер на получение всех товаров корзины,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IProductCart,и указываем,что это массив IProductCart[]),указываем query параметр userId со значением id пользователя,чтобы получать товары корзины для конкретного авторизованного пользователя
            const response = await axios.get<IProductCart[]>(`${API_URL}/getAllProductsBasket?userId=${user.id}`);

            return response;
        }
    })

    
    const dataTotalPrice = dataProductsCart?.data.reduce((prev,curr) => prev + curr.totalPrice,0); // проходимся по массиву объектов корзины и на каждой итерации увеличиваем переменную prev(это число,и мы указали,что в начале оно равно 0 и оно будет увеличиваться на каждой итерации массива объектов,запоминая старое состояние числа и увеличивая его на новое значение) на curr(текущий итерируемый объект).totalPrice,это чтобы посчитать общую сумму цены всех товаров
    

    // при изменении dataProductsCart?.data(массива объектов корзины),изменяем состояние totalCheck на dataCheck,чтобы посчитать общую сумму товаров
    useEffect(()=>{

        setTotalCheckPrice(dataTotalPrice);
        
    },[dataProductsCart?.data])


    // функция для удаления всех товаров корзины
    const deleteAllProductsCart = ()=>{
        // проходимся по каждому элементу массива товаров корзины и вызываем мутацию mutateDeleteCartProduct и передаем туда productCart(сам productCart, каждый товар на каждой итерации,и потом в функции запроса на сервер mutateDeleteCartProduct будем брать у этого productCart только id для удаления из корзины)
        dataProductsCart?.data.forEach((productCart)=>{
            mutateDeleteCartProduct(productCart);
        })
    }

    // если состояние загрузки isFetching true,то есть идет загрузка запрос на сервер для получения товаров корзины,то показываем лоадер(загрузку),если не отслеживать загрузку при isFetching,то будут только через некоторое время показаны товары корзины,когда запрос на получение всех товаров корзины будет отработан,поэтому нужно отслеживать загрузку и ее возвращать как разметку страницы,пока грузится запрос на сервер на получение товаров корзины)
    if(isFetching){
        // возвращаем тег main с классом main,так как указали этому классу стили,чтобы был прижат header и footer
        return(
            <main className="main">
                <div className="container">
                    <div className="innerForLoader">
                        <div className="loader"></div>
                    </div>
                </div>
            </main>
        )
    }


    return (
        <main className="main">
            <SectionCartTop />
            {/* <section className={onScreen.sectionCartIntersecting ? "sectionCart sectionCart--active" : "sectionCart"} id="sectionCart" ref={sectionCartRef} > */}
            {/* из-за того,что мы отслеживаем загрузку запроса на сервер(isFetching) для получения товаров корзины,то мы не можем тут использовать наш хук useIsOnScreen для intersectionObserver для показа анимации появления элемента корзины */}
            <section className="sectionCart sectionCart--active">
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

                                {/* если user.userName true(то есть пользователь авторизован,если не сделать эту проверку на авторизован ли пользователь,то после выхода из аккаунта и возвращении на страницу корзины товары будут показываться до тех пор,пока не обновится страница,поэтому делаем эту проверку) и dataProductsCart?.data.length true(то есть есть длина массива товаров корзины),то тогда показываем товары корзины,в другом случае показываем текст */}
                                {user.userName && dataProductsCart?.data.length ?
                                    <div className="tableCart__products">

                                        {dataProductsCart.data.map(productBasket =>

                                            // передаем в компонент ProductItemCart пропс(параметр) refetchDataProductsCart в который передаем функцию refetchDataProductsCart для обновления массива товаров корзины,эту функцию будем вызывать в ProductItemCart когда удалим товар корзины,чтобы переобновить весь массив товаров корзины
                                            <ProductItemCart productBasket={productBasket} key={productBasket.id} refetchDataProductsCart={refetchDataProductsCart} />

                                        )}

                                        <div className="tableCart__bottomBlock">
                                            <button className="tableCart__bottomBlock-deleteBtn" onClick={deleteAllProductsCart}>Clear Cart</button>

                                            {/* изменяем поле updateCartProducts у состояния слайса(редьюсера) cartSlice на true,чтобы обновились все данные о товарах в корзине по кнопке,потом в компоненте ProductItemCart отслеживаем изменение этого поля updateCartProducts и делаем там запрос на сервер на обновление данных о товаре в корзине */}
                                            <button className="tableCart__bottomBlock-btn" onClick={()=>setUpdateCartProducts(true)}>Update Cart</button>
                                        </div>

                                    </div> 
                                        : 
                                    <h3 className="textEmptyCart">Cart is Empty</h3>
                                }

                            </div>
                            <div className="sectionCart__main-rightBlock">
                                <h4 className="sectionCart__rightBlock-title">Cart Total</h4>
                                <div className="sectionCart__rightBlock-item">
                                    <p className="sectionCart__rightBlock-itemTitle">Subtotal:</p>

                                    {/* если totalCheckPrice true,то есть он есть и он не undefined(totalCheckPrice может быть undefined,если data(объекты товаров корзины) отсутствуют),то показываем общую цену и используем метод toFixed(2) (этот метод форматирует число до определенного количества символов после запятой(может быть значение от 2 до 20,если значение не указать в toFixed,то по умолчанию будет 0),также этот метод автоматически округляет число к большему где это нужно(типа число 123.67 он округлит до 123.7,если стоит toFixed(1) ),в данном случае указываем это,чтобы цены товаров корзины показывались максимум с 2 цифрами после запятой,если это не указать,то у некоторых цен могут быть числа с кучей цифр после запятой),в другом случае указываем общую цену 0 usd */}
                                    {totalCheckPrice ? 
                                        <p className="sectionCart__rightBlock-itemText">${totalCheckPrice.toFixed(2)}</p>
                                        : 
                                        <p className="sectionCart__rightBlock-itemText">$0</p>
                                    }

                                    
                                </div>
                                <div className="sectionCart__rightBlock-item">
                                    <p className="sectionCart__rightBlock-itemTitle">Shipping:</p>
                                    <p className="sectionCart__rightBlock-itemText">$4.99</p>
                                </div>
                                <div className="sectionCart__rightBlock-item sectionCart__rightBlock-itemBorderTop">
                                    <p className="sectionCart__rightBlock-itemTitle">Total:</p>
                                    
                                    {/* если totalCheckPrice true,то есть он есть и он не undefined(totalCheckPrice может быть undefined,если data(объекты товаров корзины) отсутствуют),то показываем общую цену и используем метод toFixed(2) (этот метод форматирует число до определенного количества символов после запятой(может быть значение от 2 до 20,если значение не указать в toFixed,то по умолчанию будет 0),также этот метод автоматически округляет число к большему где это нужно(типа число 123.67 он округлит до 123.7,если стоит toFixed(1) ),в данном случае указываем это,чтобы цены товаров корзины показывались максимум с 2 цифрами после запятой,если это не указать,то у некоторых цен могут быть числа с кучей цифр после запятой),в другом случае указываем общую цену 0 usd */}
                                    {totalCheckPrice ? 
                                        <p className="sectionCart__rightBlock-itemText sectionCart__rightBlock-itemTextBold">${(totalCheckPrice + 4.99).toFixed(2)}</p>
                                        : 
                                        <p className="sectionCart__rightBlock-itemText sectionCart__rightBlock-itemTextBold">$0</p>
                                    }
                                    

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