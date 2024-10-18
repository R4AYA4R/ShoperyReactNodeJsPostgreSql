import { useNavigate } from "react-router-dom";
import { IProduct } from "../types/types";

interface IProductItemCatalog{
    product:IProduct;
}

const ProductItemCatalog = ({product}:IProductItemCatalog) => {

    const router = useNavigate();

    return (
        <div className="mainBlock__products-item" onClick={()=>router(`/catalog/${product.id}`)}>
            <img src={`/images/sectionDeals/${product.image}`} alt="" className="products__item-img" />
            <p className="products__item-text">{product.name}</p>
            <p className="products__item-price">${product.price}</p>
        </div>
    )
}

export default ProductItemCatalog;