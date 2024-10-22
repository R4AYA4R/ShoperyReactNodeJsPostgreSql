import { Router } from "express";
import productController from "../controllers/productController.js";

const router = new Router(); // создаем объект на основе этого класса Router

router.get('/getProducts', productController.getProducts); // описываем get запрос на сервере,первым параметром указываем url,по которому этот эндпоинт будет отрабатывать,а вторым передаем функцию,которая будет срабатывать на этом эндпоинте(по этому url)

router.get('/getProductsCatalog', productController.getProductsCatalog); 

router.get('/getProductsCatalogWithouLimit', productController.getProductsCatalogWithoutLimit); 

export default router;