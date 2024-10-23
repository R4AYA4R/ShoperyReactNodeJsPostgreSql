import { useNavigate } from "react-router-dom";
import { IProduct } from "../types/types";

// создаем интерфейс(тип) для пропсов компонента ProductItem,указываем в нем поле product с типом нашего интерфейса IProduct
interface IProductItem{
    product:IProduct
}

const ProductItem = ({product}:IProductItem) => {

    const router = useNavigate();  // useNavigate может перемещатьтся на другую страницу вместо ссылок

    return (
        // если product.id > 0 && product.id < 4 true(то есть первые 3 товара),то одни классы даем, в другом случае,если product.id > 4 && product.id < 8 true(то есть с 5 по 7 товар даем еще другие классы),и уже если условия перед этим не выполняются,то ставим просто класс "sectionDeals__deals-item",это чтобы указать определенным товарам определенные классы,в данном случае для border)
        <div className={product.id > 0 && product.id < 4 ? "sectionDeals__deals-item sectionDeals__deals-itemBorderRight" : product.id > 4 && product.id < 8 ? "sectionDeals__deals-item sectionDeals__deals-itemBorderTopRight" : product.id === 8 ? "sectionDeals__deals-item sectionDeals__deals-itemBorderTop" : "sectionDeals__deals-item"} onClick={()=>router(`/catalog/${product.id}`)}>
            <img src={`/images/sectionDeals/${product.image}`} alt="" className="deals__item-img" />
            <div className="deals__item-stars">
                <img src="/images/sectionDeals/Star 4.png" alt="" className="stars__itemOrange" />
                <img src="/images/sectionDeals/Star 4.png" alt="" className="stars__itemOrange" />
                <img src="/images/sectionDeals/Star 4.png" alt="" className="stars__itemOrange" />
                <img src="/images/sectionDeals/Star 4.png" alt="" className="stars__itemOrange" />
                <img src="/images/sectionDeals/Star 5.png" alt="" className="stars__itemOrange" />
            </div>
            <p className="deals__item-text">{product.name}</p>
            <p className="deals__item-price">${product.price}</p>
        </div>
    )
}

export default ProductItem;