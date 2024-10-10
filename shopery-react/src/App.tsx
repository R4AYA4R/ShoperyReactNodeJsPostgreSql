// чтобы удалить установленную зависимость(установленный модуль через npm),нужно прописать в терминале npm uninstall и название установленного модуля(например,npm uninstall nodemon)

function App() {
  return (
    <div className="App">
      
      <header className="header">
        <div className="container">
          <div className="header__inner">
            <a href="#" className="logo">
              <img src="/images/header/plant 1.png" alt="" className="logo__img" />
              <h2 className="logo__text">Shopery</h2>
            </a>
            <ul className="header__menuList">
              <li className="header__menuList-item">
                <a href="#" className="menuList__item-link">Home</a>
              </li>
              <li className="header__menuList-item">
                <a href="#" className="menuList__item-link">Catalog</a>
              </li>
              <li className="header__menuList-item">
                <a href="#" className="menuList__item-link">About Us</a>
              </li>
              <li className="header__menuList-item menuList__item-cartAndUser">
                <a href="#" className="menuList__item-link menuList__item-linkCart">
                  <img src="/images/header/Rectangle.png" alt="" className="menuList__item-cartImg" />
                  <span className="menuList__item-spanCart">0</span>
                </a>

                <a href="#" className="menuList__item-link">
                  <img src="/images/header/user_3 1.png" alt="" className="menuList__item-userImg" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>

    </div>
  );
}

export default App;
