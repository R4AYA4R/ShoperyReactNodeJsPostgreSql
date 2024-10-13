// чтобы удалить установленную зависимость(установленный модуль через npm),нужно прописать в терминале npm uninstall и название установленного модуля(например,npm uninstall nodemon)

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import Catalog from "./pages/Catalog";
import AboutUs from "./pages/AboutUs";
import Cart from "./pages/Cart";
import UserPage from "./pages/UserPage";
import ProductItemPage from "./pages/ProductItemPage";
import ScrollToTop from "./utils/ScrollToTop";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop/>
        <div className="wrapper">
          <Header/>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/catalog" element={<Catalog/>}/>
            <Route path="/aboutUs" element={<AboutUs/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/user" element={<UserPage/>}/>
            <Route path="/catalog/:id" element={<ProductItemPage/>}/>{/* указываем после /catalog/ :id,для динамического id,чтобы потом открывалась отдельная страница товара по конкретному id  */}

            <Route path="/*" element={<Navigate to='/' />}/> {/* если пользователь введет в url несуществующую страницу,то его перекинет на главную */}
          </Routes>
          <Footer/>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
