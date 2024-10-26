import { useRef, useState } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

const UserFormComponent = () => {

    const sectionUserFormInner = useRef(null);

    const onScreen = useIsOnScreen(sectionUserFormInner);

    const [passwordActiveLogin, setPasswordActiveLogin] = useState(false);

    const [passwordActiveRegister, setPasswordActiveRegister] = useState(false);

    const [passwordActiveConfirm, setPasswordActiveConfirm] = useState(false);

    const [tab, setTab] = useState('Login');

    const [checkActive,setCheckActive] = useState(false);

    return (
        <section className="sectionUserForm">
            <div className="container">
                <div className={onScreen.sectionUserFormInnerIntersecting ? "sectionUserForm__inner sectionUserForm__inner--active" : "sectionUserForm__inner"} id="sectionUserFormInner" ref={sectionUserFormInner}>

                    {tab === 'Login' &&
                        <div className="sectionUserForm__login">
                            <h2 className="sectionUserForm__login-title">Sign In</h2>
                            <input type="text" className="sectionUserForm__login-input" placeholder="Email" />
                            <div className="sectionUserForm__login-passwordBlock">
                                <input type={passwordActiveLogin ? "password" : "text"} className="sectionUserForm__login-input sectionUserForm__login-inputPassword" placeholder="Password" />
                                <img src="/images/sectionUserForm/eye-open 1.png" alt="" className="login__passwordBlock-img" onClick={() => setPasswordActiveLogin((prev) => !prev)} />
                            </div>
                            <button className="sectionUserForm__login-btn">Login</button>
                            <div className="sectionUserForm__login-textBlock">
                                <p className="login__textBlock-text">Don’t have account?</p>
                                <p className="login__textBlock-linkText" onClick={() => setTab('Register')}>Register</p>
                            </div>
                        </div>
                    }


                    {tab === 'Register' &&
                        <div className="sectionUserForm__login">
                            <h2 className="sectionUserForm__login-title">Create Account</h2>
                            <input type="text" className="sectionUserForm__login-input" placeholder="Name" />
                            <input type="text" className="sectionUserForm__login-input" placeholder="Email" />
                            <div className="sectionUserForm__login-passwordBlock">
                                <input type={passwordActiveRegister ? "password" : "text"} className="sectionUserForm__login-input sectionUserForm__login-inputPassword" placeholder="Password" />
                                <img src="/images/sectionUserForm/eye-open 1.png" alt="" className="login__passwordBlock-img" onClick={() => setPasswordActiveRegister((prev) => !prev)} />
                            </div>
                            <div className="sectionUserForm__login-passwordBlock">
                                <input type={passwordActiveConfirm ? "password" : "text"} className="sectionUserForm__login-input sectionUserForm__login-inputPassword" placeholder="Confirm Password" />
                                <img src="/images/sectionUserForm/eye-open 1.png" alt="" className="login__passwordBlock-img" onClick={() => setPasswordActiveConfirm((prev) => !prev)} />
                            </div>
                            <div className="sectionUserForm__login-checkBlock">
                                <label className="categories__item" >
                                    <input type="checkbox" className="categories__item-radio"  onClick={()=>setCheckActive((prev)=>!prev)}/>
                                    <span className={checkActive ? "categories__item-checkBoxStyle categories__item-checkBoxStyleActive" : "categories__item-checkBoxStyle"}></span>
                                    <p className="categories__item-text categories__item-textLogin">Accept all Terms & Conditions</p>
                                </label>
                            </div>
                            <button className="sectionUserForm__login-btn">Create Account</button>
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