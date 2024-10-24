import { Op } from "sequelize"; // импортируем Op из sequelize для сложных условий и поиска
import models from "../models/models.js";

class ProductController {

    // первым параметром эти функции принимают req(запрос),а вторым параметром res(ответ),третьим параметром передаем функцию next(следующий по цепочке middleware,в данном случае это наш errorMiddleware)
    async getProducts(req, res, next) {

        // отличие req.params от req.query заключается в том,что в req.params указываются параметры в самом url до эндпоинта на бэкэнде(в node js в данном случае,типа /api/getProducts) через :(типа /:id,динамический параметр id),а req.query - это параметры,которые берутся из url(которые дополнительно добавили с фронтенда к url) через знак ?(типа ?name=bob)

        try {

            const { categoryId, tasteId } = req.query; // берем из параметров запроса поля categoryId и tasteId

            let products; // указываем переменную для массива объектов товаров,указываем ей let,чтобы можно было изменять ей значение

            // если categoryId false(или null) и tasteId false(или null),то есть эти параметры не указаны или равны пустому значению
            if (!categoryId && !tasteId) {

                products = await models.Product.findAll(); // помещаем в переменную products все записи(объекты) из базы данных postgreSql у таблицы Product с помощью функции findAll()

            }

            // если categoryId true,то есть в categoryId есть какое-то значение,то изменяем переменную products на все товары,отфильтрованные по categoryId(по категории)
            if (categoryId) {

                products = await models.Product.findAll({ where: { categoryId: categoryId } }); // помещаем в переменную products все записи(объекты) из базы данных postgreSql у таблицы Product с помощью функции findAll(),указываем условие с помощью where и указываем,что берем все объекты из таблицы Product где categoryId равно параметру categoryId,который взяли из параметров запроса
            }

            return res.json(products); // возвращаем массив товаров(products) на клиент после всех проверок выше


        } catch (e) {
            console.log(e);
        }
    }


