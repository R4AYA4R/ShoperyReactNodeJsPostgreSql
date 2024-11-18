import { useNavigate } from "react-router-dom";
import { IProduct } from "../types/types";

interface IProductItemCatalog {
    product: IProduct;
}

const ProductItemCatalog = ({ product }: IProductItemCatalog) => {

    const router = useNavigate();

    return (
        <div className="mainBlock__products-item" onClick={() => router(`/catalog/${product.id}`)}>
            <img src={product.image} alt="" className="products__item-img" />
            <div className="deals__item-stars">
                <img src={product.rating === 0 ? "/images/sectionDeals/Star 5.png" : "/images/sectionDeals/Star 4.png"} alt="" className="stars__itemOrange stars__ProductItemPage" />
                <img src={product.rating >= 2 ? "/images/sectionDeals/Star 4.png" : "/images/sectionDeals/Star 5.png"} alt="" className="stars__itemOrange stars__ProductItemPage" />
                <img src={product.rating >= 3 ? "/images/sectionDeals/Star 4.png" : "/images/sectionDeals/Star 5.png"} alt="" className="stars__itemOrange stars__ProductItemPage" />
                <img src={product.rating >= 4 ? "/images/sectionDeals/Star 4.png" : "/images/sectionDeals/Star 5.png"} alt="" className="stars__itemOrange stars__ProductItemPage" />
                <img src={product.rating >= 5 ? "/images/sectionDeals/Star 4.png" : "/images/sectionDeals/Star 5.png"} alt="" className="stars__itemOrange stars__ProductItemPage" />
            </div>
            <p className="products__item-text">{product.name}</p>
            <p className="products__item-price">${product.price}</p>
        </div>
    )
}

export default ProductItemCatalog;