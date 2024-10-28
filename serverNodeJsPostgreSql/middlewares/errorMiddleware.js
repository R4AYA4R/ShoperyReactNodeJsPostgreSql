import ApiError from "../exceptions/ApiError.js";

// создаем и экспортируем функцию для обработки ошибок
export default function(err,req,res,next){

    console.log(err);  // выводим в консоль err(ошибку,если она была)

    // если ошибка является инстансом нашего класса ApiError,то есть принадлежит ли параметр err(ошибка) нашему классу ApiError
    if(err instanceof ApiError){
        console.log(err.message);
        return res.status(err.status).json({message:err.message,errors:err.errors});  // возвращаем на клиент статус код ошибки(err.status),сообщение ошибки и массив ошибок(err.errors)

    }

    return res.status(500).json({message:"Непредвиденная ошибка"}); // если проверка выше не сработала,то возвращаем на клиент статус код 500(серверная ошибка) и сообщение

}