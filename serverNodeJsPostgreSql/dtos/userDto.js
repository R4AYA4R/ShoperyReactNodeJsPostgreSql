
// экспортируем класс UserDto
export default class UserDto{

    // указываем,какие поля есть у этого класса
    email;
    id;
    userName;
    role;

    // описываем конструктор,который принимает в параметре model
    constructor(model){

        this.email = model.email; // изменяем переменную email этого класса на поле email у model 

        this.id = model.id; // изменяем переменную id этого класса на model.id

        this.userName = model.userName;

        this.roleId = model.roleId; // изменяем переменную roleId этого класса на поле roleId у model(в этом поле будет значение id поля со значением роли пользователя в базе данных)

    }

}