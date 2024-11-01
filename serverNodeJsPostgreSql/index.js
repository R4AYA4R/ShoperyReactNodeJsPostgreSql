// прописали npm init в проект,чтобы инициализировать npm менеджер пакетов,чтобы устанавливать зависимости и пакеты(после npm init на все вопросы можно нажать enter и они будут тогда по дефолту указаны),устанавливаем express,cors(для отправки запросов через браузер),cookie-parser, устанавливаем с помощью npm i,устанавливаем nodemon(npm i nodemon --save-dev(чтобы устанавилось только для режима разработки)),чтобы перезагружался сервер автоматически при изменении файлов,указываем в package json в поле scripts поле dev и значение nodemon index.js(чтобы запускался index.js с помощью nodemon,чтобы перезагружался сервер автоматически при изменении файлов),используем команду npm run dev,чтобы запустить файл index.js,добавляем поле type со значение module в package.json,чтобы работали импорты типа import from,устанавливаем dotenv(npm i dotenv),чтобы использовать переменные окружения,создаем файл .env в корне папки server,чтобы указывать там переменные окружения(переменные среды),устанавливаем npm i mongodb mongoose,для работы с базой данных mongodb,на сайте mongodb создаем новый проект для базы данных,и потом берем оттуда ссылку для подключения к базе данных,устанавливаем еще jsonwebtoken(для генерации jwt токена),bcrypt(для хеширования пароля),uuid(для генерации рандомных строк) (npm i jsonwebtoken bcrypt uuid),все модули для backend(бэкэнда,в данном случае в папке server) нужно устанавливать в папку для бэкэнда(в данном случае это папка server),для этого нужно каждый раз из корневой папки переходить в папку server(cd server) и уже там прописывать npm i,устанавливаем еще пакет nodemailer(npm i nodemailer) для работы с отправкой сообщений на почту,устанавливаем библиотеку express-validator(npm i express-validator) для валидации паролей,почт и тд(для их проверки на правилно введенную информацию),для работы с файлами в express, нужно установить модуль npm i express-fileupload

//authMiddleware нужен,чтобы защитить пользователя от мошенников,так как,когда истекает access токен,идет запрос на refresh токен,и после этого обновляется и access токен,и refresh токен,соответственно мошенник уже не может получить доступ к этому эндпоинту(маршруту по url),так как его refresh и access токен будут уже не действительны,а функция checkAuth нужна для проверки только refresh токена(то есть,если пользователь вообще не пользовался сервисом какое-то время(которое указали у жизни refresh токена),нужно именно не переобновлять страницы и тд,чтобы не шел запрос на /refresh(иначе refresh токен будет переобновляться с каждым запросом,нужно,чтобы refresh токен истек до запроса на /refresh),то его refresh токен истечет и его выкинет с аккаунта после обновления страницы,но если пользователь будет использовать в данном случае,например,функцию authMiddleware,то его access токен и refresh токен будут заново перезаписаны и таймер на время жизни refresh токена будет обновлен и заново запущен,поэтому его не будет выкидывать из аккаунта) 


// указываем команду в терминале npm init -y(-y нужен,чтобы установить настройки по умолчанию автоматически,если бы не писали -y,то надо было бы нажимать enter на каждый вопрос,который будет написан после команды npm init,чтобы установить настройки по умолчанию),потом устанавливаем npm install express(для node js express), pg(для postgreSql), pg-hstore(для postgreSql), sequelize(чтобы взаимодействовать с базой данных postgreSql более просто), cors(чтобы можно было отправлять запросы на сервер из браузера), dotenv(чтобы задавать переменные окружения), устанавливаем npm i nodemon --save-dev(чтобы при сохранении файла перезагружался сервер автоматически, --save-dev значит,что устанавливаем только для режима разработки),в файле package.json в поле scripts указываем поле с названием dev(это будет название команды) и со значением nodemon index.js(чтобы по команде npm run dev запускался сервер и потом чтобы при сохранении файла перезагружался сервер автоматически),указываем в package.json поле type со значением module,чтобы работали импорты,создаем файл .env для описания переменных окружения(просто переменных,которые потом будет использовать в разных файлах), в программе pgAdmin(она устанавливается вместе с установкой postgreSql на компьютер) вводим пароль для подключения к postgres(этот пароль мы задавали при установке postgreSql на компьютер) и создаем новую базу данных,нажимая правой кнопкой мыши по вкладке databases и выбираем create,вводим там название базы данных и сохраняем,потом можно построить диаграмму базы данных(описание таблиц и полей в таблицах в нарисованном виде),это можно сделать например,на сайте app.diagrams.net,можно написать просто draw io,у каждой сущности(таблицы в базе данных) должен быть уникальный идентификатор(id),связь у таблиц 1 к 1(один к одному) значит,что один объект таблицы может принадлежать(иметь ссылку на объект другой таблицы) только одному другому объекту другой таблицы, свзять таблиц 1 ко многим значит,что один объект таблицы может принадлежать(иметь ссылку на объект другой таблицы) нескольким объектам других таблиц(типа тип товара может быть у многих объектов товаров), в pgAdmin во вкладке нужной базы данных(в данном случае postgreSqlSequelizeNodeJs),во вкладке schemas во вкладке public и во вкладке tables,можем найти наши созданные таблицы,чтобы посмотреть все записи в таблице,нужно нажать на таблицу правой кнопкой мыши и выбрать View/Edit Data(Просмотр или редактирование данных) и там выбрать All Rows(Все строки),

