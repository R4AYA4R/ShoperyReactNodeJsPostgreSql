import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductItem from "./ProductItem";
import { IProduct } from "../types/types";

const SectionDeals = () => {

    // делаем запрос на сервер с помощью react query при запуске страницы и описываем здесь функцию запроса на сервер
    const {data} = useQuery({
        queryKey:['getAllProducts'],
        queryFn:async ()=>{
            const response = await axios.get<IProduct[]>('http://localhost:5000/api/getProducts'); // делаем запрос на сервер для получения всех товаров,указываем в типе в generic наш тип на основе интерфейса IProduct,указываем,что это массив(то есть указываем тип данных,которые придут от сервера)

            
            console.log(response.data);

            return response;
        }
    })

    return(
        <section className="sectionDeals">
            <div className="container">
                <div className="sectionDeals__inner">
                    <div className="sectionDeals__top">
                        <h1 className="sectionDeals__top-title">Hot Deals</h1>
                        <Link to="/catalog" className="sectionDeals__top-link">
                            <p className="sectionDeals__top-linkText">View All</p>
                            <img src="/images/sectionDeals/Group.png" alt="" className="sectionDeals__top-linkImg" />
                        </Link>
                    </div>
                    <div className="sectionDeals__deals">

                        {data?.data.map((product)=>
                            <ProductItem product={product} key={product.id}/>
                        )}

                    </div>
                </div>
            </div>
        </section>
    )
}

export default SectionDeals;