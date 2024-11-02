import { AxiosResponse } from "axios";
import { AuthResponse } from "../types/types";
import $api from "../http/http";

export default class AuthService{

    // создаем функцию у этого класса для регистрации,принимает эта функция в параметрах email пользователя, пароль и имя пользователя,указываем им тип string,указываем тип,который возвращает эта функция(в данном случае Promise,так как она асинхронная,и у Promise в generic указываем AxiosResponse(тип данных,который возвращает axios) и внутри AxiosResponse указываем еще наш тип AuthResponse(тип данных,уже конкретная data, которая приходит от сервера)),указываем тип этой функции static,чтобы можно было вызывать эту функцию без создания экземпляра этого класса(то есть не делая объект на основе этого класса,а просто указывая этот класс и через точку эту функцию)
    static async registration(email:string,password:string,userName:string):Promise<AxiosResponse<AuthResponse>>{

        return $api.post<AuthResponse>('/registration',{email,password,userName}); // используем наш instance axios(наш axios с определенными настройками для работы) и указываем здесь post(post запрос),первым параметром указываем адрес эндпоинта (/registration),вторым параметром указываем тело запроса,указываем тип данных,который возвращает этот post запрос(AuthResponse в данном случае)

    }

    static async login(email:string,password:string):Promise<AxiosResponse<AuthResponse>>{

        return $api.post<AuthResponse>('/login',{email,password}); // используем наш instance axios(наш axios с определенными настройками для работы) и указываем здесь post(post запрос),первым параметром указываем адрес эндпоинта (/login),вторым параметром указываем тело запроса,указываем тип данных,который возвращает этот post запрос(AuthResponse в данном случае)


    }

    // функция для запроса на выход из аккаунта,указываем тип возвращаемых данных Promise<void>(что промис ничего не возвращает)
    static async logout():Promise<void>{
        return $api.post('/logout');  // используем наш instance axios(наш axios с определенными настройками для работы) и указываем здесь post(post запрос) на эндпоинт /logout для выхода из аккаунта
    }

}