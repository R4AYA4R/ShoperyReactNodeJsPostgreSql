import { ChangeEvent, useEffect, useRef, useState } from "react";
import SectionCatalogTop from "../components/SectionCatalogTop";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthResponse, IComment, IProduct, IProductCart, IUpdateRatingObject } from "../types/types";
import SectionProductItemPageTop from "../components/SectionProductItemPageTop";
import PopularProducts from "../components/PopularProducts";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useActions } from "../hooks/useActions";
import { API_URL } from "../http/http";
import { text } from "stream/consumers";

const ProductItemPage = () => {

    const [tab, setTab] = useState('Desc');

    const [activeStars, setActiveStars] = useState(0);

    const [activeForm, setActiveForm] = useState(false);

    const [errorCommentsForm, setErrorCommentsForm] = useState('');

    const [textFormArea, setTextFormArea] = useState('');

    const [inputAmountValue, setInputAmountValue] = useState<number>(1);
 
    const sectionProductItemTopRef = useRef(null);

    const onScreen = useIsOnScreen(sectionProductItemTopRef);

    const router = useNavigate(); // используем useNavigate чтобы перекидывать пользователя на определенную страницу

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


    const [totalPriceProduct,setTotalPriceProduct] = useState(data?.data.price);


    const { data: dataComments, refetch: refetchComments } = useQuery({
        queryKey: ['commentsForProduct'],
        queryFn: async () => {
            // делаем запрос на сервер на получение комментариев для определенного товара,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IComment,и указываем,что это массив IComment[]),указываем query параметр productId со значением id товара на этой странице
            const response = await axios.get<IComment[]>(`${API_URL}/getCommentsForProduct?productId=${data?.data.id}`);

            return response;
        }
    })



    // функция для post запроса на сервер с помощью useMutation(react query),создаем комментарий на сервере,берем mutate у useMutation,чтобы потом вызвать эту функцию запроса на сервер в нужный момент
    const { mutate } = useMutation({
        mutationKey: ['create comment'],
        mutationFn: async (comment: IComment) => {
            // делаем запрос на сервер и добавляем данные на сервер,указываем тип данных,которые нужно добавить на сервер(в данном случае IComment),но здесь не обязательно указывать тип,делаем тип объекта,который мы передаем на сервер as IComment(id вручную не указываем,чтобы он сам генерировался автоматически на сервере
            await axios.post<IComment>(`${API_URL}/createComment`, comment);
        },

        // при успешной мутации переобновляем массив комментариев
        onSuccess() {
            refetchComments();
        }
    })

    const { mutate: mutateRating } = useMutation({
        mutationKey: ['updateRatingProduct'],
        mutationFn: async (product: IProduct) => {
            // делаем запрос на сервер и добавляем данные на сервер,указываем тип данных,которые нужно добавить на сервер(в данном случае IProduct),но здесь не обязательно указывать тип,передаем просто объект product как тело запроса
            await axios.put<IProduct>(`${API_URL}/updateProductRating`, product);
        },

        // при успешной мутации(изменения) рейтинга,переобновляем данные товара
        onSuccess() {
            refetch();
        }
    })


    const { isAuth, user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth,используя наш типизированный хук для useSelector

    const { checkAuthUser, setLoadingUser } = useActions(); // берем actions для изменения состояния пользователя у слайса(редьюсера) userSlice у нашего хука useActions уже обернутые в диспатч,так как мы оборачивали это в самом хуке useActions


  



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

    // при изменении inputAmountValue и data?.data(в данном случае данные товара на этой странице,полученные с сервера,чтобы при запуске страницы сайта уже было значение в totalPriceProduct,без этого стартовое значение totalPriceProduct не становится на data?.data.price) изменяем состояние totalPriceProduct
    useEffect(()=>{

        // если data?.data.price true(то есть она есть),то меняем значение totalPriceProduct,в данном случае делаем эту проверку,так как выдает ошибку,что data?.data.price может быть undefined(то есть ее может не быть)
        if(data?.data.price){

            setTotalPriceProduct(data?.data.price * inputAmountValue);

        }

    },[inputAmountValue,data?.data])


    // при изменении pathname(url страницы),делаем запрос на обновление данных о товаре(иначе не меняются данные) и изменяем таб на desc(описание товара),если вдруг был включен другой таб,то при изменении url страницы будет включен опять дефолтный таб,также изменяем значение количества товара,если было выбрано уже какое-то,чтобы поставить первоначальное, и убираем форму добавления комментария,если она была открыта
    useEffect(() => {

        refetch();

        setTab('Desc');

        setInputAmountValue(1);

        setActiveForm(false);

    }, [pathname])


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


    const { data: dataProductsCart,refetch:dataProductsCartRefetch } = useQuery({
        queryKey: ['productsCart'],
        queryFn: async () => {
            // делаем запрос на сервер на получение всех товаров корзины,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IProductCart,и указываем,что это массив IProductCart[]),указываем query параметр userId со значением id пользователя,чтобы получать товары корзины для конкретного авторизованного пользователя
            const response = await axios.get<IProductCart[]>(`${API_URL}/getAllProductsBasket?userId=${user.id}`);

            return response;
        }
    })

    const { mutate: mutateAddProductCart } = useMutation({
        mutationKey: ['add productCart'],
        mutationFn: async (productCart: IProductCart) => {
            // делаем запрос на сервер и добавляем данные на сервер,указываем тип данных,которые нужно добавить на сервер(в данном случае IProductCart),но здесь не обязательно указывать тип
            await axios.post<IProductCart>(`${API_URL}/createProductBasket`, productCart);
        },

        // при успешной мутации,то есть в данном случае при успшешном добавлении товара в корзину обновляем dataProductsCart(массив объектов корзины),чтобы сразу показывалось изменение в корзине товаров,если так не сделать,то текст Already in Cart(что товар уже в корзине) будет показан только после обновления страницы,а не сразу,так как массив объектов корзины еще не переобновился
        onSuccess(){
            dataProductsCartRefetch();
        }
    })


    const isExistsBasket = dataProductsCart?.data.some(p => p.name === data?.data.name); // делаем проверку методом some и результат записываем в переменную isExistsBasket,если в dataProductsCart(в массиве объектов корзины) есть элемент(объект) name которого равен data?.data name(то есть name этого товара на этой странице),в итоге в isExistsBasket будет помещено true или false в зависимости от проверки методом some



    // при изменении массива комментариев и данных товара(data?.data) на этой странице,переобновляем массив комментариев для этого товара
    useEffect(() => {

        refetchComments();

    }, [dataComments?.data, data?.data])


    useEffect(() => {

        const commentsRating = dataComments?.data.reduce((prev, curr) => prev + curr.rating, 0); // проходимся по массиву объектов комментариев для товара на этой странице и на каждой итерации увеличиваем переменную prev(это число,и мы указали,что в начале оно равно 0 и оно будет увеличиваться на каждой итерации массива объектов,запоминая старое состояние числа и увеличивая его на новое значение) на curr(текущий итерируемый объект).rating ,это чтобы посчитать общую сумму всего рейтинга от каждого комментария и потом вывести среднее значение

        //если commentsRating true(эта переменная есть и равна чему-то) и dataComments?.data.length true(этот массив отфильтрованных комментариев есть),то считаем средний рейтинг всех комментариев и записываем его в переменную,а потом делаем запрос на сервер для обновления рейтинга у объекта товара в базе данных
        if (commentsRating && dataComments?.data.length) {

            const commentsRatingMiddle = commentsRating / dataComments?.data.length;

            // делаем запрос на изменение рейтинга у товара,разворачиваем все поля товара текущей страницы(data?.data) и поле rating изменяем на commentsRatingMiddle
            mutateRating({ ...data?.data, rating: commentsRatingMiddle } as IProduct);

        }

    }, [dataComments?.data])

    const addCommentsBtn = () => {

        // если имя пользователя равно true,то есть оно есть и пользователь авторизован,то показываем форму,в другом случае перекидываем пользователя на страницу авторизации
        if (user.userName) {
            setActiveForm(true); // изменяем состояние активной формы,то есть показываем форму для создания комментария
        } else {
            router('/user'); // перекидываем пользователя на страницу авторизации (/user в данном случае)
        }

    }

    const formCommentsHandler = () => {

        // если значение textarea (.trim()-убирает из строки пробелы,чтобы нельзя было ввести только пробел) в форме комментария будет по количеству символов меньше или равно 10,то будем изменять состояние ErrorCommentsForm(то есть показывать ошибку и не отправлять комментарий),в другом случае очищаем поля textarea,activeStars(рейтинг,который пользователь указал в форме) и убираем форму
        if (textFormArea.trim().length <= 10) {
            setErrorCommentsForm('Comment must be more than 10 characters');
        } else if (activeStars === 0) {
            // если состояние рейтинга в форме равно 0,то есть пользователь не указал рейтинг,то показываем ошибку
            setErrorCommentsForm('Enter rating');
        } else {

            const date = new Date(); // создаем объект на основе класса Date(класс в javaScript для работы с датой и временем)

            // помещаем в переменную showTime значение времени,когда создаем комментарий, date.getDate() - показывает текущее число, getMonth() - считает месяцы с нуля(январь нулевой,февраль первый и тд),поэтому указываем date.getMonth() + 1(увеличиваем на 1 и получаем текущий месяц) и потом приводим получившееся значение к формату строки с помощью toString(), getFullYear() - текущий год 
            const showTime = date.getDate() + '.' + (date.getMonth() + 1).toString() + '.' + date.getFullYear();

            // здесь указываем функцию создания комментария в базе данных
            mutate({ name: user.userName, text: textFormArea, rating: activeStars, productId: data?.data.id, createdTime: showTime } as IComment); // вызываем функцию post запроса на сервер,создавая комментарий,разворачивая в объект нужные поля для комментария и давая этому объекту тип as IComment(вручную не указываем id,чтобы он автоматически создавался на сервере), указываем поле productId со значением как у id товара на этой странице,чтобы в базе данных связать этот товар с комментарием

            setTextFormArea('');
            setActiveStars(0);
            setActiveForm(false);
            setErrorCommentsForm('');

        }

    }


    const addToCartBtn = () => {

        console.log(user.userName)

        // если имя пользователя равно true,то есть оно есть и пользователь авторизован,то помещаем товар в корзину,в другом случае перекидываем пользователя на страницу авторизации
        if(user.userName){

            if(data?.data){

                mutateAddProductCart({name:data.data.name,categoryId:data.data.categoryId,amount:inputAmountValue,image:data.data.image,price:data.data.price,priceFilter:data.data.priceFilter,rating:data.data.rating,tasteId:data.data.tasteId,totalPrice:totalPriceProduct,usualProductId:data.data.id,userId:user.id} as IProductCart); // передаем в addProductBasket объект типа IProductCart только таким образом,разворачивая в объект все необходимые поля(то есть наш product,в котором полe name,делаем поле name со значением,как и у этого товара name(data?.data.name) и остальные поля также,кроме поля amount и totalPrice,их мы изменяем и указываем как значения inputAmountValue(инпут с количеством) и totalPriceProduct(состояние цены,которое изменяется при изменении inputAmountValue)),указываем тип этого объекта как созданный нами тип as IProductCart,при создании на сервере не указываем конкретное значение id,чтобы он сам автоматически генерировался на сервере и потом можно было удалить этот объект, добавляем поле userId со значением user.id(то есть со значением id пользователя,чтобы потом показывать товары в корзине для каждого конкретного пользователя,у которого id будет равен полю userId у этого товара),указываем usualProductId со значением data?.data.id,чтобы потом в корзине можно было перейти на страницу товара в магазине по этому usualProductId,а сам id корзины товара не указываем,чтобы он автоматически правильно генерировался,так как делаем показ товаров по-разному для конкретных пользователей(то есть как и должно быть),иначе ошибка

            }

        }else{
            router('/user'); // перекидываем пользователя на страницу авторизации (/user в данном случае)
        }

    }

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

                                {/* если data?.data true,то есть данные о товаре на текущей странице есть(делаем эту проверку,потому что без нее ошибка,типа data?.data может быть undefined),и в src у элементов img(картинок) указываем условие,какую звезду рейтинга отображать в зависимости от значения рейтинга товара */}
                                {data?.data &&
                                    <>
                                        <img src={data?.data.rating === 0 ? "/images/sectionDeals/Star 5.png" : "/images/sectionDeals/Star 4.png"} alt="" className="stars__itemOrange stars__ProductItemPage" />
                                        <img src={data?.data.rating >= 2 ? "/images/sectionDeals/Star 4.png" : "/images/sectionDeals/Star 5.png"} alt="" className="stars__itemOrange stars__ProductItemPage" />
                                        <img src={data?.data.rating >= 3 ? "/images/sectionDeals/Star 4.png" : "/images/sectionDeals/Star 5.png"} alt="" className="stars__itemOrange stars__ProductItemPage" />
                                        <img src={data?.data.rating >= 4 ? "/images/sectionDeals/Star 4.png" : "/images/sectionDeals/Star 5.png"} alt="" className="stars__itemOrange stars__ProductItemPage" />
                                        <img src={data?.data.rating >= 5 ? "/images/sectionDeals/Star 4.png" : "/images/sectionDeals/Star 5.png"} alt="" className="stars__itemOrange stars__ProductItemPage" />
                                    </>
                                }

                            </div>
                            <p className="sectionProductItemTop__info-price">${totalPriceProduct}</p>
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

                                {/* если isExistsBasket true(то есть этот товар на этой странице уже находится в корзине) и если user.userName true(то есть пользователь авторизован,если не сделать эту проверку на авторизован ли пользователь,то после выхода из аккаунта и возвращении на страницу корзины товары будут показываться до тех пор,пока не обновится страница,поэтому делаем эту проверку),то показываем текст,в другом случае показываем кнопку добавления товара в корзину и инпут с количеством этого товара */}
                                {user.userName && isExistsBasket ?
                                    <h3 className="textAlreadyInCart">Already in Cart</h3>
                                    : 
                                    <>
                                        <div className="info__CartBlock-inputBlock">
                                            <div className="CartBlock__inputBlock-inputBtn CartBlock__inputBlock-inputBtnMinus" onClick={handlerMinusBtn}>
                                                <img src="/images/sectionProductsItemTop/Minus.png" alt="" className="inputBlock__inputBtn-img" />
                                            </div>
                                            <input type="number" className="CartBlock__inputBlock-input" onChange={changeInputValue} value={inputAmountValue} />
                                            <div className="CartBlock__inputBlock-inputBtn CartBlock__inputBlock-inputBtnPlus" onClick={handlerPlusBtn}>
                                                <img src="/images/sectionProductsItemTop/plus 1.png" alt="" className="inputBlock__inputBtn-img" />
                                            </div>
                                        </div>
                                        <button className="info__CartBlock-btn" onClick={addToCartBtn}>
                                            <p className="CartBlock__btn-text">Add to Cart</p>
                                            <img src="/images/sectionProductsItemTop/Rectangle.png" alt="" className="CartBlock__btn-img" />
                                        </button>
                                    </>
                                }


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

                                        {dataComments?.data.length ?
                                            dataComments.data.map((comment) =>
                                                <div className="reviews__leftBlock-item" key={comment.id}>
                                                    <div className="reviews__leftBlock-itemTop">
                                                        <div className="leftBlock__itemTop-userBlock">
                                                            <img src="/images/sectionProductsItemTop/Profile.png" alt="" className="itemTop__userBlock-img" />
                                                            <div className="itemTop__userBlock-userInfo">
                                                                <h4 className="userBlock__userInfo-title">{comment.name}</h4>
                                                                <div className="reviews__form-topStars">
                                                                    <img src={comment.rating === 0 ? "/images/sectionDeals/Star 5.png" : "/images/sectionDeals/Star 4.png"} alt="" className="topStars__img" />
                                                                    <img src={comment.rating >= 2 ? "/images/sectionDeals/Star 4.png" : "/images/sectionDeals/Star 5.png"} alt="" className="topStars__img" />
                                                                    <img src={comment.rating >= 3 ? "/images/sectionDeals/Star 4.png" : "/images/sectionDeals/Star 5.png"} alt="" className="topStars__img" />
                                                                    <img src={comment.rating >= 4 ? "/images/sectionDeals/Star 4.png" : "/images/sectionDeals/Star 5.png"} alt="" className="topStars__img" />
                                                                    <img src={comment.rating >= 5 ? "/images/sectionDeals/Star 4.png" : "/images/sectionDeals/Star 5.png"} alt="" className="topStars__img" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="leftBlock__itemTop-dataText">{comment.createdTime}</p>
                                                    </div>
                                                    <div className="reviews__leftBlock__itemMain">
                                                        <p className="leftBlock__itemMain-text">{comment.text}</p>
                                                    </div>
                                                </div>
                                            ) :
                                            <div className="reviews__top">
                                                <h4 className="reviews__top-notFoundTitle">No reviews yet.</h4>
                                            </div>
                                        }

                                    </div>
                                    <div className="reviews__mainBlock-rightBlock">

                                        <div className={activeForm ? "reviews__rightBlock-btnBlock reviews__rightBlock-btnBlockNone" : "reviews__rightBlock-btnBlock"}>
                                            <button className="reviews__top-addBtn" onClick={addCommentsBtn}>Add Review</button>
                                        </div>

                                        <div className={activeForm ? "reviews__rightBlock-form reviews__rightBlock-form--active" : "reviews__rightBlock-form"}>
                                            <div className="reviews__form-topBlock">
                                                <div className="reviews__form-topUserBlock">
                                                    <img src="/images/sectionProductsItemTop/Profile.png" alt="" className="topUserBlock__img" />
                                                    <h1 className="topUserBlock-title">{user.userName}</h1>
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
                                                <textarea className="reviews__form-textArea" placeholder="Enter your comment" value={textFormArea} onChange={(e) => setTextFormArea(e.target.value)}></textarea>
                                            </div>

                                            {errorCommentsForm !== '' && <p className="formErrorTextComments">{errorCommentsForm}</p>}

                                            <button className="reviews__form-submitBtn" onClick={formCommentsHandler}>Save Review</button>
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