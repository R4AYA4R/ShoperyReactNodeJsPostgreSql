import { useNavigate } from "react-router-dom";
import { IProduct, IProductCart } from "../types/types";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useMutation, useQuery } from "@tanstack/react-query";
import $api, { API_URL } from "../http/http";
import axios from "axios";

// создаем интерфейс(тип) для пропсов компонента ProductItem,указываем в нем поле product с типом нашего интерфейса IProduct
interface IProductItem {
    product: IProduct,

    refetchProductsCatalog: () => {}, // указываем полю refetchDataProductsCart что это стрелочная функция 
}

const ProductItem = ({ product,refetchProductsCatalog}: IProductItem) => {

    const {data,refetch:refetchInSectionDeals} = useQuery({
        queryKey:['getAllProducts'], // указываем здесь такое же название,как и в файле PopularProducts для получения товаров,это чтобы при удалении товара обновлялись данные автоматически сразу в другой компоненте(в данном случае в PopularProducts),а не после обновления страницы
        queryFn:async ()=>{
            const response = await axios.get<IProduct[]>('http://localhost:5000/api/getProducts',{
                params:{
                    limit:8 // указываем параметр лимит со значением 8,чтобы максимальное количество объектов,которые могут прийти от сервера было 8,можно указать query параметры и просто в url через знак вопроса,но можно и тут в отдельном объекте
                }
            }); // делаем запрос на сервер для получения всех товаров,указываем в типе в generic наш тип на основе интерфейса IProduct,указываем,что это массив(то есть указываем тип данных,которые придут от сервера)

            
            console.log(response.data);

            return response;
        }
    })

    const {data:dataPopularProducts,refetch:refetchPopularProducts} = useQuery({
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

    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth,используя наш типизированный хук для useSelector

    const { data: dataProductsCart,refetch:refetchProductsBasket } = useQuery({
        queryKey: ['productsCart'],
        queryFn: async () => {
            // делаем запрос на сервер на получение всех товаров корзины,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IProductCart,и указываем,что это массив IProductCart[]),указываем query параметр userId со значением id пользователя,чтобы получать товары корзины для конкретного авторизованного пользователя
            const response = await axios.get<IProductCart[]>(`${API_URL}/getAllProductsBasket?userId=${user.id}`);

            return response;
        }
    })

    const {mutate:mutateDeleteProductCatalog} = useMutation({
        mutationKey:['deleteProductCatalog'],
        mutationFn: async (productCatalog:IProduct) => {
            // делаем запрос на сервер для удаление товара корзины, указываем тип данных,которые нужно удалить на сервере(в данном случае IProduct),но здесь не обязательно указывать тип
            await $api.post<IProduct>(`${API_URL}/deleteProductCatalog`,productCatalog);
        },

        // при успешной мутации обновляем весь массив товаров каталога с помощью функции refetchProductsCatalog,которую мы передали как пропс (параметр) этого компонента,если не обновить этот массив товаров каталога,то он будет обновлен только после перезагрузки страницы,также делаем обновление данных для других компонентов типа PopularProducts
        onSuccess() {
            refetchProductsCatalog();
            refetchInSectionDeals();
            refetchPopularProducts();
            refetchProductsBasket();
        }
    })

    const router = useNavigate();  // useNavigate может перемещатьтся на другую страницу вместо ссылок

    return (
        // делаем этот div отдельно от div с основными элементами товара,чтобы отделить кнопку админа для удаления товара и при нажатии на эту кнопку выполнялось удаления товара,а не переход на страницу товара
        <div className="sectionDeals__item2" >

            {/* если user.roleId равно 2(то есть пользователь авторизован как администратор),то показываем кнопку админа для удаления товара из базы данных */}
            {user.roleId === 2 &&
                <button className="productItem__deleteProductBtn" onClick={()=>mutateDeleteProductCatalog(product)}>
                    <img src="/images/sectionCart/Close.png" alt="" className="productItem__deleteProductBtn-img" />
                </button>
            }

            {/* если product.id > 0 && product.id < 4 true(то есть первые 3 товара),то одни классы даем, в другом случае,если product.id > 4 && product.id < 8 true(то есть с 5 по 7 товар даем еще другие классы),и уже если условия перед этим не выполняются,то ставим просто класс "sectionDeals__deals-item",это чтобы указать определенным товарам определенные классы,в данном случае для border) */}
            <div className={product.id > 0 && product.id < 4 ? "sectionDeals__deals-item sectionDeals__deals-itemBorderRight" : product.id > 4 && product.id < 8 ? "sectionDeals__deals-item sectionDeals__deals-itemBorderTopRight" : product.id === 8 ? "sectionDeals__deals-item sectionDeals__deals-itemBorderTop" : "sectionDeals__deals-item"} onClick={() => router(`/catalog/${product.id}`)}>
                <img src={`http://localhost:5000/${product.image}`} alt="" className="deals__item-img" />
                <div className="deals__item-stars">
                    <img src={product.rating === 0 ? "/images/sectionDeals/Star 5.png" : "/images/sectionDeals/Star 4.png"} alt="" className="stars__itemOrange stars__ProductItemPage" />
                    <img src={product.rating >= 2 ? "/images/sectionDeals/Star 4.png" : "/images/sectionDeals/Star 5.png"} alt="" className="stars__itemOrange stars__ProductItemPage" />
                    <img src={product.rating >= 3 ? "/images/sectionDeals/Star 4.png" : "/images/sectionDeals/Star 5.png"} alt="" className="stars__itemOrange stars__ProductItemPage" />
                    <img src={product.rating >= 4 ? "/images/sectionDeals/Star 4.png" : "/images/sectionDeals/Star 5.png"} alt="" className="stars__itemOrange stars__ProductItemPage" />
                    <img src={product.rating >= 5 ? "/images/sectionDeals/Star 4.png" : "/images/sectionDeals/Star 5.png"} alt="" className="stars__itemOrange stars__ProductItemPage" />
                </div>
                <p className="deals__item-text">{product.name}</p>
                <p className="deals__item-price">${product.price}</p>
            </div>

        </div>
    )
}

export default ProductItem;