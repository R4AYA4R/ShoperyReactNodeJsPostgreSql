
export interface IProduct{
    id:number,
    name:string,
    categoryId:number, // это поле для категории,просто в нашей базе данных мы сделали так,чтобы category и taste можны было определять по id
    tasteId:number,
    price:number,
    priceFilter:string,
    amount:number,
    totalPrice:number,
    rating:number
    image:string,
}

// создаем тип для data (данных),которые приходят от сервера для пагинации(при пагинации от сервера приходит объект data с полями count(количество объектов товаров всего,которые пришли от сервера) и rows(сами объекты товаров,но на конкретной странице))
export interface IProductData{
    count:number,
    rows:IProduct[] // указываем полю rows тип на основе нашего интерфейса IProduct,указываем,что это массив
}

// создаем тип для нашего состояния в reduxToolkit для общего количества страниц
export interface IInitialPagesState{
    totalPages:number
}

// создаем тип для нашего состояния в reduxToolkit для action payload(данных,которые будем передавать в action(функцию) для изменения состояния totalPages в redux toolkit)
export interface IPayloadPages{
    totalCount:number,
    limit:number
}