// комментарии выше превысили лимит слов,поэтому пишем через //(2 слеша) опять новые комментарии чуть ниже,чтобы переобновить даннные в этой таблице,можно еще раз нажать на просмотр и редактирование данных,тогда оно еще раз переобновится,устанавливаем (npm i) express-fileupload для загрузки файлов на сервер, устанавливаем (npm i) uuid для генерации рандомных строк(для рандомной генерации названия файла в данном случае),создаем папку static,в ней будем хранить файлы,которые будем загружать с фронтенда,а потом на фронтенд отдавать, чтобы удалить объект из таблицы в базе данных postgreSql с помощью sequelize,то надо использовать функцию destroy() у модели(таблицы),которую создали, типа Device.destroy({where:{id:1}}),то есть удаляем объект из таблицы Device у которого поле id равно 1(указываем условие с помощью where), чтобы обновить данные в таблице у объекта,нужно использовать функцию update(),типа Device.update({title: 'text'}, {where:{id:2}}), то есть обновляем поле title строку text(в данном случае) у объекта,у торого id равно 2(указываем условие с помощью where)

import dotenv from 'dotenv'; // импортируем dotenv

import express from 'express';  // импортируем express

import cors from 'cors'; // импортируем cors,чтобы можно было отправлять запросы на сервер из браузера

import db from './db.js'; // указываем здесь расширение файла .js,иначен не находит файл и выдает ошибку

import models from './models/models.js';
import router from './router/router.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import cookieParser from 'cookie-parser'; // импортируем cookieParser

dotenv.config(); // используем config() у dotenv,чтобы работал dotenv и можно было использовать переменные окружения

const PORT = process.env.PORT || 5000; // указываем переменную PORT и даем ей значение как у переменной PORT из файла .env,если такой переменной нет,то указываем значение 5000

const app = express();  // создаем экземпляр нашего приложения с помощью express()

app.use(cookieParser()); // подключаем cookieParser,чтобы работали cookie

// подключаем cors,чтобы взаимодействовать с сервером(отправлять запросы) через браузер,указываем,с каким доменом нужно этому серверу обмениваться куками(cookies),для этого передаем объект в cors(),указываем поле credentials true(разрешаем использовать cookies) и указываем в origin url нашего фронтенда(в данном случае это http://localhost:3000),указываем этот url через переменную окружения CLIENT_URL(мы вынесли туда этот url)
app.use(cors({
    credentials:true,
    origin: process.env.CLIENT_URL
}));

app.use(express.json()); // подключаем express.json(),чтобы наш сервер мог парсить json формат данных,то есть обмениваться с браузером json форматом данных

app.use('/api',router); // подключаем роутер к нашему серверу,первым параметром указываем url по которому будет отрабатывать этот роутер,а вторым параметром указываем сам роутер 

app.use(errorMiddleware); // подключаем наш middleware для обработки ошибок,middleware для обработки ошибок нужно подключать в самом конце всех подключений use()

