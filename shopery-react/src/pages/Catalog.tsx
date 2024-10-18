import { useEffect, useRef, useState } from "react";
import SectionCatalogTop from "../components/SectionCatalogTop";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IProduct } from "../types/types";
import ProductItemCatalog from "../components/ProductItemCatalog";

const Catalog = () => {

    const sectionCatalogRef = useRef(null);

    const onScreen = useIsOnScreen(sectionCatalogRef);

    // делаем запрос на сервер с помощью react query при запуске страницы и описываем здесь функцию запроса на сервер
    const {data} = useQuery({
        queryKey:['getAllProductsCatalog'],
        queryFn:async ()=>{
            const response = await axios.get<IProduct[]>('http://localhost:5000/api/getProducts'); // делаем запрос на сервер для получения всех товаров,указываем в типе в generic наш тип на основе интерфейса IProduct,указываем,что это массив(то есть указываем тип данных,которые придут от сервера)

            
            console.log(response.data);

            return response;
        }
    })


    const [filterCategories, setFilterCategories] = useState('');

    const [filterPrice, setFilterPrice] = useState('');

    const [filterTaste, setFilterTaste] = useState({
        sweet: false,
        spicy: false,
        bitter: false,
    });

    const [selectBlockActive, setSelectBlockActive] = useState(false);

    const [selectValue, setSelectValue] = useState('');

    useEffect(() => {
        console.log(filterTaste)
    }, [filterTaste])

    return (
        <main className="main">
            <SectionCatalogTop />
            <section className={onScreen.sectionCatalogIntersecting ? "sectionCatalog sectionCatalog__active" : "sectionCatalog"} id="sectionCatalog" ref={sectionCatalogRef}>
                <div className="container">
                    <div className="sectionCatalog__inner">
                        <div className="sectionCatalog__filterBar">
                            <div className="filterBar__categories">
                                <h1 className="categories__title">All Categories</h1>
                                <label className="categories__item" onClick={() => setFilterCategories('Vegetables')}>
                                    <input name="radio" type="radio" className="categories__item-radio" />
                                    <span className={filterCategories === 'Vegetables' ? "categories__item-radioStyle categories__item-radioStyleActive" : "categories__item-radioStyle"}></span>
                                    <p className="categories__item-text">Vegetables</p>
                                    <p className="categories__item-amount">(0)</p>
                                </label>
                                <label className="categories__item" onClick={() => setFilterCategories('Fresh Fruit')}>
                                    <input name="radio" type="radio" className="categories__item-radio" />
                                    <span className={filterCategories === 'Fresh Fruit' ? "categories__item-radioStyle categories__item-radioStyleActive" : "categories__item-radioStyle"}></span>
                                    <p className="categories__item-text">Fresh Fruit</p>
                                    <p className="categories__item-amount">(0)</p>
                                </label>
                                <label className="categories__item" onClick={() => setFilterCategories('Cooking')}>
                                    <input name="radio" type="radio" className="categories__item-radio" />
                                    <span className={filterCategories === 'Cooking' ? "categories__item-radioStyle categories__item-radioStyleActive" : "categories__item-radioStyle"}></span>
                                    <p className="categories__item-text">Cooking</p>
                                    <p className="categories__item-amount">(0)</p>
                                </label>
                                <label className="categories__item" onClick={() => setFilterCategories('Beauty & Health')}>
                                    <input name="radio" type="radio" className="categories__item-radio" />
                                    <span className={filterCategories === 'Beauty & Health' ? "categories__item-radioStyle categories__item-radioStyleActive" : "categories__item-radioStyle"}></span>
                                    <p className="categories__item-text">Beauty & Health</p>
                                    <p className="categories__item-amount">(0)</p>
                                </label>
                            </div>

                            <div className="filterBar__categories">
                                <h1 className="categories__title">Price</h1>
                                <label className="categories__item" onClick={() => setFilterPrice('Under $10')}>
                                    <input name="radioPrice" type="radio" className="categories__item-radio" />
                                    <span className={filterPrice === 'Under $10' ? "categories__item-radioStyle categories__item-radioStyleActive" : "categories__item-radioStyle"}></span>
                                    <p className="categories__item-text">Under $10</p>
                                    <p className="categories__item-amount">(0)</p>
                                </label>
                                <label className="categories__item" onClick={() => setFilterPrice('$10-$20')}>
                                    <input name="radioPrice" type="radio" className="categories__item-radio" />
                                    <span className={filterPrice === '$10-$20' ? "categories__item-radioStyle categories__item-radioStyleActive" : "categories__item-radioStyle"}></span>
                                    <p className="categories__item-text">$10-$20</p>
                                    <p className="categories__item-amount">(0)</p>
                                </label>
                                <label className="categories__item" onClick={() => setFilterPrice('$20-$30')}>
                                    <input name="radioPrice" type="radio" className="categories__item-radio" />
                                    <span className={filterPrice === '$20-$30' ? "categories__item-radioStyle categories__item-radioStyleActive" : "categories__item-radioStyle"}></span>
                                    <p className="categories__item-text">$20-$30</p>
                                    <p className="categories__item-amount">(0)</p>
                                </label>
                                <label className="categories__item" onClick={() => setFilterPrice('Above $30')}>
                                    <input name="radioPrice" type="radio" className="categories__item-radio" />
                                    <span className={filterPrice === 'Above $30' ? "categories__item-radioStyle categories__item-radioStyleActive" : "categories__item-radioStyle"}></span>
                                    <p className="categories__item-text">Above $30</p>
                                    <p className="categories__item-amount">(0)</p>
                                </label>
                            </div>

                            <div className="filterBar__categories filterBar__taste">
                                <h1 className="categories__title">Taste</h1>
                                <label className="categories__item" >
                                    <input type="checkbox" className="categories__item-radio" onClick={() => setFilterTaste((prev) => ({ ...prev, sweet: !prev.sweet }))} />
                                    <span className={filterTaste.sweet ? "categories__item-checkBoxStyle categories__item-checkBoxStyleActive" : "categories__item-checkBoxStyle"}></span>
                                    <p className="categories__item-text">Sweet</p>
                                    <p className="categories__item-amount">(0)</p>
                                </label>
                                <label className="categories__item" >
                                    <input type="checkbox" className="categories__item-radio" onClick={() => setFilterTaste((prev) => ({ ...prev, spicy: !prev.spicy }))} />
                                    <span className={filterTaste.spicy ? "categories__item-checkBoxStyle categories__item-checkBoxStyleActive" : "categories__item-checkBoxStyle"}></span>
                                    <p className="categories__item-text">Spicy</p>
                                    <p className="categories__item-amount">(0)</p>
                                </label>
                                <label className="categories__item" >
                                    <input type="checkbox" className="categories__item-radio" onClick={() => setFilterTaste((prev) => ({ ...prev, bitter: !prev.bitter }))} />
                                    <span className={filterTaste.bitter ? "categories__item-checkBoxStyle categories__item-checkBoxStyleActive" : "categories__item-checkBoxStyle"}></span>
                                    <p className="categories__item-text">Bitter</p>
                                    <p className="categories__item-amount">(0)</p>
                                </label>

                            </div>

                        </div>
                        <div className="sectionCatalog__mainBlock">
                            <div className="sectionCatalog__mainBlock-top">
                                <div className="mainBlock__top-inputBlock">
                                    <input type="text" className="mainBlock__top-input" placeholder="Search for anything..." />
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
                                <p className="mainBlock__filters-text">Active Filters:</p>

                                {/* если состояние фильтра категорий не равно пустой строке,то показываем этот фильтр в активных фильтрах */}
                                {filterCategories !== '' &&
                                    <div className="mainBlock__filters-item">
                                        <p className="filters__item-text">{filterCategories}</p>
                                        <div className="filter__item-imgBlock">
                                            <img src="/images/sectionCatalog/Cross 12px.png" alt="" className="filters__item-img"  />
                                            <img src="/images/sectionCatalog/Cross 12px (1).png" alt="" className="filters__item-imgActive" onClick={() => setFilterCategories('')} />
                                        </div>
                                    </div>
                                }

                                {filterPrice !== '' &&
                                    <div className="mainBlock__filters-item">
                                        <p className="filters__item-text">{filterPrice}</p>
                                        <div className="filter__item-imgBlock">
                                            <img src="/images/sectionCatalog/Cross 12px.png" alt="" className="filters__item-img"  />
                                            <img src="/images/sectionCatalog/Cross 12px (1).png" alt="" className="filters__item-imgActive" onClick={() => setFilterPrice('')} />
                                        </div>
                                    </div>
                                }

                                {filterTaste.sweet &&
                                    <div className="mainBlock__filters-item">
                                        <p className="filters__item-text">Sweet</p>
                                        <div className="filter__item-imgBlock">
                                            <img src="/images/sectionCatalog/Cross 12px.png" alt="" className="filters__item-img"  />
                                            <img src="/images/sectionCatalog/Cross 12px (1).png" alt="" className="filters__item-imgActive" onClick={() => setFilterTaste((prev)=>({...prev,sweet:false}))} />
                                        </div>
                                    </div>
                                }

                                {filterTaste.spicy &&
                                    <div className="mainBlock__filters-item">
                                        <p className="filters__item-text">Spicy</p>
                                        <div className="filter__item-imgBlock">
                                            <img src="/images/sectionCatalog/Cross 12px.png" alt="" className="filters__item-img"  />
                                            <img src="/images/sectionCatalog/Cross 12px (1).png" alt="" className="filters__item-imgActive" onClick={() => setFilterTaste((prev)=>({...prev,spicy:false}))}  />
                                        </div>
                                    </div>
                                }

                                {filterTaste.bitter &&
                                    <div className="mainBlock__filters-item">
                                        <p className="filters__item-text">Bitter</p>
                                        <div className="filter__item-imgBlock">
                                            <img src="/images/sectionCatalog/Cross 12px.png" alt="" className="filters__item-img"  />
                                            <img src="/images/sectionCatalog/Cross 12px (1).png" alt="" className="filters__item-imgActive" onClick={() => setFilterTaste((prev)=>({...prev,bitter:false}))}  />
                                        </div>
                                    </div>
                                }

                                {selectValue !== '' &&
                                    <div className="mainBlock__filters-item">
                                        <p className="filters__item-text">Sort By: {selectValue}</p>
                                        <div className="filter__item-imgBlock">
                                            <img src="/images/sectionCatalog/Cross 12px.png" alt="" className="filters__item-img"  />
                                            <img src="/images/sectionCatalog/Cross 12px (1).png" alt="" className="filters__item-imgActive" onClick={() => setSelectValue('')}  />
                                        </div>
                                    </div>
                                }

                            </div>

                            <div className="sectionCatalog__mainBlock-products">

                                {data?.data.map((product)=>
                                    <ProductItemCatalog product={product} key={product.id}/>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Catalog;