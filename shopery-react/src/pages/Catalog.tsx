import { ChangeEvent, useEffect, useRef, useState } from "react";
import SectionCatalogTop from "../components/SectionCatalogTop";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IProduct, IProductData } from "../types/types";
import ProductItemCatalog from "../components/ProductItemCatalog";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useActions } from "../hooks/useActions";
import { getPagesArray } from "../utils/getPagesArray";

const Catalog = () => {

    const sectionCatalogRef = useRef(null);

    const onScreen = useIsOnScreen(sectionCatalogRef);


    const [filterCategories, setFilterCategories] = useState('');

    const [filterPrice, setFilterPrice] = useState('');

    const [filterTaste, setFilterTaste] = useState({
        sweet: false,
        spicy: false,
        bitter: false,
    });

    const [searchValue, setSearchValue] = useState('');

    const [selectBlockActive, setSelectBlockActive] = useState(false);

    const [selectValue, setSelectValue] = useState('');


    const [limit,setLimit] = useState(1); // указываем лимит для максимального количества объектов,которые будут на одной странице(для пагинации)

    const [page,setPage] = useState(1); // указываем состояние текущей страницы


    const {totalPages} = useTypedSelector(state => state.totalPagesReducer); // указываем наш слайс(редьюсер) под названием totalPagesReducer и деструктуризируем у него поле состояния totalPages(в данном случае для общего количества страниц,это не обязательно делать через redux,в данном случае просто для практики и чтобы не забыть),используя наш типизированный хук для useSelector

    const {changeTotalPages} = useActions(); // берем action changeTotalPages для изменения totalPages у нашего хука useActions уже обернутый в диспатч,так как мы оборачивали это в самом хуке useActions


    // делаем запрос на сервер с помощью react query при запуске страницы и описываем здесь функцию запроса на сервер
    const { data, refetch } = useQuery({
        queryKey: ['getAllProductsCatalog'],
        queryFn: async () => {

            // выносим url на получение товаров в отдельную переменную,чтобы ее потом изменять
            let url = `http://localhost:5000/api/getProductsCatalog?name=${searchValue}`;

            // если filterCategories не равно пустой строке(то есть пользователь выбрал категорию),то добавляем к url для получения товаров еще query параметр с categoryId и значением как filterCategories, указываем знак амперсанта & для перечисления query параметров в url
            if (filterCategories !== '') {

                url += `&categoryId=${filterCategories}`;

            }

            if (filterPrice !== '') {
                url += `&priceFilter=${filterPrice}`;
            }

            // если состояние фильтра filterTaste.spicy true,то добавляем к url еще query параметр tasteId со значением 1(указываем значение 1,так как на бэкэнде в базе данных сделали так,что нужно указывать фильтр taste по его id,на бэкэнде это обрабатываем,в данном случае для фильтра вкуса sweet на бэкэнде id 1)
            if (filterTaste.sweet) {
                url += `&tasteId=1`;
            }

            if (filterTaste.spicy) {
                url += `&tasteId=2`;
            }

            if (filterTaste.bitter) {
                url += `&tasteId=3`;
            }

            // указываем здесь тип данных,которые приходят от сервера как тип на основе нашего интерфейса IProductData
            const response = await axios.get<IProductData>(url,{
                params:{
                    limit:limit, // указываем параметр limit для максимального количества объектов,которые будут на одной странице(для пагинации)

                    page:page // указываем параметр page(параметр текущей страницы,для пагинации)
                }
            }); // делаем запрос на сервер для получения всех товаров,указываем в типе в generic наш тип на основе интерфейса IProduct,указываем,что это массив(то есть указываем тип данных,которые придут от сервера)


            console.log(response);

            const totalCount = data?.data.count; // записываем общее количество объктов товаров,которые пришли от сервера в переменную totalCount(берем это у поля count у data у data)


            // если totalCount true,то есть в totalCount есть какое-то значение,то изменяем общее количество страниц,делаем эту проверку, потому что totalCount может быть undefined(выдает ошибку такую)
            if(totalCount){
                changeTotalPages({totalCount:totalCount, limit:limit});// используем наш action для изменения состояния redux,в данном случае она изменяет поле totalPages,в нее передаем объект с полями totalCount и limit(можно указать просто totalCount, вместо totalCount:totalCount,так как ключ и значение одинаковые,но можно и так),эта функция делит totalCount на limit с помощью Math.ceil(),чтобы округлить результат до большего целого числа,для пагинации
            }


            return response;
        }
    })

    
    // делаем еще функцию запроса для отображения числа товаров определенных фильтров и категорий без проверок и лимитов
    const {data:dataWithoutLimitAndChecks,refetch:refetchWithoutLimitAndChecks} = useQuery({
        queryKey:['productsWithoutLimitAndChecks'],
        queryFn: async () => {
            const response = await axios.get<IProduct[]>(`http://localhost:5000/api/getProductsCatalogWithouLimit?name=${searchValue}`);

            return response;
        }
    })


    const filteredVegetables = dataWithoutLimitAndChecks?.data.filter(p => p.categoryId === 1);

    const filteredCooking = dataWithoutLimitAndChecks?.data.filter(p => p.categoryId === 2);

    const filteredBeautyAndHealth = dataWithoutLimitAndChecks?.data.filter(p => p.categoryId === 3);


    const filteredUnder10 = dataWithoutLimitAndChecks?.data.filter(p => p.priceFilter === 'Under $10'); 

    const filtered10to20 = dataWithoutLimitAndChecks?.data.filter(p => p.priceFilter === '$10-$20'); 

    const filtered20to30 = dataWithoutLimitAndChecks?.data.filter(p => p.priceFilter === '$20-$30'); 

    const filteredAbove30 = dataWithoutLimitAndChecks?.data.filter(p => p.priceFilter === 'Above $30'); 


    const filteredSweet = dataWithoutLimitAndChecks?.data.filter(p => p.tasteId === 1);

    const filteredSpicy = dataWithoutLimitAndChecks?.data.filter(p => p.tasteId === 2);

    const filteredBitter = dataWithoutLimitAndChecks?.data.filter(p => p.tasteId === 3);


    const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        setPage(1); // изменяем состояние текущей страницы на 1,чтобы при поиске страница ставилась на первую
    }


    // при изменении searchValue,то есть когда пользователь что-то вводит в инпут поиска,то изменяем category на пустую строку и остальные фильтры тоже,соответственно будет сразу идти поиск по всем товарам,а не в конкретной категории или определенных фильтрах,но после поиска можно будет результат товаров по поиску уже отфильтровать по категориям и делаем повторный запрос на сервер уже с измененным значение searchValue(чтобы поисковое число(число товаров,которое изменяется при поиске) показвалось правильно,когда вводят что-то в поиск)
    useEffect(() => {

        setFilterCategories('');

        setFilterPrice('');

        setFilterTaste({
            sweet: false,
            spicy: false,
            bitter: false
        });

    }, [searchValue])

    // указываем в массиве зависимостей этого useEffect data?.data,чтобы делать повторный запрос на получения объектов товаров при изменении data?.data,в данном случае это для пагинации,если не указать data?.data,то пагинация при запуске страницы не будет работать
    useEffect(() => {

        refetch(); // делаем повторный запрос на получение товаров при изменении searchValue(значение инпута поиска),filterCategories и других фильтров,а также при изменении состояния страницы и data?.data,данных о товарах и общее количество товаров,которые приходят от сервера

    }, [data?.data,searchValue, filterCategories, filterPrice, filterTaste,page])

    useEffect(()=>{

        refetchWithoutLimitAndChecks(); // делаем запрос на сервер еще раз,чтобы переобновить данные для отображения числа найденных товаров

    },[searchValue])


    // при изменении фильтров изменяем состояние текущей страницы на первую
    useEffect(()=>{

        setPage(1);

    },[filterCategories,filterPrice,filterTaste])

    let pagesArray = getPagesArray(totalPages, page); // помещаем в переменную pagesArray массив страниц пагинации,указываем переменную pagesArray как let,так как она будет меняться в зависимости от проверок в функции getPagesArray

    const prevPage = () => {
        // если текущая страница больше или равна 2
        if (page >= 2) {
            setPage((prev) => prev - 1); // изменяем состояние текущей страницы на - 1(то есть в setPage берем prev(предыдущее значение,то есть текущее) и отнимаем 1)
        }
    }

    const nextPage = () => {
        // если текущая страница меньше или равна общему количеству страниц - 1(чтобы после последней страницы не переключалось дальше)
        if (page <= totalPages - 1) {
            setPage((prev) => prev + 1); // изменяем состояние текущей страницы на + 1(то есть в setPage берем prev(предыдущее значение,то есть текущее) и прибавляем 1)
        }
    }

    return (
        <main className="main">
            <SectionCatalogTop />
            <section className={onScreen.sectionCatalogIntersecting ? "sectionCatalog sectionCatalog__active" : "sectionCatalog"} id="sectionCatalog" ref={sectionCatalogRef}>
                <div className="container">
                    <div className="sectionCatalog__inner">
                        <div className="sectionCatalog__filterBar">
                            <div className="filterBar__categories">
                                <h1 className="categories__title">All Categories</h1>
                                <label className="categories__item" onClick={() => setFilterCategories('1')}>
                                    <input name="radio" type="radio" className="categories__item-radio" />
                                    <span className={filterCategories === '1' ? "categories__item-radioStyle categories__item-radioStyleActive" : "categories__item-radioStyle"}>
                                        <span className={filterCategories === '1' ? "categories__item-ragioStyleBefore categories__item-ragioStyleBefore--active" : "categories__item-ragioStyleBefore "}></span>
                                    </span>
                                    <p className="categories__item-text">Vegetables</p>
                                    
                                    {/* если filterCategories !== '',то есть какая либо категория выбрана,то не показываем число товаров в этой категории,также если выбраны любые другие фильтры,тоже не показываем число товаров этой категории, filterTaste.sweet здесь значит,что если filterTaste.sweet true(просто в условии можно не указывать === true,а просто так записать) */}
                                    <p className={filterCategories !== '' || filterPrice !== '' || filterTaste.sweet || filterTaste.spicy || filterTaste.bitter ? "categories__item-amount categories__item-amountDisable" : "categories__item-amount"}>({filteredVegetables?.length})</p>
                                </label>
                                <label className="categories__item" onClick={() => setFilterCategories('2')}>
                                    <input name="radio" type="radio" className="categories__item-radio" />
                                    <span className={filterCategories === '2' ? "categories__item-radioStyle categories__item-radioStyleActive" : "categories__item-radioStyle"}>
                                        <span className={filterCategories === '2' ? "categories__item-ragioStyleBefore categories__item-ragioStyleBefore--active" : "categories__item-ragioStyleBefore "}></span>
                                    </span>
                                    <p className="categories__item-text">Cooking</p>
                                    <p className={filterCategories !== '' || filterPrice !== '' || filterTaste.sweet || filterTaste.spicy || filterTaste.bitter ? "categories__item-amount categories__item-amountDisable" : "categories__item-amount"}>({filteredCooking?.length})</p>
                                </label>
                                <label className="categories__item" onClick={() => setFilterCategories('3')}>
                                    <input name="radio" type="radio" className="categories__item-radio" />
                                    <span className={filterCategories === '3' ? "categories__item-radioStyle categories__item-radioStyleActive" : "categories__item-radioStyle"}>
                                        <span className={filterCategories === '3' ? "categories__item-ragioStyleBefore categories__item-ragioStyleBefore--active" : "categories__item-ragioStyleBefore "}></span>
                                    </span>
                                    <p className="categories__item-text">Beauty & Health</p>
                                    <p className={filterCategories !== '' || filterPrice !== '' || filterTaste.sweet || filterTaste.spicy || filterTaste.bitter ? "categories__item-amount categories__item-amountDisable" : "categories__item-amount"}>({filteredBeautyAndHealth?.length})</p>
                                </label>
                            </div>

                            <div className="filterBar__categories">
                                <h1 className="categories__title">Price</h1>
                                <label className="categories__item" onClick={() => setFilterPrice('Under $10')}>
                                    <input name="radioPrice" type="radio" className="categories__item-radio" />
                                    <span className={filterPrice === 'Under $10' ? "categories__item-radioStyle categories__item-radioStyleActive" : "categories__item-radioStyle"}>
                                        <span className={filterPrice === 'Under $10' ? "categories__item-ragioStyleBefore categories__item-ragioStyleBefore--active" : "categories__item-ragioStyleBefore "}></span>
                                    </span>
                                    <p className="categories__item-text">Under $10</p>
                                    <p className={filterPrice !== '' || filterCategories !== '' || filterTaste.sweet || filterTaste.spicy || filterTaste.bitter ? "categories__item-amount categories__item-amountDisable" : "categories__item-amount"}>({filteredUnder10?.length})</p>
                                </label>
                                <label className="categories__item" onClick={() => setFilterPrice('$10-$20')}>
                                    <input name="radioPrice" type="radio" className="categories__item-radio" />
                                    <span className={filterPrice === '$10-$20' ? "categories__item-radioStyle categories__item-radioStyleActive" : "categories__item-radioStyle"}>
                                        <span className={filterPrice === '$10-$20' ? "categories__item-ragioStyleBefore categories__item-ragioStyleBefore--active" : "categories__item-ragioStyleBefore "}></span>
                                    </span>
                                    <p className="categories__item-text">$10-$20</p>
                                    <p className={filterPrice !== '' || filterCategories !== '' || filterTaste.sweet || filterTaste.spicy || filterTaste.bitter ? "categories__item-amount categories__item-amountDisable" : "categories__item-amount"}>({filtered10to20?.length})</p>
                                </label>
                                <label className="categories__item" onClick={() => setFilterPrice('$20-$30')}>
                                    <input name="radioPrice" type="radio" className="categories__item-radio" />
                                    <span className={filterPrice === '$20-$30' ? "categories__item-radioStyle categories__item-radioStyleActive" : "categories__item-radioStyle"}>
                                        <span className={filterPrice === '$20-$30' ? "categories__item-ragioStyleBefore categories__item-ragioStyleBefore--active" : "categories__item-ragioStyleBefore "}></span>
                                    </span>
                                    <p className="categories__item-text">$20-$30</p>
                                    <p className={filterPrice !== '' || filterCategories !== '' || filterTaste.sweet || filterTaste.spicy || filterTaste.bitter ? "categories__item-amount categories__item-amountDisable" : "categories__item-amount"}>({filtered20to30?.length})</p>
                                </label>
                                <label className="categories__item" onClick={() => setFilterPrice('Above $30')}>
                                    <input name="radioPrice" type="radio" className="categories__item-radio" />
                                    <span className={filterPrice === 'Above $30' ? "categories__item-radioStyle categories__item-radioStyleActive" : "categories__item-radioStyle"}>
                                        <span className={filterPrice === 'Above $30' ? "categories__item-ragioStyleBefore categories__item-ragioStyleBefore--active" : "categories__item-ragioStyleBefore "}></span>
                                    </span>
                                    <p className="categories__item-text">Above $30</p>
                                    <p className={filterPrice !== '' || filterCategories !== '' || filterTaste.sweet || filterTaste.spicy || filterTaste.bitter ? "categories__item-amount categories__item-amountDisable" : "categories__item-amount"}>({filteredAbove30?.length})</p>
                                </label>
                            </div>

                            <div className="filterBar__categories filterBar__taste">
                                <h1 className="categories__title">Taste</h1>
                                <label className="categories__item" >
                                    <input type="checkbox" className="categories__item-radio" onClick={() => setFilterTaste((prev) => ({ ...prev, sweet: !prev.sweet }))} />
                                    <span className={filterTaste.sweet ? "categories__item-checkBoxStyle categories__item-checkBoxStyleActive" : "categories__item-checkBoxStyle"}></span>
                                    <p className="categories__item-text">Sweet</p>
                                    <p className={filterTaste.sweet || filterCategories !== '' || filterPrice !== '' || filterTaste.spicy || filterTaste.bitter ? "categories__item-amount categories__item-amountDisable" : "categories__item-amount"}>({filteredSweet?.length})</p>
                                </label>
                                <label className="categories__item" >
                                    <input type="checkbox" className="categories__item-radio" onClick={() => setFilterTaste((prev) => ({ ...prev, spicy: !prev.spicy }))} />
                                    <span className={filterTaste.spicy ? "categories__item-checkBoxStyle categories__item-checkBoxStyleActive" : "categories__item-checkBoxStyle"}></span>
                                    <p className="categories__item-text">Spicy</p>
                                    <p className={filterTaste.spicy || filterCategories !== '' || filterPrice !== '' || filterTaste.sweet || filterTaste.bitter ? "categories__item-amount categories__item-amountDisable" : "categories__item-amount"}>({filteredSpicy?.length})</p>
                                </label>
                                <label className="categories__item" >
                                    <input type="checkbox" className="categories__item-radio" onClick={() => setFilterTaste((prev) => ({ ...prev, bitter: !prev.bitter }))} />
                                    <span className={filterTaste.bitter ? "categories__item-checkBoxStyle categories__item-checkBoxStyleActive" : "categories__item-checkBoxStyle"}></span>
                                    <p className="categories__item-text">Bitter</p>
                                    <p className={filterTaste.bitter || filterCategories !== '' || filterPrice !== '' || filterTaste.sweet || filterTaste.spicy ? "categories__item-amount categories__item-amountDisable" : "categories__item-amount"}>({filteredBitter?.length})</p>
                                </label>

                            </div>

                        </div>
                        <div className="sectionCatalog__mainBlock">
                            <div className="sectionCatalog__mainBlock-top">
                                <div className="mainBlock__top-inputBlock">
                                    <input type="text" className="mainBlock__top-input" placeholder="Search for anything..." value={searchValue} onChange={inputChangeHandler} />
                                    <img src="/images/sectionCatalog/Search.png" alt="" className="mainBlock__top-inputImg" />
                                </div>
                                <div className="mainBlock__top-selectBlock">
                                    <p className="selectBlock__text">Sort By:</p>
                                    <div className="selectBlock__select-inner" onClick={() => setSelectBlockActive((prev) => !prev)}>
                                        <div className="selectBlock__select">
                                            <p className="selectBlock__select-text">{selectValue}</p>
                                            <img src="/images/sectionCatalog/Chevron Down.png" alt="" className={selectBlockActive ? "selectBlock__select-img selectBlock__select-imgActive" : "selectBlock__select-img"} />
                                        </div>
                                        <div className={selectBlockActive ? "selectBlock__optionsBlock select__optionsBlock--active" : "selectBlock__optionsBlock"}>
                                            <div className="optionsBlock__item" onClick={() => setSelectValue('Rating')}>
                                                <p className="optionsBlock__item-text">Rating</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sectionCatalog__mainBlock-filters">
                                <div className="mainBlock__filters-leftBlock">
                                    <p className="mainBlock__filters-text">Active Filters:</p>

                                    {/* если состояние фильтра категорий не равно пустой строке,то показываем этот фильтр в активных фильтрах */}
                                    {filterCategories !== '' &&
                                        <div className="mainBlock__filters-item">

                                            {/* если filterCategories === '1',то показываем один текст,в других проверках,если filterCategories равно 2,то другой текст и тд,так как на разные значения filterCategories в виде цифр указываем разные значение текста */}
                                            {filterCategories === '1' &&
                                                <p className="filters__item-text">Vegetables</p>
                                            }

                                            {filterCategories === '2' &&
                                                <p className="filters__item-text">Cooking</p>
                                            }

                                            {filterCategories === '3' &&
                                                <p className="filters__item-text">Beauty & Health</p>
                                            }

                                            <div className="filter__item-imgBlock">
                                                <img src="/images/sectionCatalog/Cross 12px.png" alt="" className="filters__item-img" />
                                                <img src="/images/sectionCatalog/Cross 12px (1).png" alt="" className="filters__item-imgActive" onClick={() => setFilterCategories('')} />
                                            </div>
                                        </div>
                                    }

                                    {filterPrice !== '' &&
                                        <div className="mainBlock__filters-item">
                                            <p className="filters__item-text">{filterPrice}</p>
                                            <div className="filter__item-imgBlock">
                                                <img src="/images/sectionCatalog/Cross 12px.png" alt="" className="filters__item-img" />
                                                <img src="/images/sectionCatalog/Cross 12px (1).png" alt="" className="filters__item-imgActive" onClick={() => setFilterPrice('')} />
                                            </div>
                                        </div>
                                    }

                                    {filterTaste.sweet &&
                                        <div className="mainBlock__filters-item">
                                            <p className="filters__item-text">Sweet</p>
                                            <div className="filter__item-imgBlock">
                                                <img src="/images/sectionCatalog/Cross 12px.png" alt="" className="filters__item-img" />
                                                <img src="/images/sectionCatalog/Cross 12px (1).png" alt="" className="filters__item-imgActive" onClick={() => setFilterTaste((prev) => ({ ...prev, sweet: false }))} />
                                            </div>
                                        </div>
                                    }

                                    {filterTaste.spicy &&
                                        <div className="mainBlock__filters-item">
                                            <p className="filters__item-text">Spicy</p>
                                            <div className="filter__item-imgBlock">
                                                <img src="/images/sectionCatalog/Cross 12px.png" alt="" className="filters__item-img" />
                                                <img src="/images/sectionCatalog/Cross 12px (1).png" alt="" className="filters__item-imgActive" onClick={() => setFilterTaste((prev) => ({ ...prev, spicy: false }))} />
                                            </div>
                                        </div>
                                    }

                                    {filterTaste.bitter &&
                                        <div className="mainBlock__filters-item">
                                            <p className="filters__item-text">Bitter</p>
                                            <div className="filter__item-imgBlock">
                                                <img src="/images/sectionCatalog/Cross 12px.png" alt="" className="filters__item-img" />
                                                <img src="/images/sectionCatalog/Cross 12px (1).png" alt="" className="filters__item-imgActive" onClick={() => setFilterTaste((prev) => ({ ...prev, bitter: false }))} />
                                            </div>
                                        </div>
                                    }

                                    {selectValue !== '' &&
                                        <div className="mainBlock__filters-item">
                                            <p className="filters__item-text">Sort By: {selectValue}</p>
                                            <div className="filter__item-imgBlock">
                                                <img src="/images/sectionCatalog/Cross 12px.png" alt="" className="filters__item-img" />
                                                <img src="/images/sectionCatalog/Cross 12px (1).png" alt="" className="filters__item-imgActive" onClick={() => setSelectValue('')} />
                                            </div>
                                        </div>
                                    }

                                </div>

                                <div className="mainBlock__filters-amountBlock">
                                    <p className="filters__amountBlock-amount">{data?.data.rows.length}</p>
                                    <p className="filters__amountBlock-amountSubText">Results found.</p>
                                </div>

                            </div>

                            <div className="sectionCatalog__mainBlock-products">

                                {/* указываем если data?.data.rows.length true,то есть товары есть,то показываем их,в другом случае показываем текст,указываем так данные товара,потому что от сервера приходит объект(response) с многими полями, у этого объекта нужные нам данные хранятся в поле data,а у этого поля data есть еще 2 поля count(числов всех объектов товаров,которые пришли от сервера) и rows(где находится массив товаров для конкретной страницы,это мы делали для пагинации) */}
                                {data?.data.rows.length ? data?.data.rows.map((product) =>
                                    <ProductItemCatalog product={product} key={product.id} />)
                                    : <h4 className="sectionCatalog__notFoundText">Not found</h4>
                                }

                            </div>


                            {/* если длина массива объектов товаров true(то есть товары есть),то показывать пагинацию,в другом случае пустая строка(то есть ничего не показывать) */}
                            {data?.data.rows.length ? 
                                <div className="sectionCatalog__mainBlock-pagination">
                                    <button className="pagination__btnArrow pagination__btnArrowLeft" onClick={prevPage}>
                                        <img src="/images/sectionCatalog/Chevron Down (1).png" alt="" className="pagination__btnArrowLeft-img" />
                                    </button>


                                    {pagesArray.map(p =>
                                        <button 
                                        
                                            className={page === p ? "pagination__page pagination__page--active" : "pagination__page"} //если состояние номера текущей страницы page равно значению элементу массива pagesArray,то отображаем такие классы,в другом случае другие,чтобы показать,что эта страница активна сейчас

                                            key={p}

                                            onClick={()=>setPage(p)} // отслеживаем на какую кнопку нажал пользователь и делаем ее активной,изменяем состояние текущей страницы page на значение элемента массива pagesArray(то есть страницу,на которую нажал пользователь)
                                        >
                                            {p}
                                        </button>
                                    )}

                                    
                                    {/* если общее количество страниц больше 4 и текущая страница меньше общего количества страниц - 2,то отображаем три точки */}
                                    {totalPages > 4 && page < totalPages - 2 && 
                                        <div className="pagination__dots">...</div>
                                    }
                                    
                                    {/* если общее количество страниц больше 3 и текущая страница меньше общего количества страниц - 1,то отображаем кнопку последней страницы,при клике на кнопку изменяем состояние текущей страницы на totalPages(общее количество страниц,то есть на последнюю страницу)  */}
                                    {totalPages > 3  && page < totalPages - 1 && 
                                        <button className="pagination__page" onClick={()=>setPage(totalPages)}>{totalPages}</button>
                                    }
                                    

                                    <button className="pagination__btnArrow pagination__btnArrowRight" onClick={nextPage}>
                                        <img src="/images/sectionCatalog/Chevron Down (2).png" alt="" className="pagination__btnArrowRight-img" />
                                    </button>
                                    
                                </div>
                                : ''
                            }    

                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Catalog;