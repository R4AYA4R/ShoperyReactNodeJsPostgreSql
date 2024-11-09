
import { DataTypes, STRING } from "sequelize"; // импортируем DataTypes у sequelize,чтобы описывать типы полей для таблиц в базе данных postgreSql

import db from "../db.js"; // указываем здесь расширение файла .js,иначе не находит файл и выдает ошибку

// если уже описали и создали таблицу в базе данных postgreSql,но потом захотели удалить у этой таблицы поле,то нужно удалить всю таблицу в pgAdmin и заново создать и отправить запрос на создания таблицы и объекта в базе данных postgreSql

// при создании таблиц нужно сразу описать таблицу и сразу же описать связи этих таблиц,не сохраняя еще файл,чтобы не мог пойти запрос в базу данных для содания таблицы до того,как мы описали связи таблиц,так как если описать таблицу и сохранить файл,а потом только дописать связи таблиц,то будет ошибка при попытке их связать и нужно будет удалять таблицы из базы данных вручную(выбирать при удалении Delete CASCADE,а не просто Delete,иначен не удаляется) в pgAdmin ) и потом опять они создадутся,но уже с правильными связями

// создаем сущность товара(таблицу товара в базе данных postgreSql),первым параметром у define указываем название таблицы,вторым - объект в котором описываем поля,которые будут у этой сущности(таблицы), и здесь должно быть отдельное поле для ссылки на category(категорию) и taste(вкус),то есть какие объекты из таблицы category и taste принадлежат таблице товара(Product),но мы его сейчас не указываем,оно будет подставлено автоматически с помощью sequelize,когда мы будем указывать связи этих всех таблиц
const Product = db.define('product',{

    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true}, // описываем поле id,указываем тип INTEGER у DataTypes, указываем,что это первичный ключ(primaryKey:true, то есть это поле уникально и обязательно,и что оно однозначно идентифицирует каждую запись(каждый типа объект таблицы) в таблице), и что это authIncrement,чтобы с новой записью это поле автоматически увеличивалось на 1

    name:{type:DataTypes.STRING, unique:true, allowNull:false}, // указываем, что это поле уникально(unique:true),то есть другого такого же не может быть в этой таблице, и указываем этому полю еще свойство allowNull:false,то есть оно не может быть null(пустым)

    price:{type:DataTypes.FLOAT, allowNull:false}, // указываем полю для цены тип DataTypes.FLOAT( float - тип данных числа с запятой(точкой),типа 0.5)

    priceFilter:{type:DataTypes.STRING, allowNull:false},

    amount:{type:DataTypes.INTEGER, allowNull:false, defaultValue:1}, // указываем этому полю значение по умолчанию 1 (defaultValue:1)

    totalPrice:{type:DataTypes.FLOAT, allowNull:false},

    rating:{type:DataTypes.FLOAT, allowNull:false, defaultValue:0}, // указываем полю для рейтинга тип DataTypes.FLOAT( float - тип данных числа с запятой(точкой),типа 0.5)

    image:{type:DataTypes.STRING, allowNull:false}, // указываем этому полю для изображения тип STRING,так как там будем хранить только название файла и его расширение, указываем этому полю еще свойство allowNull:false,то есть оно не может быть null(пустым)

})

// создаем сущность(таблицу) для категории,чтобы потом связать эту таблицу с таблицей Product(товара)
const Category = db.define('category',{

    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true}, // описываем поле id,указываем тип INTEGER у DataTypes, указываем,что это первичный ключ(primaryKey:true, то есть это поле уникально и обязательно,и что оно однозначно идентифицирует каждую запись(каждый типа объект таблицы) в таблице), и что это authIncrement,чтобы с новой записью это поле автоматически увеличивалось на 1

    category: {type:DataTypes.STRING, allowNull:false}

})

// создаем сущность(таблицу) для типа вкуса(сладкий,горький и тд)
const Taste = db.define('taste',{

    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true}, // описываем поле id,указываем тип INTEGER у DataTypes, указываем,что это первичный ключ(primaryKey:true, то есть это поле уникально и обязательно,и что оно однозначно идентифицирует каждую запись(каждый типа объект таблицы) в таблице), и что это authIncrement,чтобы с новой записью это поле автоматически увеличивалось на 1

    taste: {type:DataTypes.STRING, allowNull:false}

})


// создаем сущность (таблицу) для объекта пользователя для регистрации и авторизации
const User = db.define('user',{

    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},

    email: {type:DataTypes.STRING,unique:true,allowNull:false},

    password: {type:DataTypes.STRING,allowNull:false},

    userName: {type:DataTypes.STRING,allowNull:false}

})


// создаем сущность (таблицу) для объекта роли пользователя
const Role = db.define('role',{

    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},

    value:{type:DataTypes.STRING, allowNull:false, defaultValue:"USER",unique:true}


})


// создаем сущность(таблицу) для refresh токена,эта таблица будет иметь ссылку на объект из таблицы User,это мы укажем ниже где связи таблиц
const Token = db.define('token',{

    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},

    refreshToken:{type:DataTypes.STRING,allowNull:false}

})