    async getProductsCatalog(req, res) {

        try {

            let { categoryId, tasteId, name, priceFilter, limit, page } = req.query; // берем из параметров запроса поля categoryId и tasteId,указываем здесь let,чтобы  можно было изменять значения этих параметров(переменных),в данном случае это надо для limit и page

            page = page || 1;  // указываем значение переменной page как параметр,который взяли из строки запроса,если он не указан,то делаем значение 1 

            limit = limit || 2; // указываем значение переменной limit как параметр,который взяли из строки запроса,если он не указан,то делаем значение 3

            let offset = page * limit - limit; // считаем отступ,допустим перешли на вторую страницу и первые 3 товара нужно пропустить(в данном случае это limit),поэтому умножаем page(текущую страницу) на limit и отнимаем лимит,то есть offset считает,сколько нужно пропустить объектов до того,как отправлять объекты(например всего товаров 12, текущая страница 3,лимит 3, соответственно 3 * 3 - 3 будет 6,то есть 6 товаров пропустятся,на следующей странице(4) будет уже пропущено 4 * 3 - 3 равно 9(то есть 9 товаров пропущено будет), offset указывает пропустить указанное число строк(объектов в таблице в базе данных), прежде чем начать выдавать строки(объекты) )

            let categoryObj; // указываем переменную для объекта категории,укаызаем ей let,чтобы потом изменять ее значение

            let priceFilterObj;

            let tasteFilterObj;

            // если categoryId true(то есть в параметре categoryId есть какое-то значение,то указываем значение переменной categoryObj как объект с полем categoryId и значением параметра categoryId(который мы взяли из url),в другом случае указываем значение переменной categoryObj как null,это делаем,чтобы проверить,указан ли categoryId,и если нет,то указываем этой переменной значение null,и потом эту переменную(этот объект) categoryObj разворачиваем в условии для получения объектов товаров из базы данных postgreSql ниже в коде)
            if (categoryId) {

                categoryObj = {
                    categoryId: categoryId
                }

            } else {
                categoryObj = null;
            }

            if (priceFilter) {

                priceFilterObj = {
                    priceFilter: priceFilter
                }

            } else {
                priceFilterObj = null;
            }

            // если tasteId true,то есть в tasteId есть какое-то значение
            if (tasteId) {

                // указываем переменной tasteFilterObj значение объекта с полем tasteId и значением как query параметр tasteId,который мы взяли из url от фронтенда,это работает также,когда мы передаем несколько query параметров tasteId но с разными значениями в url,например http://localhost:5000/tasteId=1&tasteId=2&tasteId=3,объекты будут фильтроваться и находится те,у которых есть поле tasteId со значением 1,2 и 3,другие находиться не будут
                tasteFilterObj = {
                    tasteId: tasteId
                }

            } else {
                tasteFilterObj = null;
            }


            let products;


            // вместо функции findAll() используем findAndCountAll(), используем функцию findAndCountAll,чтобы найти и посчитать сколько объектов пришло из базы данных под данному запросу к базе данных(этот подсчет идет автоматически),то есть допустим по этому запросу с этими фильтрами было найдено 10 объектов,это число 10 будет возвращено на фронтенд в поле count,а в поле rows будут возвращены эти объекты но уже для конкретной страницы,делаем это для пагинации,в таком случае на фронтенд придет объект с полем count в котором будет число объектов всего,которые есть в таблице,а в поле rows будут объекты,которые соответствуют параметрам запроса к базе данных(то есть которые будут отфильтрованы по лимиту и странице)
            products = await models.Product.findAndCountAll({
                where: {
                    name: {
                        [Op.iLike]: `%${name}%` // указываем у Op метод iLike(он нужен для поиска по полю объектов в базе данных postgreSql,он ищет похожие совпадения по значениям,которые равны в данном случае параметру name(этот параметр мы получили из url от фронтенда,этот параметр с фронтенда мы передаем в этот параметр значение инпута поиска),который мы указали потом через двоеточие),указываем знаки процента перед поисковым параметром name(в данном случае) и после поискового параметра,это значит,что не важно в каком порядке будет написана буква или слово,оно будет просто проверяться,есть ли такая буква у поля объекта или нет(то есть как и нам нужно для поиска),если не указывать эти знаки процента,то поиск будет осуществляться только по полным значениям поля объекта и по конкретному порядку букв и слов у поля объекта( то есть символ процента % означает, что на этом месте может быть что угодно – один символ или сотня, или ни одного ),есть также метод like у Op,но он отличается от iLike тем,что в iLike не важен регистр букв(то есть не важно,заглавные буквы будут или маленькие),а в методе like соблюдается регистр букв,и если будут введены,например,какие-то заглавные буквы,то такие же маленькие буквы у поля объекта не будут находится,также у Op(оператора sequelize) есть другие методы и операторы типа and,or, between(сравнение чисел,типа [Op.between]:[8,10], число между 8 и 10), Op.gt(больше определенного числа,типа [Op.gt]:5, больше 5), Op.in(проверяет,содержится ли значение в конкретном списке значений,типа вместо оператора or, например, [Op.in]:[1,2,3], то есть содержится ли значение поля в хотя бы одном значении элемента этого массива чисел) и тд(можно посмотреть в интернете отдельно) 
                    },

                    ...categoryObj, // разворачиваем объект categoryObj(вместо этого будет подставлено categoryId:categoryId,если проверка выше на categoryId была true,если была false,то тут будет null)

                    ...priceFilterObj,

                    ...tasteFilterObj, // разворачиваем переменную tasteFilterObj(если в tasteId будет значение,то эта переменная будет объектом,мы это прописывали выше) и вместо этой переменной будет подставлено tasteId:tasteId, то есть находим все объекты,у которых поле tasteId равно значению query параметра tasteId,котоырй мы взяли из url от фронтенда, это работает также,когда мы передаем несколько query параметров tasteId но с разными значениями в url,например http://localhost:5000/tasteId=1&tasteId=2&tasteId=3,объекты будут фильтроваться и находится те,у которых есть поле tasteId со значением 1,2 и 3(то есть значение или 1,или 2,или 3),другие находиться не будут

                },

                limit, // передаем limit(максимальное количество объектов на одной странице,мы его взяли из url от фронтенда) для пагинации

                offset // offset указывает пропустить указанное число строк(объектов в таблице в базе данных), прежде чем начать выдавать строки(объекты) )

            });



            return res.json(products); // возвращаем массив товаров(products) на клиент после всех проверок выше


        } catch (e) {
            console.log(e);
        }

    }