// делаем эту функцию start асинхронной,так как все операции с базой данных являются асинхронными
const start = async () => {
    try{

        await db.authenticate(); // с помощью функции authenticate() у db(объекта,который мы импортировали на основе класса sequelize для работы с базой данных postgreSql) подключаемся к базе данных postgreSql

        await db.sync(); // используем функцию sync(),чтобы эта функция сверяла состояние базы данных со схемой данных которую мы опишем

        app.listen(PORT,() => console.log(`Server started on PORT = ${PORT}`)); // запускаем сервер,говоря ему прослушивать порт 5000(указываем первым параметром у listen() нашу переменную PORT) с помощью listen(),и вторым параметром указываем функцию,которая выполнится при успешном запуске сервера


        // это делаем тестово 1 раз,чтобы создать объекты в таблицах базы данных PostgreSql и потом их использовать,указываем categoryId и tasteId в соответствии с нужными категориями и вкусами,в categoryId указываем id объекта из таблицы category с нужной нам категорией,так мы будем знать,какие товары с какой категорией,для вкуса(tasteId) тоже самое,и потом будем фильтровать объекты товаров по полю categoryId со значением определенного id категории(со значением id объекта из таблицы Category,так мы будем знать,что это за категория) и для вкуса(tasteId) тоже самое 

        // await models.Product.create({name:'Green Lettuce',price:9,priceFilter:'Under $10',amount:1,totalPrice:9,image:"Product Image (1).png",categoryId:2,tasteId:1 }); // создаем объект в таблице Product,указываем в объекте нужные поля,поле rating не указываем,так как по дефолту он будет 0(мы это прописали при создании модели таблицы Product в файле models.js)

        // await models.Product.create({name:'Chinese cabbage',price:12,priceFilter:'$10-$20',amount:1,totalPrice:12,image:"Product Image.png",categoryId:2,tasteId:1});

        // await models.Product.create({name:'Eggplant',price:34,priceFilter:'Above $30',amount:1,totalPrice:34,image:"Product Image (2).png",categoryId:3,tasteId:3 });

        // await models.Product.create({name:'Green Capsicum',price:14.99,priceFilter:'$10-$20',amount:1,totalPrice:14.99,image:"Product Image (3).png",categoryId:2,tasteId:1 });

        // await models.Product.create({name:'Green Chili',price:22.35,priceFilter:'$20-$30',amount:1,totalPrice:22.35,image:"Product Image (4).png",categoryId:1,tasteId:3 });

        // await models.Product.create({name:'Red Chili',price:24.99,priceFilter:'$20-$30',amount:1,totalPrice:24.99,image:"Product Image (5).png",categoryId:1,tasteId:2 });

        // await models.Product.create({name:'Red Tomatoes',price:11,priceFilter:'$10-$20',amount:1,totalPrice:11,image:"Product Image (6).png",categoryId:1,tasteId:1 });

        // await models.Product.create({name:'Big Potatoes',price:8,priceFilter:'Under $10',amount:1,totalPrice:8,image:"Product Image (7).png",categoryId:1,tasteId:1 });

        // await models.Category.create({category:"Vegetables"});
        // await models.Category.create({category:"Beauty & Health"});
        // await models.Category.create({category:"Cooking"});

        // await models.Taste.create({taste:"Sweet"});
        // await models.Taste.create({taste:"Spicy"});
        // await models.Taste.create({taste:"Bitter"});


        // это делаем один раз для создания ролей в базе данных у таблицы Role,потом этот код закомментируем
        // await models.Role.create({value:"USER"});
        // await models.Role.create({value:"ADMIN"});

        // создали тестовые объекты пользователей, в поле roleId указали id объекта из таблицы Role(то есть указали какая роль будет у пользователя,объект Role содержит поле value со значением роли)
        // await models.User.create({email:"testEmail",userName:"testUserName",password:"testPass",roleId:1})
        // await models.User.create({email:"testEmail2",userName:"testUserName2",password:"testPass2",roleId:2})

        // создали тестовые объекты токенов,в поле userId указали id объекта из таблицы User(то есть указали у какого пользователя этот refresh токен)
        // await models.Token.create({refreshToken:"j;ladjsf;lkajdflkja",userId:1});
        // await models.Token.create({refreshToken:"j;ladjsf;lkajdflkja2",userId:2});

    }catch(e){
        console.log(e);
    }
}

start(); // вызываем нашу функцию start(),чтобы запустить сервер