const Comment = db.define('comments',{

    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    
    name:{type:DataTypes.STRING, allowNull:false},

    text:{type:DataTypes.STRING,allowNull:false},

    rating:{type:DataTypes.FLOAT, allowNull:false},

    createdTime:{type:DataTypes.STRING, allowNull:false }

})

const BasketProduct = db.define('basketProducts',{

    id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},

    usualProductId:{type:DataTypes.INTEGER, allowNull:false}, // указываем это поля для объекта товара корзины,чтобы в это поле потом указывать значение id обычного товара из каталога,чтобы потом можно было перейти на страницу этого обычного товара из корзины

    name:{type:DataTypes.STRING, unique:true, allowNull:false}, // указываем, что это поле уникально(unique:true),то есть другого такого же не может быть в этой таблице, и указываем этому полю еще свойство allowNull:false,то есть оно не может быть null(пустым)

    price:{type:DataTypes.FLOAT, allowNull:false}, // указываем полю для цены тип DataTypes.FLOAT( float - тип данных числа с запятой(точкой),типа 0.5)

    priceFilter:{type:DataTypes.STRING, allowNull:false},

    amount:{type:DataTypes.INTEGER, allowNull:false, defaultValue:1}, // указываем этому полю значение по умолчанию 1 (defaultValue:1)

    totalPrice:{type:DataTypes.FLOAT, allowNull:false},

    rating:{type:DataTypes.FLOAT, allowNull:false, defaultValue:0}, // указываем полю для рейтинга тип DataTypes.FLOAT( float - тип данных числа с запятой(точкой),типа 0.5)

    image:{type:DataTypes.STRING, allowNull:false},

})



// описываем связи между таблицами, hasMany(связь 1 ко многим,типа один объект этой таблицы может иметь связь с многими объектами другой таблицы), hasOne - связь 1 к 1(один объект этой таблицы может иметь одну связь(то есть будет отдельное поле у объекта одной таблицы, в котором будет указан id объекта другой таблицы,который принадлежит этой таблице) с объектом другой таблицы)

// при создании таблиц нужно сразу описать таблицу и сразу же описать связи этих таблиц,не сохраняя еще файл,чтобы не мог пойти запрос в базу данных для содания таблицы до того,как мы описали связи таблиц,так как если описать таблицу и сохранить файл,а потом только дописать связи таблиц,то будет ошибка при попытке их связать и нужно будет удалять таблицы из базы данных вручную и потом опять они создадутся,но уже с правильными связями

// в данном случае потом при создании объекта товара в таблице Product нужно будет указать поле categoryId со значением id объекта из таблицы Category с нужной категорией и для Taste тоже самое,там будет tasteId,этот categoryId и tasteId появляется автоматически,когда указываем связи таблиц типа hasMany и тд, обычно указывать связи таблиц нужно парами,типа hasOne и belongsTo, hasMany и belongsTo,belongsToMany и belongsToMany(эта связь многие ко многим делается через дополнительную связующую таблицу,где будут описаны поля с id объектов из этих 2 таблиц для их связи) ,чтобы лучше согласовывались данные в sequelize

// для создания отношений один-к-одному используются hasOne() и belongsTo(), для один-ко-многим — hasMany() и belongsTo(), для многие-ко-многим — два belongsToMany()

Category.hasMany(Product); // указываем,что одна запись(объект сущности(таблицы)) Category может иметь много связей с сущностью Product(с многими объектами из сущности Product),то есть у объекта из таблицы Product будет поле с ссылкой на объект из таблицы Category(в данном случае у объекта из таблицы Product будет поле categoryId,где будет значение id объекта из таблицы Category,с которым связан этот объект из Product),это касается связываний типа hasOne,hasMany
Product.belongsTo(Category); // указываем,что сущность Product принадлежит сущности Category, то есть каждый объект из таблицы Product имеет поле с id объекта из таблицы Category(то есть категорию товара), когда указываем belongsTo,то в данном случае,у объектов таблицы Product будут автоматически созданы поля categoryId для категорий,и потом будем фильтровать объекты товаров по полю categoryId со значением определенного id категории(со значением id объекта из таблицы Category,так мы будем знать,что это за категория), то есть у объекта из таблицы Product будет поле с ссылкой на объект из таблицы Category(в данном случае у объекта из таблицы Product будет поле categoryId,где будет значение id объекта из таблицы Category,с которым связан этот объект из Product),это касается связываний типа belongsTo, но при связи belongsToMany нужно указать еще объект опций с полем through(в нем указать название еще одной таблицы(ее нужно создать),которая будет связывать 2 таблицы автоматически,в этой связной таблице будут поля с id первой и второй таблицы для связи этих таблиц)

