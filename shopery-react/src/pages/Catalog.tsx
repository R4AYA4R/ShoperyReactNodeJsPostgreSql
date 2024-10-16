import { useState } from "react";
import SectionCatalogTop from "../components/SectionCatalogTop";

const Catalog = () => {

    const [filterCategories,setFilterCategories] = useState('');

    const [selectBlockActive,setSelectBlockActive] = useState(false);

    const [selectValue,setSelectValue] = useState('');

    return (
        <main className="main">
            <SectionCatalogTop />
            <section className="sectionCatalog">
                <div className="container">
                    <div className="sectionCatalog__inner">
                        <div className="sectionCatalog__filterBar">
                            <div className="filterBar__categories">
                                <h1 className="categories__title">All Categories</h1>
                                <label className="categories__item" onClick={()=>setFilterCategories('Vegetables')}>
                                    <input name="radio" type="radio" className="categories__item-radio" />
                                    <span className={filterCategories === 'Vegetables' ? "categories__item-radioStyle categories__item-radioStyleActive" : "categories__item-radioStyle"}></span>
                                    <p className="categories__item-text">Vegetables</p>
                                    <p className="categories__item-amount">(0)</p>
                                </label>
                                <label className="categories__item" onClick={()=>setFilterCategories('Fresh Fruit')}>
                                    <input name="radio" type="radio" className="categories__item-radio" />
                                    <span className={filterCategories === 'Fresh Fruit' ? "categories__item-radioStyle categories__item-radioStyleActive" : "categories__item-radioStyle"}></span>
                                    <p className="categories__item-text">Fresh Fruit</p>
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
                                    <div className="selectBlock__select-inner" onClick={()=>setSelectBlockActive((prev)=>!prev)}>
                                        <div className="selectBlock__select">
                                            <p className="selectBlock__select-text">{selectValue}</p>
                                            <img src="/images/sectionCatalog/Chevron Down.png" alt="" className={selectBlockActive ? "selectBlock__select-img selectBlock__select-imgActive" : "selectBlock__select-img"} />
                                        </div>
                                        <div className={selectBlockActive ? "selectBlock__optionsBlock select__optionsBlock--active" : "selectBlock__optionsBlock"}>
                                            <div className="optionsBlock__item" onClick={()=>setSelectValue('Rating')}>
                                                <p className="optionsBlock__item-text">Rating</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Catalog;