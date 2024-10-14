import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { IProduct } from "../types/types";
import ProductItem from "./ProductItem";

const PopularProducts = () => {

    // делаем запрос на сервер с помощью react query при запуске страницы и описываем здесь функцию запроса на сервер
    const {data} = useQuery({
        queryKey:['getAllProductsCategory'],
        queryFn:async ()=>{
            const response = await axios.get<IProduct[]>('http://localhost:5000/api/getProducts?categoryId=1'); // делаем запрос на сервер для получения всех товаров,указываем в типе в generic наш тип на основе интерфейса IProduct,указываем,что это массив(то есть указываем тип данных,которые придут от сервера),указываем query параметр categoryId со значением 1,чтобы отфильтровать товары по категории у которой id равно 1(это мы прописывали на бэкэнде)

            
            console.log(response.data);

            return response;
        }
    })

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

                        {data?.data.map((product)=>
                            <ProductItem product={product} key={product.id}/>
                        )}

                    </div>
                </div>
            </div>
        </section>
    )
}

export default PopularProducts;