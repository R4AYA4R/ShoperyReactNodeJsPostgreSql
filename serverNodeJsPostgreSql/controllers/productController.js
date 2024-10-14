import models from "../models/models.js";

class ProductController{

    // первым параметром эти функции принимают req(запрос),а вторым параметром res(ответ),третьим параметром передаем функцию next(следующий по цепочке middleware,в данном случае это наш errorMiddleware)
    async getProducts(req,res,next){

        // отличие req.params от req.query заключается в том,что в req.params указываются параметры в самом url до эндпоинта на бэкэнде(в node js в данном случае,типа /api/getProducts) через :(типа /:id,динамический параметр id),а req.query - это параметры,которые берутся из url(которые дополнительно добавили с фронтенда к url) через знак ?(типа ?name=bob)
        
        try{

            const {categoryId,tasteId} = req.query; // берем из параметров запроса поля categoryId и tasteId

            let products; // указываем переменную для массива объектов товаров,указываем ей let,чтобы можно было изменять ей значение

            // если categoryId false(или null) и tasteId false(или null),то есть эти параметры не указаны или равны пустому значению
            if(!categoryId && !tasteId){

                products = await models.Product.findAll(); // помещаем в переменную products все записи(объекты) из базы данных postgreSql у таблицы Product с помощью функции findAll()

            }

            // если categoryId true,то есть в categoryId есть какое-то значение,то изменяем переменную products на все товары,отфильтрованные по categoryId(по категории)
            if(categoryId){

                products = await models.Product.findAll({where:{categoryId:categoryId}}); // помещаем в переменную products все записи(объекты) из базы данных postgreSql у таблицы Product с помощью функции findAll(),указываем условие с помощью where и указываем,что берем все объекты из таблицы Product где categoryId равно параметру categoryId,который взяли из параметров запроса
            }

            return res.json(products); // возвращаем массив товаров(products) на клиент после всех проверок выше
    

        }catch(e){
            console.log(e);
        }
    }

}

export default new ProductController(); // экспортируем объект на основе класса ProductController