    // функция для получения товаров без лимита(без пагинации,в данном случае это для отображения числа товаров в разных категориях на фронтенде)
    async getProductsCatalogWithoutLimit(req, res) {

        try {

            const { categoryId, tasteId, name, priceFilter } = req.query; // берем из параметров запроса поля categoryId и tasteId,указываем здесь let,чтобы  можно было изменять значения этих параметров(переменных),в данном случае это надо для limit и page

            const products = await models.Product.findAll({
                where:
                {
                    name: {
                        [Op.iLike]: `%${name}%` // указываем у Op метод iLike(он нужен для поиска по полю объектов в базе данных postgreSql,он ищет похожие совпадения по значениям,которые равны в данном случае параметру name(этот параметр мы получили из url от фронтенда,этот параметр с фронтенда мы передаем в этот параметр значение инпута поиска),который мы указали потом через двоеточие),указываем знаки процента перед поисковым параметром name(в данном случае) и после поискового параметра,это значит,что не важно в каком порядке будет написана буква или слово,оно будет просто проверяться,есть ли такая буква у поля объекта или нет(то есть как и нам нужно для поиска),если не указывать эти знаки процента,то поиск будет осуществляться только по полным значениям поля объекта и по конкретному порядку букв и слов у поля объекта( то есть символ процента % означает, что на этом месте может быть что угодно – один символ или сотня, или ни одного ),есть также метод like у Op,но он отличается от iLike тем,что в iLike не важен регистр букв(то есть не важно,заглавные буквы будут или маленькие),а в методе like соблюдается регистр букв,и если будут введены,например,какие-то заглавные буквы,то такие же маленькие буквы у поля объекта не будут находится,также у Op(оператора sequelize) есть другие методы и операторы типа and,or, between(сравнение чисел,типа [Op.between]:[8,10], число между 8 и 10), Op.gt(больше определенного числа,типа [Op.gt]:5, больше 5), Op.in(проверяет,содержится ли значение в конкретном списке значений,типа вместо оператора or, например, [Op.in]:[1,2,3], то есть содержится ли значение поля в хотя бы одном значении элемента этого массива чисел) и тд(можно посмотреть в интернете отдельно) 
                    },
                }
            }); // находим все объекты из базы данных и помещаем их в переменную products

            return res.json(products); // возвращаем массив товаров(products) на клиент после всех проверок выше

        } catch (e) {
            console.log(e);
        }

    }


    async getProductId(req,res){

        try{

            const {id} = req.params; // берем id из параметров запроса(мы указали этот динамический параметр id в url к эндпоинту,поэтому можем его взять из req.params)

            // ищем один объект в таблице Product в базе данных с помощью функции findOne() и помещаем его в переменную product,передаем условие,что нужно найти объект с полем id как параметр запроса id(можно было указать where {id:id}, но можно указать один раз id,так как название ключа(поля в объекте) и его значение одинаковые)
            const product = await models.Product.findOne({
                where:{id}
            });

            return res.json(product); // возвращаем объект товара(product) на клиент после всех проверок выше

        }catch(e){
            console.log(e);
        }

    }

}

export default new ProductController(); // экспортируем объект на основе класса ProductController