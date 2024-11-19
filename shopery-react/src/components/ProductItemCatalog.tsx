import { useNavigate } from "react-router-dom";
import { IProduct, IProductCart } from "../types/types";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useMutation, useQuery } from "@tanstack/react-query";
import $api, { API_URL } from "../http/http";
import { Dispatch, SetStateAction } from "react";
import axios from "axios";

interface IProductItemCatalog {
    product: IProduct;
    refetchProductsCatalog: () => {}, // указываем полю refetchDataProductsCart что это стрелочная функция 

    setPage:Dispatch<SetStateAction<number>> // указываем тип для функции,которая изменяет состояние useState и указываем,что параметр этой функции будет с типом nubmer
}

// берем пропс(параметр) refetchProductsCatalog из пропсов этого компонента,эту функцию refetchProductsCatalog передаем как пропс(параметр) в этот компонент в файле Catalog.tsx,эта функция для обновления массива товаров каталога,передаем функцию для изменения состояния setPage,чтобы изменять состояние текущей страницы пагинации каталога на 1,когда удаляется товар
const ProductItemCatalog = ({ product, refetchProductsCatalog,setPage }: IProductItemCatalog) => {

    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth,используя наш типизированный хук для useSelector

    const { data: dataProductsCart,refetch:refetchProductsBasket } = useQuery({
        queryKey: ['productsCart'],
        queryFn: async () => {
            // делаем запрос на сервер на получение всех товаров корзины,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IProductCart,и указываем,что это массив IProductCart[]),указываем query параметр userId со значением id пользователя,чтобы получать товары корзины для конкретного авторизованного пользователя
            const response = await axios.get<IProductCart[]>(`${API_URL}/getAllProductsBasket?userId=${user.id}`);

            return response;
        }
    })

    const { mutate: mutateDeleteProductCatalog } = useMutation({
        mutationKey: ['deleteProductCatalog'],
        mutationFn: async (productCatalog: IProduct) => {
            // делаем запрос на сервер для удаление товара корзины, указываем тип данных,которые нужно удалить на сервере(в данном случае IProduct),но здесь не обязательно указывать тип
            await $api.post<IProduct>(`${API_URL}/deleteProductCatalog`,productCatalog);
        },

        // при успешной мутации обновляем весь массив товаров каталога с помощью функции refetchProductsCatalog,которую мы передали как пропс (параметр) этого компонента,если не обновить этот массив товаров каталога,то он будет обновлен только после перезагрузки страницы
        onSuccess() {
            refetchProductsCatalog();
            setPage(1); // изменяем состояние текущей страницы пагинации каталога на 1,чтобы при удалении товара текущая страница становилась 1

            refetchProductsBasket(); // обновляем массив товаров корзины после удаления товара
        }

    })

    const router = useNavigate();

    return (
        // делаем этот div отдельно от div с основными элементами товара,чтобы отделить кнопку админа для удаления товара и при нажатии на эту кнопку выполнялось удаления товара,а не переход на страницу товара
        <div className="sectionDeals__item2">

            {/* если user.roleId равно 2(то есть пользователь авторизован как администратор),то показываем кнопку админа для удаления товара из базы данных */}
            {user.roleId === 2 &&
                <button className="productItem__deleteProductBtn productItem__deleteProductBtn-catalogProductBtn" onClick={() => mutateDeleteProductCatalog(product)}>
                    <img src="/images/sectionCart/Close.png" alt="" className="productItem__deleteProductBtn-img" />
                </button>
            }

            <div className="mainBlock__products-item" onClick={() => router(`/catalog/${product.id}`)}>
                <img src={`http://localhost:5000/${product.image}`} alt="" className="products__item-img" />
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
        </div>
    )
}

export default ProductItemCatalog;