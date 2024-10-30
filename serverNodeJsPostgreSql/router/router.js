import { Router } from "express";
import productController from "../controllers/productController.js";
import userController from "../controllers/userController.js";
import { body } from "express-validator"; // импортируем функцию body из express-validator для валидации тела запроса

const router = new Router(); // создаем объект на основе этого класса Router

router.get('/getProducts', productController.getProducts); // описываем get запрос на сервере,первым параметром указываем url,по которому этот эндпоинт будет отрабатывать,а вторым передаем функцию,которая будет срабатывать на этом эндпоинте(по этому url)

router.get('/getProductsCatalog', productController.getProductsCatalog); 

router.get('/getProductsCatalog/:id', productController.getProductId); 

router.get('/getProductsCatalogWithouLimit', productController.getProductsCatalogWithoutLimit); 


router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min:3,max:32}),
    userController.registration); // указываем post запрос для регистрации по маршруту /registration,вторым параметром указываем middleware(функцию body для валидации),указываем в параметре body() названия поля из тела запроса,которое хотим провалидировать(в данном случае это email),и указываем валидатор isEmail() для проверки на email,также валидируем и пароль,но там уже указываем валидатор isLength(),куда передаем объект и поля min(минимальное количество) и max(максимальное) по количеству символов,третьим параметром указываем функцию registration из нашего userController для регистрации,которая будет отрабатывать на этом эндпоинте

export default router;