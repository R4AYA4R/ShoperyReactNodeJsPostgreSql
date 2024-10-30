import { useRef, useState } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import AuthService from "../service/AuthService";
import { useActions } from "../hooks/useActions";

const UserFormComponent = () => {

    const sectionUserFormInner = useRef(null);

    const onScreen = useIsOnScreen(sectionUserFormInner);

    const [passwordActiveLogin, setPasswordActiveLogin] = useState(false);

    const [passwordActiveRegister, setPasswordActiveRegister] = useState(false);

    const [passwordActiveConfirm, setPasswordActiveConfirm] = useState(false);

    const [tab, setTab] = useState('Login');

    const [checkActive, setCheckActive] = useState(false);


    const [inputEmailSignIn, setInputEmailSignIn] = useState('');

    const [signInError, setSignInError] = useState('');

    const [signUpError, setSignUpError] = useState('');


    const [inputPassSignUp, setInputPassSignUp] = useState('');

    const [inputConfirmPassSignUp, setInputConfirmPassSignUp] = useState('');

    const [inputEmailSignUp, setInputEmailSignUp] = useState('');

    const [inputNameSignUp, setInputNameSignUp] = useState('');


    const {registrationForUser} = useActions(); // берем action registrationForUser и другие для изменения состояния пользователя у слайса(редьюсера) userSlice у нашего хука useActions уже обернутый в диспатч,так как мы оборачивали это в самом хуке useActions


    // функция для регистрации
    const registration = async (email:string,password:string)=>{
        // оборачиваем в try catch,чтобы отлавливать ошибки
        try{

            let name = inputNameSignUp; // помещаем в переменную name(указываем ей именно let,чтобы можно было изменять) значение инпута имени

            name = name.trim().replace(name[0],name[0].toUpperCase()); // убираем пробелы из переменной имени и заменяем первую букву этой строки инпута имени(name[0] в данном случае) на первую букву этой строки инпута имени только в верхнем регистре(name[0].toUpperCase()),чтобы имя начиналось с большой буквы,даже если написали с маленькой

            const response = await AuthService.registration(email,password,name); // вызываем нашу функцию registration() у AuthService,передаем туда email,password и name(имя пользователя,его поместили в переменную name выше в коде),если запрос прошел успешно,то в ответе от сервера будут находиться токены, поле user с объектом пользователя(с полями isActivated,email,id,userName,role),их и помещаем в переменную response

            console.log(response);

            registrationForUser(response.data); // вызываем нашу функцию(action) для изменения состояния пользователя и передаем туда response.data(в данном случае это объект с полями accessToken,refreshToken и user,которые пришли от сервера)
            

        }catch(e:any){

            console.log(e.response?.data?.message); // если была ошибка,то выводим ее в логи,берем ее из ответа от сервера из поля message из поля data у response у e 

            setSignUpError(e.response?.data?.message + '. Fill in all fields correctly'); // помещаем в состояние ошибки формы регистрации текст ошибки,которая пришла от сервера(в данном случае еще и допольнительный текст)

        }

    }


    // функция для кнопки входа в аккаунт
    const signInBtn = () => {

        // если инпут почты includes('.') false(то есть инпут почты не включает в себя .(точку)) или значение инпута почты по количеству символов меньше 5,то показываем ошибку
        if (!inputEmailSignIn.includes('.') || inputEmailSignIn.valueOf().length < 5) {

            setSignInError('Enter email correctly'); // показываем ошибку 

        } else {

            setSignInError(''); // указываем значение состоянию ошибки пустую строку,то есть ошибки нет

            // здесь вызываем нашу функцию логина

        }

    }

    const signUpBtn = () => {

        // если checkActive false,то есть чекбокс с политикой конфиденциальности не прожат
        if (!checkActive) {

            setSignUpError('You must agree with privacy policy'); // показываем ошибку

        } else if (inputPassSignUp !== inputConfirmPassSignUp) {
            // если состояние инпута пароля не равно состоянию инпута подтверждения пароля,то показываем ошибку,что пароли не совпадают

            setSignUpError('Passwords don`t match'); // показываем ошибку

        } else if (inputEmailSignUp.trim() === '' || inputNameSignUp.trim() === '' || inputPassSignUp.trim() === '') {
            // если состояние инпута почты,отфильтрованое без пробелов(с помощью trim(),то есть из этой строки убираются пробелы) равно пустой строке или инпут пароля равен пустой строке,или инпут имени равен пустой строке,то показываем ошибку

            setSignUpError('Fill in all fields'); // показываем ошибку

        } else if (inputPassSignUp.valueOf().length < 3 || inputPassSignUp.valueOf().length > 32) {
            // если значение инпута пароля по длине символов меньше 3 или больше 32,то показываем ошибку

            setSignUpError('Password must be 3 - 32 characters'); // показываем ошибку

        } else if (!inputEmailSignUp.includes('.') || inputEmailSignUp.valueOf().length < 5) {
            // если инпут почты includes('.') false(то есть инпут почты не включает в себя точку) или значение инпута почты по количеству символов меньше 5,то показываем ошибку

            setSignUpError('Enter email correctly'); // показываем ошибку

        }  else if (inputNameSignUp.valueOf().length < 3) {
            // если инпут имени по количеству символов меньше 3

            setSignUpError('Name must be more than 2 characters'); // показываем ошибку

        } else {

            setSignUpError(''); // указываем значение состоянию ошибки пустую строку,то есть ошибки нет

            registration(inputEmailSignUp,inputPassSignUp); // вызываем нашу функцию регистрации и передаем туда состояния инпутов почты и пароля


        }

    }

    return (
        <section className="sectionUserForm">
            <div className="container">
                <div className={onScreen.sectionUserFormInnerIntersecting ? "sectionUserForm__inner sectionUserForm__inner--active" : "sectionUserForm__inner"} id="sectionUserFormInner" ref={sectionUserFormInner}>

                    {tab === 'Login' &&
                        <div className="sectionUserForm__login">
                            <h2 className="sectionUserForm__login-title">Sign In</h2>
                            <input type="text" className="sectionUserForm__login-input" placeholder="Email" value={inputEmailSignIn} onChange={(e) => setInputEmailSignIn(e.target.value)} />
                            <div className="sectionUserForm__login-passwordBlock">
                                <input type={passwordActiveLogin ? "password" : "text"} className="sectionUserForm__login-input sectionUserForm__login-inputPassword" placeholder="Password" />
                                <img src="/images/sectionUserForm/eye-open 1.png" alt="" className="login__passwordBlock-img" onClick={() => setPasswordActiveLogin((prev) => !prev)} />
                            </div>

                            {/* если signInError не равно пустой строке,то есть в signInError что-то есть(какое-то значение),то показываем ошибку */}
                            {signInError !== '' && <p className="formErrorText">{signInError}</p>}

                            <button className="sectionUserForm__login-btn" onClick={signInBtn}>Login</button>
                            <div className="sectionUserForm__login-textBlock">
                                <p className="login__textBlock-text">Don’t have account?</p>
                                <p className="login__textBlock-linkText" onClick={() => setTab('Register')}>Register</p>
                            </div>
                        </div>
                    }


                    {tab === 'Register' &&
                        <div className="sectionUserForm__login">
                            <h2 className="sectionUserForm__login-title">Create Account</h2>
                            <input type="text" className="sectionUserForm__login-input" placeholder="Name" value={inputNameSignUp} onChange={(e)=>setInputNameSignUp(e.target.value)}/>
                            <input type="text" className="sectionUserForm__login-input" placeholder="Email" value={inputEmailSignUp} onChange={(e)=>setInputEmailSignUp(e.target.value)}/>
                            <div className="sectionUserForm__login-passwordBlock">
                                <input type={passwordActiveRegister ? "password" : "text"} className="sectionUserForm__login-input sectionUserForm__login-inputPassword" placeholder="Password" value={inputPassSignUp} onChange={(e) => setInputPassSignUp(e.target.value)} />
                                <img src="/images/sectionUserForm/eye-open 1.png" alt="" className="login__passwordBlock-img" onClick={() => setPasswordActiveRegister((prev) => !prev)} />
                            </div>
                            <div className="sectionUserForm__login-passwordBlock">
                                <input type={passwordActiveConfirm ? "password" : "text"} className="sectionUserForm__login-input sectionUserForm__login-inputPassword" placeholder="Confirm Password" value={inputConfirmPassSignUp} onChange={(e) => setInputConfirmPassSignUp(e.target.value)} />
                                <img src="/images/sectionUserForm/eye-open 1.png" alt="" className="login__passwordBlock-img" onClick={() => setPasswordActiveConfirm((prev) => !prev)} />
                            </div>
                            <div className="sectionUserForm__login-checkBlock">
                                <label className="categories__item" >
                                    <input type="checkbox" className="categories__item-radio" onClick={() => setCheckActive((prev) => !prev)} />
                                    <span className={checkActive ? "categories__item-checkBoxStyle categories__item-checkBoxStyleActive" : "categories__item-checkBoxStyle"}></span>
                                    <p className="categories__item-text categories__item-textLogin">Accept all Terms & Conditions</p>
                                </label>
                            </div>

                            {/* если signInError не равно пустой строке,то есть в signInError что-то есть(какое-то значение),то показываем ошибку */}
                            {signUpError !== '' && <p className="formErrorText">{signUpError}</p>}

                            <button className="sectionUserForm__login-btn" onClick={signUpBtn}>Create Account</button>
                            <div className="sectionUserForm__login-textBlock">
                                <p className="login__textBlock-text">Already have account?</p>
                                <p className="login__textBlock-linkText" onClick={() => setTab('Login')}>Login</p>
                            </div>
                        </div>
                    }


                </div>
            </div>
        </section >
    )
}

export default UserFormComponent;