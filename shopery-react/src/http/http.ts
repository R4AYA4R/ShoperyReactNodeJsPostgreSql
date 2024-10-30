import axios from "axios";

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


export default $api;  // экспортируем наш $api(инстанс axios)