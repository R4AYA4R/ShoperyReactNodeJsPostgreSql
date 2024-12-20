import { Router } from "express";
import productController from "../controllers/productController.js";
import userController from "../controllers/userController.js";
import { body } from "express-validator"; // импортируем функцию body из express-validator для валидации тела запроса
import authMIddleware from "../middlewares/authMIddleware.js";

const router = new Router(); // создаем объект на основе этого класса Router

router.get('/getProducts', productController.getProducts); // описываем get запрос на сервере,первым параметром указываем url,по которому этот эндпоинт будет отрабатывать,а вторым передаем функцию,которая будет срабатывать на этом эндпоинте(по этому url)

router.get('/getProductsCatalog', productController.getProductsCatalog); 

router.get('/getProductsCatalog/:id', productController.getProductId); 

router.get('/getProductsCatalogWithouLimit', productController.getProductsCatalogWithoutLimit); 


router.post('/createComment',userController.createComment); // создаем post запрос на создание комментария в базе данных

router.get('/getCommentsForProduct',userController.getCommentsForProduct); // создаем get запрос на получение комментариев для определенного товара


router.put('/updateProductRating',userController.updateProductRating); // создаем put запрос для обновления рейтинга товара 


router.post('/createProductBasket',userController.addProductToCart); // создаем post запрос для создания товара в корзине

router.get('/getAllProductsBasket',userController.getAllProductsBasket); // создаем get запрос на получение товаров корзины для определенного авторизованного пользователя


router.put('/updateCartProduct',userController.updateCartProduct); // создаем put запрос на обновление данных товара корзины

router.delete('/deleteCartProduct/:productId',userController.deleteCartProduct); // создаем delete запрос на удаление товара корзины, delete запрос не имеет тела запроса и все query параметры передаются через строку запроса,в данном случае передаем через двоеточие query параметр productId(id товара корзины,который нужно удалить)


router.put('/changeAccInfo',authMIddleware,body('email').isEmail(),userController.changeAccInfo);  // указываем put запрос для изменения данных пользователя в базе данных,вторым параметром указываем authMiddleware для проверки на access токен у пользователя,если он есть и он еще годен по сроку жизни этого токена(мы этот срок указали при создании токена),то будет выполнена функция changeAccInfo,если нет,то не будет и будет ошибка,третьим параметром указываем middleware(функцию body для валидации),указываем в параметре body() названия поля из тела запроса,которое хотим провалидировать(в данном случае это email),и указываем валидатор isEmail() для проверки на email

router.put('/changeAccPass',authMIddleware,userController.changeAccPass); // создаем put запрос для изменения пароля пользователя в базе данных,вторым параметром указываем наш authMIddleware для проверки на access токен у пользователя,если он есть и он еще годен по сроку жизни этого токена(мы этот срок указали при создании токена),то будет выполнена функция changeAccPass,если нет,то не будет и будет ошибка 


router.post('/uploadFile',authMIddleware,userController.uploadFile); // указываем post запрос для загрузки файла с фронтенда на наш node js сервер(в данном случае в папку static),вторым параметром указываем наш authMiddleware для проверки на access токен

router.delete('/deleteFile/:fileName',userController.deleteFile);  // указываем delete запрос для удаления файла с нашего node js сервера(в данном случае из папки static),delete запрос не имеет тела запроса и все параметры передаются через строку,тут указываем через :(двоеточие) динамический параметр fileName,то есть этот параметр может меняться(в данном случае этот параметр нужен,чтобы удалить файл из папки static по этому названию fileName)

router.post('/addNewProductCatalog',authMIddleware,userController.addProductToCatalog); // создаем post запрос для создания нового товара в базе данных


router.post('/deleteProductCatalog',authMIddleware,userController.deleteProductCatalog); // создаем post запрос на удаление товара из каталога для админа,делаем здесь post запрос,а не delete,так как нужно передать в тело запроса объект товара,который хотим удалить,чтобы брать у этого объекта нужные поля(но можно было сделать и delete запрос,только передавать нужные поля в url к эндпоинту,так как delete запрос не имеет тела запроса)


