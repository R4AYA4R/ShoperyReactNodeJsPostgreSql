import UserDto from "../dtos/userDto.js";
import ApiError from "../exceptions/ApiError.js";
import models from "../models/models.js";

import bcrypt from 'bcrypt'; // импортируем bcrypt для хеширования пароля(в данном случае импортируем вручную)
import tokenService from "./tokenService.js";

// создаем класс UserService для сервиса пользователей(их удаление,добавление и тд)
class UserService{

    // функция регистрации,принимает в параметрах email,userName, и password(которые мы будем получить в теле запроса)
    async registration(email,userName,password){

        const candidate = await models.User.findOne({where:{email}}); // ищем один объект в таблице User в базе данных с помощью функции findOne(),передаем условие,что нужно найти объект с полем email как параметр запроса email, и помещаем результат функции findOne(то есть найденный объект с таким же значением в поле email,если он был найден) в переменную candidate

        // если candidate true,то есть такой пользователь с таким email уже есть в базе данных
        if(candidate){
            throw ApiError.BadRequest(`Пользователь с адресом ${email} уже существует`); // вместо throw new Error указываем throw ApiError(наш класс для обработки ошибок),указываем у него функцию BadRequest,то есть показываем ошибку с сообщением
        }

        const hashPassword = await bcrypt.hash(password,3); // хешируем пароль с помощью функции hash() у bcrypt,первым параметром передаем пароль,а вторым - соль,степень хеширования(чем больше - тем лучше захешируется,но не нужно слишком большое число,иначе будет долго хешироваться пароль)

        const userRole = await models.Role.findOne({where:{value:"USER"}}); // получаем роль из базы данных со значением USER и помещаем ее в переменную userRole,изменяем значение value на ADMIN,чтобы зарегестрировать роль администратора,потом обратно возвращаем на USER

        const user = await models.User.create({email,password:hashPassword,userName,roleId:userRole.id});  // создаем объект с полями email и password в базу данных и помещаем этот объект в переменную user,в поле password помещаем значение из переменной hashPassword,то есть уже захешированный пароль,и указываем в объекте еще поле userName,в поле roleId передаем значение значение роли,которое мы получили из базы данных выше(то есть передаем в поле roleId id объекта из таблицы Role,у которого поле value равно "USER"(мы поместили этот найденный объект в переменную userRole),то есть таким образом указываем пользователю роль "USER")

        const userDto = new UserDto(user); // помещаем в переменную userDto объект,созданный на основе нашего класса UserDto и передаем в параметре конструктора модель(в данном случае объект user,который мы создали в базе данных,в коде выше),в итоге переменная userDto(объект) будет обладать полями id,email,userName,role и которую можем передать как payload(данные,которые будут помещены в токен) в токене

        const tokens = tokenService.generateTokens({...userDto}); // помещаем в переменную tokens пару токенов,refresh и access токены,которые создались в нашей функции generateTokens(),передаем в параметре payload(данные,которые будут спрятаны в токен),в данном случае передаем в параметре объект,куда разворачиваем все поля объекта userDto


        await tokenService.saveToken(userDto.id,tokens.refreshToken); // сохраняем refresh токен в базу данных,используя нашу функцию saveToken,передаем в параметрах userDto.id(id пользователя,который создали в базе данных) и refreshToken,который мы сгенерировали выше и поместили в объект tokens


        // возвращаем все поля объекта tokens(то есть access и refresh токены),и в поле user указываем значение userDto
        return {
            ...tokens,
            user:userDto
        }

    }

}

export default new UserService(); // экспортируем уже объект на основе нашего класса UserService