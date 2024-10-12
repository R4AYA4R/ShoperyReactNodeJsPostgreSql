import PopularProducts from "../components/PopularProducts";
import SectionBrands from "../components/SectionBrands";
import SectionDeals from "../components/SectionDeals";
import SectionDiscountBanner from "../components/SectionDiscountBanner";
import SectionTop from "../components/SectionTop";

const HomePage = () => {
    return (
        <main className="main">
            <SectionTop />
            <SectionDeals/>
            <SectionDiscountBanner/>
            <SectionBrands/>
            <PopularProducts/>
        </main>
    )
}

export default HomePage;