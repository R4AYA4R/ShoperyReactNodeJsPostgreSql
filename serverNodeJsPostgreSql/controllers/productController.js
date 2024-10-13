import models from "../models/models.js";

class ProductController{

    // первым параметром эти функции принимают req(запрос),а вторым параметром res(ответ),третьим параметром передаем функцию next(следующий по цепочке middleware,в данном случае это наш errorMiddleware)
    async getProducts(req,res,next){
        
        try{

            const products = await models.Product.findAll(); // помещаем в переменную products все записи(объекты) из базы данных postgreSql у таблицы Product с помощью функции findAll()

            return res.json(products); // возвращаем массив товаров(products) на клиент
    

        }catch(e){
            console.log(e);
        }
    }

}

export default new ProductController(); // экспортируем объект на основе класса ProductController