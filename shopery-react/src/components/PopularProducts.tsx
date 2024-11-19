import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { IProduct } from "../types/types";
import ProductItem from "./ProductItem";
import { useRef } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

const PopularProducts = () => {

    const sectionPopularProductsRef = useRef(null); 

    const onScreen = useIsOnScreen(sectionPopularProductsRef);

    // делаем запрос на сервер с помощью react query при запуске страницы и описываем здесь функцию запроса на сервер
    const {data,refetch} = useQuery({
        queryKey:['getAllProductsCategory'], // указываем здесь такое же название,как и в файле SectionDeals для получения товаров,это чтобы при удалении товара обновлялись данные автоматически сразу в другой компоненте(в данном случае в SectionDeals),а не после обновления страницы
        queryFn:async ()=>{
            const response = await axios.get<IProduct[]>('http://localhost:5000/api/getProducts?categoryId=1',{
                params:{
                    limit:4 // указываем параметр лимит со значением 4,чтобы максимальное количество объектов,которые могут прийти от сервера было 4,можно указать query параметры и просто в url через знак вопроса,но можно и тут в отдельном объекте
                }
            }); // делаем запрос на сервер для получения всех товаров,указываем в типе в generic наш тип на основе интерфейса IProduct,указываем,что это массив(то есть указываем тип данных,которые придут от сервера),указываем query параметр categoryId со значением 1,чтобы отфильтровать товары по категории у которой id равно 1(это мы прописывали на бэкэнде)

            
            console.log(response.data);

            return response;
        }
    })

    return (
        <section id="sectionPopularProducts" ref={sectionPopularProductsRef} className={onScreen.sectionPopularProductsIntersecting ? "popularProducts popularProducts__active" : "popularProducts"}>
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
                            <ProductItem product={product} key={product.id} refetchProductsCatalog={refetch}/>
                        )}

                    </div>
                </div>
            </div>
        </section>
    )
}

export default PopularProducts;