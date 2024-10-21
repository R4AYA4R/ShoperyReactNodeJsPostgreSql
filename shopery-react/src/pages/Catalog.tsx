import { ChangeEvent, useEffect, useRef, useState } from "react";
import SectionCatalogTop from "../components/SectionCatalogTop";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IProduct } from "../types/types";
import ProductItemCatalog from "../components/ProductItemCatalog";

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

            const response = await axios.get<IProduct[]>(url); // делаем запрос на сервер для получения всех товаров,указываем в типе в generic наш тип на основе интерфейса IProduct,указываем,что это массив(то есть указываем тип данных,которые придут от сервера)


            console.log(response.data);

            return response;
        }
    })

    
    // делаем еще функцию запроса для отображения числа товаров определенных фильтров и категорий без проверок и лимитов
    const {data:dataWithoutLimitAndChecks,refetch:refetchWithoutLimitAndChecks} = useQuery({
        queryKey:['productsWithoutLimitAndChecks'],
        queryFn: async () => {
            const response = await axios.get<IProduct[]>(`http://localhost:5000/api/getProductsCatalog?name=${searchValue}`);

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

    useEffect(() => {

        refetch(); // делаем повторный запрос на получение товаров при изменении searchValue(значение инпута поиска), и filterCategories

    }, [searchValue, filterCategories, filterPrice, filterTaste])

    useEffect(()=>{

        refetchWithoutLimitAndChecks(); // делаем запрос на сервер еще раз,чтобы переобновить данные для отображения числа найденных товаров

    },[searchValue])

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
                                    <p className="filters__amountBlock-amount">{data?.data.length}</p>
                                    <p className="filters__amountBlock-amountSubText">Results found.</p>
                                </div>

                            </div>

                            <div className="sectionCatalog__mainBlock-products">

                                {data?.data.length ? data?.data.map((product) =>
                                    <ProductItemCatalog product={product} key={product.id} />)
                                    : <h4 className="sectionCatalog__notFoundText">Not found</h4>
                                }

                            </div>


                            {/* если длина массива объектов товаров true(то есть товары есть),то показывать пагинацию,в другом случае пустая строка(то есть ничего не показывать) */}
                            {data?.data.length ? 
                                <div className="sectionCatalog__mainBlock-pagination">
                                    <button className="pagination__btnArrow pagination__btnArrowLeft">
                                        <img src="/images/sectionCatalog/Chevron Down (1).png" alt="" className="pagination__btnArrowLeft-img" />
                                    </button>


                                    <button className="pagination__page">1</button>

                                    <div className="pagination__dots">...</div>

                                    <button className="pagination__page">5</button>

                                    <button className="pagination__btnArrow pagination__btnArrowRight">
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