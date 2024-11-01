import axios from "axios";
import { AuthResponse } from "../types/types";

export const API_URL = `http://localhost:5000/api`; // создаем и экспортируем переменную для url нашего сервиса,в данном случае указываем базовый url до нашего router в бэкэнд части сайта

const $api = axios.create({
    withCredentials:true, // указываем,чтобы к каждому запросу axios cookie цеплялись автоматически,указываем это поле true

    baseURL:API_URL // указываем базовый url для axios(в данном случае нашу переменную API_URL)
})


// создаем interceptor(функция,которая будет отрабатывать на каждый запрос или ответ от сервера(в данном случае на каждый запрос),эта функция параметром принимает config инстанса axios(типа axios),у этого config есть те же поля типа headers,baseUrl и тд) на request(запрос на сервер)
$api.interceptors.request.use((config) => {

    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`; // указываем значение полю Authorization у поля headers у config,даем ему значение токена,первым словом указываем тип токена Bearer(в данном случае) и сам токен,который берем из localStorage по ключу(по названию) token

    return config; // возвращаем этот config

})


// создаем interceptor(функция,которая будет отрабатывать на каждый запрос на сервер(в данном случае на каждый ответ от сервера),эта функция параметром принимает config инстанса axios(типа axios),у этого config есть те же поля типа headers,baseUrl и тд) на response(ответ от сервера),первым параметром указываем callback,который выполнится,если запрос прошел успешно,а вторым параметром указываем callback,который выполнится в тот момент,когда прозошла ошибка
$api.interceptors.response.use((config)=>{

    return config; // возвращаем config

},async (error)=> {

    const originalRequest = error.config; // указываем этот originalRequest и проверки ниже на error.config._isRetry,чтобы не зациклились запросы

    // если status код у response у error равен 401(то есть пользователь не авторизован), и если error.config true,и если error.config._isRetry false(то есть повторный запрос мы еще не делали,это мы проверяем,чтобы эти запросы не зациклились и чтобы повторный запрос можно было сделать только 1 раз)
    if(error.response.status === 401 && error.config && !error.config._isRetry){

        originalRequest._isRetry = true; // указываем,что это уже повторный запрос,соответственно после этого запроса,других таких же уже не будет

        // оборачиваем здесь в try catch для отлавливания ошибок
        try{

            // здесь используем уже обычный axios,так как и так может вернуться статус код 401 и мы уже знаем,что пользователь не авторизован,и уже наш инстанс axios не нужен здесь,указываем тип в generic,что в ответе от сервера ожидаем наш тип данных AuthResponse,указываем наш url до нашего роутера(/api) на бэкэнде(API_URL мы импортировали из другого нашего файла) и через / указываем refresh(это тот url,где мы выдаем access и refresh токены на бэкэнде),и вторым параметром указываем объект опций,указываем поле withCredentials true(чтобы автоматически с запросом отправлялись cookies)
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`,{withCredentials:true}); // в переменную response здесь будут помещены 2 токена(access и refresh),если запрос прошел успешно

            localStorage.setItem('token',response.data.accessToken); // сохраняем по новой access токен в localStorage по ключу token

            return $api.request(originalRequest); // возвращаем,используем функцию request у нашего инстанса axios и передаем туда в параметре переменную originalRequest(она хранит в себе все данные для запроса),то есть делаем запрос еще раз после того,как сделали запрос на получение токенов(например,сделали запрос на получение пользователей,после этого,когда пришел 401 статус код(то есть пользователь не авторизован,refresh токен или access токен слетел),делаем запрос на получение refresh и access токенов и после этого делаем опять запрос на получение пользователей(в таком случае,если не было ошибок при получении refresh и access токенов,то уже при повторном запросе на получение пользователей ошибки и 401 статус кода не будет,так как тогда уже сохраним refresh токен в cookie и access токен в localStorage))

        }catch(e){
            console.log('НЕ АВТОРИЗОВАН');  // выводим сообщение,если будет ошибка
        }

    }

    throw error; // если условие выше не отработало,то бросаем ошибку на верхний уровень,так как может быть ошибка не только 401 статус код

});


export default $api;  // экспортируем наш $api(инстанс axios)