router.put('/changePriceProductCatalog',authMIddleware,userController.changePriceProductCatalog); // создаем put запрос для изменения цены товара каталога(эта функция будет для админа)


router.get('/getAdminFields',userController.getAdminFields); // создаем get запрос для получения объекта админ полей(текста и тд на сайте),которые потом админ сможет изменять на сайте

router.put('/changeAdminFields',authMIddleware,userController.changeAdminFields); // создаем put запрос для изменения объекта админ полей(текста и тд на сайте)


router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min:3,max:32}),
    userController.registration); // указываем post запрос для регистрации по маршруту /registration,вторым параметром указываем middleware(функцию body для валидации),указываем в параметре body() названия поля из тела запроса,которое хотим провалидировать(в данном случае это email),и указываем валидатор isEmail() для проверки на email,также валидируем и пароль,но там уже указываем валидатор isLength(),куда передаем объект и поля min(минимальное количество) и max(максимальное) по количеству символов,третьим параметром указываем функцию registration из нашего userController для регистрации,которая будет отрабатывать на этом эндпоинте

router.post('/login',userController.login); // указываем post запрос для логина

router.post('/logout',userController.logout); // указываем post запрос для выхода из аккаунта

router.get('/refresh',userController.refresh); // указываем get запрос для перезаписывания access токена,если он умер(то есть здесь будем отправлять refresh токен и получать обратно пару access и refresh токенов),если у access токена время действия закончилось,то мы с фронтенда делаем запрос на /refresh,перезаписываем там access и refresh токены,и тогда,если аккаунт украли и у мошенника закончилсоь время жизни access токена,то делается запрос на /refresh,но уже у него access и refresh токены не действительны и он не может получить доступ к сервисам,authMiddleware нужен,чтобы защитить пользователя от мошенников,так как,когда истекает access токен,идет запрос на refresh токен,и после этого обновляется и access токен,и refresh токен,соответственно мошенник уже не может получить доступ к этому эндпоинту(маршруту по url),так как его refresh и access токен будут уже не действительны,а функция checkAuth нужна для проверки только refresh токена(то есть,если пользователь вообще не пользовался сервисом какое-то время(которое указали у жизни refresh токена),нужно именно не переобновлять страницы и тд,чтобы не шел запрос на /refresh(иначе refresh токен будет переобновляться с каждым запросом,нужно,чтобы refresh токен истек до запроса на /refresh),то его refresh токен истечет и его выкинет с аккаунта после обновления страницы,но если пользователь будет использовать в данном случае,например,функцию authMiddleware,то его access токен и refresh токен будут заново перезаписаны и таймер на время жизни refresh токена будет обновлен и заново запущен,поэтому его не будет выкидывать из аккаунта) 


//authMiddleware нужен,чтобы защитить пользователя от мошенников,так как,когда истекает access токен,идет запрос на refresh токен,и после этого обновляется и access токен,и refresh токен,соответственно мошенник уже не может получить доступ к этому эндпоинту(маршруту по url),так как его refresh и access токен будут уже не действительны,а функция checkAuth нужна для проверки только refresh токена(то есть,если пользователь вообще не пользовался сервисом какое-то время(которое указали у жизни refresh токена),нужно именно не переобновлять страницы и тд,чтобы не шел запрос на /refresh(иначе refresh токен будет переобновляться с каждым запросом,нужно,чтобы refresh токен истек до запроса на /refresh),то его refresh токен истечет и его выкинет с аккаунта после обновления страницы,но если пользователь будет использовать в данном случае,например,функцию authMiddleware,то его access токен и refresh токен будут заново перезаписаны и таймер на время жизни refresh токена будет обновлен и заново запущен,поэтому его не будет выкидывать из аккаунта) 

export default router;