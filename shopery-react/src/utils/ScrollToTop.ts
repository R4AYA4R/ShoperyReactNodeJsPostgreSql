import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// функция,чтобы при переходе на другую страницу при открытии экран и скролл находился вверху страницы
const ScrollToTop = ()=>{
    const {pathname} = useLocation(); // достаем pathname(url страницы) из useLocation

    // перемещаем скрол в верх экрана,когда меняется переменная pathname(то есть когда переходим на другую страницу)
    useEffect(()=>{
        window.scrollTo(0,0);
    },[pathname])

    return null; // возвращаем null,чтобы можно было использовать эту функцию как react компонент типа <ScrollToTop/> и указывать потом так в коде
}

export default ScrollToTop;