Taste.hasMany(Product); // указываем,что один объект из таблицы Taste может иметь много полей с id разных объектов из таблицы Product(то есть один тип вкуса может иметь связь с разными объектами товаров), но поле с ссылкой на объект из таблицы Taste будет создано у объекта из таблицы Prdouct
Product.belongsTo(Taste); // указываем, что каждый объект из таблицы Product имеет поле с id объекта из таблицы Taste(то есть каждый объект товара имеет поле с типом вкуса)


Role.hasMany(User); // указываем,что объект из таблицы Role может иметь много связей с объектами из таблицы User,но поле с ссылкой на объект из таблицы Role будет создано у объекта из таблицы User(в данном случае у объекта из таблицы User будет поле roleId,где будет указано значение id объекта из таблицы Role,с которым этот объект из таблицы User связан)
User.belongsTo(Role); // указываем,что у объекта из таблицы User будет поле с ссылкой на объект из таблицы Role(в данном случае у объекта из таблицы User будет поле roleId,где будет значение id объекта из таблицы Role,с которым связан этот объект из User),это касается связываний типа belongsTo


User.hasOne(Token); // указываем,что объект из таблицы User будет иметь одну связть с объектом из таблицы Token,но поле с ссылкой на объект из таблицы User будет создано у объекта из таблицы Token(то есть в данном случае у объекта из таблицы Token будет поле userId,где будет указано значение id объекта из таблицы User,с которым этот объект из таблицы Token связан), это касается связываний типа hasOne,hasMany
Token.belongsTo(User); // указываем,что у объекта из таблицы Token будет поле с ссылкой на объект из таблицы User(в данном случае у объекта из таблицы Token будет поле userId,где будет значение id объекта из таблицы User,с которым связан этот объект из Token),это касается связываний типа belongsTo


Product.hasMany(Comment); // указываем,что объект из таблицы Product будет иметь много связей с объектами из таблицы Comment,но поле с ссылкой на объект из таблицы Product будет создано у объекта из таблицы Comment(то есть в данном случае у объекта из таблицы Comment будет поле productId,где будет указано значение id объекта из таблицы Product,с которым этот объект из таблицы Comment связан), это касается связываний типа hasOne,hasMany

Comment.belongsTo(Product); // указываем,что у объекта из таблицы Comment будет поле с ссылкой на объект из таблицы Product(в данном случае у объекта из таблицы Comment будет поле productId,где будет значение id объекта из таблицы Product,с которым связан этот объект из Comment),это касается связываний типа belongsTo


User.hasMany(BasketProduct); // указываем,что объект из таблицы User будет иметь много связей с объектами из таблицы BasketProduct,но поле с ссылкой на объект из таблицы User будет создано у объекта из таблицы BasketProduct(то есть в данном случае у объекта из таблицы BasketProduct будет поле userId,где будет указано значение id объекта из таблицы User,с которым этот объект из таблицы BasketProduct связан), это касается связываний типа hasOne,hasMany

BasketProduct.belongsTo(User); // указываем,что у объекта из таблицы BasketProduct будет поле с ссылкой на объект из таблицы User(в данном случае у объекта из таблицы BasketProduct будет поле userId,где будет значение id объекта из таблицы User,с которым связан этот объект из BasketProduct),это касается связываний типа belongsTo

Category.hasMany(BasketProduct); // указываем,что одна запись(объект сущности(таблицы)) Category может иметь много связей с сущностью BasketProduct(с многими объектами из сущности BasketProduct),то есть у объекта из таблицы BasketProduct будет поле с ссылкой на объект из таблицы Category(в данном случае у объекта из таблицы BasketProduct будет поле categoryId,где будет значение id объекта из таблицы Category,с которым связан этот объект из BasketProduct),это касается связываний типа hasOne,hasMany

BasketProduct.belongsTo(Category); // указываем,что у объекта из таблицы BasketProduct будет поле с ссылкой на объект из таблицы Category(в данном случае у объекта из таблицы BasketProduct будет поле categoryId,где будет значение id объекта из таблицы Category,с которым связан этот объект из BasketProduct),это касается связываний типа belongsTo


Taste.hasMany(BasketProduct); // указываем,что одна запись(объект сущности(таблицы)) Taste может иметь много связей с сущностью BasketProduct(с многими объектами из сущности BasketProduct),то есть у объекта из таблицы BasketProduct будет поле с ссылкой на объект из таблицы Taste(в данном случае у объекта из таблицы BasketProduct будет поле tasteId,где будет значение id объекта из таблицы Taste,с которым связан этот объект из BasketProduct),это касается связываний типа hasOne,hasMany

BasketProduct.belongsTo(Taste); // указываем,что у объекта из таблицы BasketProduct будет поле с ссылкой на объект из таблицы Taste(в данном случае у объекта из таблицы BasketProduct будет поле tasteId,где будет значение id объекта из таблицы Taste,с которым связан этот объект из BasketProduct),это касается связываний типа belongsTo


// экспортируем объект с полями всех таблиц,которые мы создали
export default {
    Product,
    Category,
    Taste,
    User,
    Role,
    Token,
    Comment,
    BasketProduct
}