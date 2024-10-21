
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
    image:string
}