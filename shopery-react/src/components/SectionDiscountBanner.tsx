import { Link } from "react-router-dom";

const SectionDiscountBanner = () => {
    return(
        <section className="sectionDiscountBanner">
            <div className="container">
                <div className="sectionDiscountBanner__inner">
                    <div className="sectionDiscountBanner__sale">
                        <h2 className="sectionDiscountBanner__sale-title">Summer Sale</h2>
                        <p className="sectionDiscountBanner__sale-subtitle"><span className="sale__subtitle-span">37%</span>off</p>
                        <p className="sectionDiscountBanner__sale-desc">Free on all your order, Free Shipping and  30 days money-back guarantee</p>
                        <Link to="/catalog" className="sectionTop__link">
                            <p className="sectionTop__link-text">Shop now</p>
                            <img src="/images/sectionTop/Group.png" alt="" className="sectionTop__link-img" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SectionDiscountBanner;