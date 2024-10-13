import { Link } from "react-router-dom";

const PopularProducts = () => {
    return (
        <section className="popularProducts">
            <div className="container">
                <div className="popularProducts__inner">
                    <div className="sectionDeals__top">
                        <h1 className="sectionDeals__top-title">Popular Products</h1>
                        <Link to="/catalog" className="sectionDeals__top-link">
                            <p className="sectionDeals__top-linkText">View All</p>
                            <img src="/images/sectionDeals/Group.png" alt="" className="sectionDeals__top-linkImg" />
                        </Link>
                    </div>
                    <div className="popularProducts__products">
                        <div className="sectionDeals__deals-item sectionDeals__deals-itemBorderRight">
                            <img src="/images/sectionDeals/Product Image (1).png" alt="" className="deals__item-img" />
                            <p className="deals__item-text">Green Lettuce</p>
                            <p className="deals__item-price">$9.00</p>
                        </div>
                        <div className="sectionDeals__deals-item sectionDeals__deals-itemBorderRight">
                            <img src="/images/sectionDeals/Product Image (3).png" alt="" className="deals__item-img" />
                            <p className="deals__item-text">Green Capsicum</p>
                            <p className="deals__item-price">$14.99</p>
                        </div>
                        <div className="sectionDeals__deals-item sectionDeals__deals-itemBorderRight">
                            <img src="/images/sectionDeals/Product Image (4).png" alt="" className="deals__item-img" />
                            <p className="deals__item-text">Green Chili</p>
                            <p className="deals__item-price">$34.00</p>
                        </div>
                        <div className="sectionDeals__deals-item">
                            <img src="/images/sectionDeals/Product Image (5).png" alt="" className="deals__item-img" />
                            <p className="deals__item-text">Red Chili</p>
                            <p className="deals__item-price">$12.00</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PopularProducts;