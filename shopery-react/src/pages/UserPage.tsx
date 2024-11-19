import axios from "axios";
import SectionUserTop from "../components/SectionUserTop";
import UserFormComponent from "../components/UserFormComponent";
import { useActions } from "../hooks/useActions";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { AuthResponse, IProduct, IUpdateAccInfoObj, IUser } from "../types/types";
import $api, { API_URL } from "../http/http";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import AuthService from "../service/AuthService";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { useMutation, useQuery } from "@tanstack/react-query";

const UserPage = () => {

    const [inputNameAccSettings, setInputNameAccSettings] = useState('');

    const [inputEmailAccSettings, setInputEmailAccSettings] = useState('');

    const [errorAccSettings, setErrorAccSettings] = useState('');


    const [passwordActiveCurrent, setPasswordActiveCurrent] = useState(true);

    const [passwordActiveNew, setPasswordActiveNew] = useState(false);

    const [passwordActiveConfirm, setPasswordActiveConfirm] = useState(false);

    const [inputPassCurrent, setInputPassCurrent] = useState('');

    const [inputPassNew, setInputPassNew] = useState('');

    const [inputPassConfirm, setInputPassConfirm] = useState('');

    const [errorPasswordSettings, setErrorPasswordSettings] = useState('');


    const [inputNameProduct, setInputNameProduct] = useState('');

    const [selectCategoryValue, setSelectCategoryValue] = useState<number>(); // указываем состояние для значение селекта категорий и указываем начальное значение 0,так как будем изменять потом эти значение на 1,2 и тд,так как будем потом создавать новый товар в базе данных и указывать у него categoryId со значением,как у этого состояния

    const [selectCategoryActive, setSelectCategoryActive] = useState(false);


    const [selectTasteActive, setSelectTasteActive] = useState(false);

    const [selectTasteValue, setSelectTasteValue] = useState<number>();


    const [inputPriceValue, setInputPriceValue] = useState(1);

    const [inputFile, setInputFile] = useState<File>();  // состояние для файла картинки продукта,которые пользователь выберет в инпуте для файлов,указываем тут тип any,чтобы не было ошибки,в данном случае указываем тип как File

    const [imgPath, setImgPath] = useState(''); // состояние для пути картинки,который мы получим от сервера,когда туда загрузим картинку(чтобы отобразить выбранную пользователем картинку уже полученную от сервера, когда туда ее загрузим)

    const newProductImage = useRef<HTMLImageElement>(null); // используем useRef для подключения к html тегу картинки нового товара,чтобы взять у него ширину и проверить ее,в generic типе этого useRef указываем,что в этом useRef будет HTMLImageElement(то есть картинка)

    const [errNewProductForm, setErrNewProductForm] = useState('');


    const [tab, setTab] = useState('dashboard');

    const { isAuth, user, isLoading } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth,используя наш типизированный хук для useSelector

    const { checkAuthUser, setLoadingUser, logoutUser, setUser } = useActions(); // берем actions для изменения состояния пользователя у слайса(редьюсера) userSlice у нашего хука useActions уже обернутые в диспатч,так как мы оборачивали это в самом хуке useActions


    // функция для post запроса на сервер с помощью useMutation(react query),создаем новый товар на сервере,берем mutate у useMutation,чтобы потом вызвать эту функцию запроса на сервер в нужный момент
    const { mutate } = useMutation({
        mutationKey: ['create productCatalog'],
        mutationFn: async (product:IProduct) => {
            // делаем запрос на сервер и добавляем данные на сервер,указываем тип данных,которые нужно добавить на сервер(в данном случае IProduct),но здесь не обязательно указывать тип,используем тут наш инстанс axios ($api),чтобы правильно обрабатывался этот запрос для проверки на access токен с помощью нашего authMiddleware на нашем сервере
            await $api.post<IProduct>(`${API_URL}/addNewProductCatalog`, product);
        },


    })


    // фукнция для запроса на сервер на изменение информации пользователя в базе данных,лучше описать эту функцию в сервисе(отдельном файле для запросов типа AuthService),например, но в данном случае уже описали здесь
    const changeAccInfoInDb = async (userId: number, name: string, email: string) => {

        return $api.put('/changeAccInfo', { userId, name, email }); // возвращаем put запрос на сервер на эндпоинт /changeAccInfo для изменения данных пользователя и передаем вторым параметром объект с полями,используем здесь наш axios с определенными настройками,которые мы задали ему в файле http,чтобы правильно работали запросы на authMiddleware на проверку на access токен на бэкэнде,чтобы когда будет ошибка от бэкэнда от authMiddleware,то будет сразу идти повторный запрос на /refresh на бэкэнде для переобновления access токена и refresh токена и опять будет идти запрос на изменение данных пользователя в базе данных(на /changeAccInfo в данном случае) но уже с переобновленным access токеном,который теперь действителен(это чтобы предотвратить доступ к аккаунту мошенникам,если они украли аккаунт,то есть если access токен будет не действителен уже,то будет запрос на /refresh для переобновления refresh и access токенов, и тогда у мошенников уже будут не действительные токены и они не смогут пользоваться аккаунтом)

    }

    // фукнция для запроса на сервер на изменение пароля пользователя в базе данных
    const changePassInDb = async (userId: number, currentPass: string, newPass: string) => {

        return $api.put('/changeAccPass', { userId, currentPass, newPass }); // возвращаем put запрос на сервер на эндпоинт /changeAccPass для изменения пароля пользователя и передаем вторым параметром объект с полями

    }


    // функция для проверки авторизован ли пользователь(валиден ли его refresh токен)
    const checkAuth = async () => {

        setLoadingUser(true); // изменяем поле isLoading состояния пользователя в userSlice на true(то есть пошла загрузка)

        // оборачиваем в try catch,чтобы отлавливать ошибки
        try {

            // здесь используем уже обычный axios,указываем тип в generic,что в ответе от сервера ожидаем наш тип данных AuthResponse,указываем наш url до нашего роутера(/api) на бэкэнде(API_URL мы импортировали из другого нашего файла) и через / указываем refresh(это тот url,где мы выдаем access и refresh токены на бэкэнде),и вторым параметром указываем объект опций,указываем поле withCredentials true(чтобы автоматически с запросом отправлялись cookies)
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });

            console.log(response);

            checkAuthUser(response.data); // вызываем нашу функцию(action) для изменения состояния пользователя и передаем туда response.data(в данном случае это объект с полями accessToken,refreshToken и user,которые пришли от сервера)

        } catch (e: any) {

            console.log(e.response?.data?.message); // если была ошибка,то выводим ее в логи,берем ее из ответа от сервера  из поля message из поля data у response у e

        } finally {
            // в блоке finally будет выполнен код в независимости от try catch(то есть в любом случае,даже если будет ошибка)
            setLoadingUser(false); // изменяем поле isLoading состояния пользователя в userSlice на false(то есть загрузка закончена)
        }

    }


    // при запуске сайта будет отработан код в этом useEffect
    useEffect(() => {

        // если localStorage.getItem('token') true,то есть по ключу token в localStorage что-то есть
        if (localStorage.getItem('token')) {

            checkAuth(); // вызываем нашу функцию checkAuth(),которую описали выше для проверки авторизован ли пользователь

        }

        console.log(isAuth)
        console.log(user.userName)

    }, [])

    // функция для выхода из аккаунта
    const logout = async () => {

        // оборачиваем в try catch,чтобы отлавливать ошибки 
        try {

            const response = await AuthService.logout(); // вызываем нашу функцию logout() у AuthService

            logoutUser(); // вызываем нашу функцию(action) для изменения состояния пользователя и в данном случае не передаем туда ничего

            setTab('dashboard'); // изменяем состояние таба на dashboard то есть показываем секцию dashboard(в данном случае главный отдел пользователя),чтобы при выходе из аккаунта и входе обратно у пользователя был открыт главный отдел аккаунта,а не настройки или последний отдел,который пользователь открыл до выхода из аккаунта

        } catch (e: any) {

            console.log(e.response?.data?.message); // если была ошибка,то выводим ее в логи,берем ее из ответа от сервера  из поля message из поля data у response у e 

        }

    }


    // функция для формы изменения имени и почты пользователя,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const onSubmitFormSettings = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();  // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если inputEmailAccSettings true(то есть в inputEmailAccSettings есть какое-то значение) или inputNameAccSettings true(то есть в inputNameAccSettings есть какое-то значение), то делаем запрос на сервер для изменения данные пользователя,если же в поля инпутов имени или почты пользователь ничего не ввел,то не будет отправлен запрос 
        if (inputEmailAccSettings || inputNameAccSettings) {

            try {

                let name = inputNameAccSettings.trim(); // помещаем в переменную значение инпута имени и убираем у него пробелы с помощю trim() (указываем ей именно let,чтобы можно было изменять)

                // если name true(то есть в name есть какое-то значение),то изменяем первую букву этой строки инпута имени на первую букву этой строки инпута имени только в верхнем регистре,делаем эту проверку,иначе ошибка,так как пользователь может не ввести значение в инпут имени и тогда будет ошибка при изменении первой буквы инпута имени
                if (name) {
                    name = name.replace(name[0], name[0].toUpperCase()); // заменяем первую букву этой строки инпута имени на первую букву этой строки инпута имени только в верхнем регистре,чтобы имя начиналось с большой буквы,даже если написали с маленькой
                }


                const response = await changeAccInfoInDb(user.id, name, inputEmailAccSettings); // вызываем нашу функцию запроса на сервер для изменения данных пользователя,передаем туда user.id(id пользователя) и инпуты имени и почты

                console.log(response.data);

                setUser(response.data); // изменяем сразу объект пользователя на данные,которые пришли от сервера,чтобы не надо было обновлять страницу для обновления данных


                setErrorAccSettings(''); // изменяем состояние ошибки на пустую строку,то есть убираем ошибку

                setInputEmailAccSettings(''); // изменяем состояние почты на пустую строку,чтобы убирался текст в инпуте после успешного запроса

                setInputNameAccSettings('');

            } catch (e: any) {

                console.log(e.response?.data?.message); // выводим ошибку в логи

                return setErrorAccSettings(e.response?.data?.message); // возвращаем и показываем ошибку,используем тут return чтобы если будет ошибка,чтобы код ниже не работал дальше,то есть на этой строчке завершим функцию,чтобы не очищались поля инпутов,если есть ошибка
            }


        }

        // закомментировали этот вариант,так как сделали по-другому проверки для изменения данных пользователя в форме,в данном случае делаем основные проверки на бэкэнде(в node js),а не тут
        // if (inputNameAccSettings.length < 3 || inputNameAccSettings.length > 20) {

        //     setErrorAccSettings('Name must be 3 - 20 characters');

        // } else if (!inputEmailAccSettings.includes('@') || !inputEmailAccSettings.includes('.') || inputEmailAccSettings.length < 5) {
        //     // если инпут почты includes('@') false(то есть инпут почты не включает в себя символ @ собаки или не включает в себя точку) или значение инпута почты по количеству символов меньше 5,то показываем ошибку
        //     setErrorAccSettings('Enter email correctly');
        // } else {

        //     console.log(inputEmailAccSettings, inputNameAccSettings)

        //     try {

        //         let name = inputNameAccSettings.trim(); // помещаем в переменную значение инпута имени и убираем у него пробелы с помощю trim() (указываем ей именно let,чтобы можно было изменять)

        //         name = name.replace(name[0], name[0].toUpperCase()); // заменяем первую букву этой строки инпута имени на первую букву этой строки инпута имени только в верхнем регистре,чтобы имя начиналось с большой буквы,даже если написали с маленькой


        //         const response = await changeAccInfoInDb(user.id, name, inputEmailAccSettings); // вызываем нашу функцию запроса на сервер для изменения данных пользователя,передаем туда user.id(id пользователя) и инпуты имени и почты

        //         console.log(response.data);

        //         setUser(response.data); // изменяем сразу объект пользователя на данные,которые пришли от сервера,чтобы не надо было обновлять страницу для обновления данных


        //         setErrorAccSettings(''); // изменяем состояние ошибки на пустую строку,то есть убираем ошибку

        //         setInputEmailAccSettings(''); // изменяем состояние почты на пустую строку,чтобы убирался текст в инпуте после успешного запроса

        //         setInputNameAccSettings('');

        //     } catch (e: any) {
        //         console.log(e.response?.data?.message); // выводим ошибку в логи

        //         return setErrorAccSettings(e.response?.data?.message); // возвращаем и показываем ошибку,используем тут return чтобы если будет ошибка,чтобы код ниже не работал дальше,то есть на этой строчке завершим функцию,чтобы не очищались поля инпутов,если есть ошибка
        //     }

        // }

    }


    // функция для формы изменения пароля пользователя,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const onSubmitPassSettingsForm = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если инпут текущего пароля равен пустой строке,то показываем ошибку
        if (inputPassCurrent === '') {
            setErrorPasswordSettings('Enter current password');
        } else if (inputPassNew.length < 3 || inputPassNew.length > 32) {
            // если инпут нового пароля меньше 3 или больше 32,то показываем ошибку
            setErrorPasswordSettings('New password must be 3 - 32 characters');
        } else if (inputPassNew !== inputPassConfirm) {
            // если значение инпута нового пароля не равно значению инпута подтвержденного пароля,то показываем ошибку
            setErrorPasswordSettings('Passwords don`t match');
        } else {

            try {

                const response = await changePassInDb(user.id, inputPassCurrent, inputPassNew); // вызываем нашу функцию запроса на сервер для изменения пароля пользователя,передаем туда user.id(id пользователя) и значения инпутов текущего пароля и нового пароля

                console.log(response.data);


            } catch (e: any) {

                console.log(e.response?.data?.message); // выводим ошибку в логи

                return setErrorPasswordSettings(e.response?.data?.message); // возвращаем и показываем ошибку,используем тут return чтобы если будет ошибка,чтобы код ниже не работал дальше,то есть на этой строчке завершим функцию,чтобы не очищались поля инпутов,если есть ошибка
            }

            setErrorPasswordSettings(''); // изменяем состояние ошибки в форме для изменения пароля пользователя на пустую строку,то есть убираем ошибку 

            // изменяем состояния инпутов на пустые строки
            setInputPassCurrent('');
            setInputPassNew('');
            setInputPassConfirm('');

        }

    }


    const changeInputPriceValue = (e: ChangeEvent<HTMLInputElement>) => {

        setInputPriceValue(+e.target.value); // изменяем состояние инпута цены на текущее значение инпута,указываем + перед e.target.value,чтобы перевести текущее значение инпута из строки в число

    }

    const handlerMinusBtn = () => {
        // если значение инпута количества товара больше 1,то изменяем это значение на - 1,в другом случае указываем ему значение 1,чтобы после нуля не отнимало - 1
        if (inputPriceValue > 1) {
            setInputPriceValue((prev) => prev - 1)
        } else {
            setInputPriceValue(1);
        }
    }

    const handlerPlusBtn = () => {
        // увеличиваем значение инпута на текущее + 1
        setInputPriceValue((prev) => prev + 1)

    }



    // функция для выбора картинки с помощью инпута для файлов
    const inputLoadImageHandler = async (e: ChangeEvent<HTMLInputElement>) => {

        // e.target.files - массив файлов,которые пользователь выбрал при клике на инпут для файлов, если e.target.files true,то есть пользователь выбрал файл
        if (e.target.files) {

            setInputFile(e.target.files[0]); // помещаем в состояние файл,который выбрал пользователь,у files указываем тут [0],то есть берем первый элемент массива(по индексу 0) этих файлов инпута

            const formData = new FormData(); // создаем объект на основе FormData(нужно,чтобы передавать файлы на сервер)

            formData.append('image', e.target.files[0]); // добавляем в этот объект formData по ключу(названию) 'image' сам файл в e.target.files[0] по индексу 0 (первым параметром тут передаем название файла,вторым сам файл)

            console.log(e.target.files[0]);

            // оборачиваем в try catch,чтобы отлавливать ошибки и делаем пока такой запрос на сервер для загрузки файла на сервер,загружаем объект formData(лучше вынести это в отдельную функцию запроса на сервер но и так можно),указываем здесь наш инстанс axios ($api в данном случае),чтобы обрабатывать правильно запросы с access токеном и refresh токеном,в данном случае делаем запрос на бэкэнд для загрузки файла и там сразу будет проверка нашего authMiddleware на нашем node js сервере для проверки на access токен
            try {

                const response = await $api.post(`${API_URL}/uploadFile`, formData); // делаем запрос на сервер для сохранения файла на сервере и как тело запроса тут передаем formData

                console.log(response);

                setImgPath(`http://localhost:5000/${response.data.name}`); // помещаем в состояние imgPath путь до файла,то есть пишем путь до нашего сервера (http://localhost:5000/) в данном случае и добавляем название файла,который нужно показать,который есть в папке (в данном случае static) на нашем сервере,это название пришло от сервера

                setErrNewProductForm(''); // убираем ошибку формы создания нового товара

            } catch (e: any) {

                return setErrNewProductForm(e.response?.data?.message); // возвращаем и показываем ошибку,используем тут return чтобы если будет ошибка,чтобы код ниже не работал дальше,то есть на этой строчке завершим функцию,чтобы не очищались поля инпутов,если есть ошибка

            }

        }

    }


    // функция для удаления файла на сервере,указываем тип fileName как string | undefined,так как иначен показывает ошибку,что нельзя передать параметр этой функции,если значение этого параметра undefined
    const deleteFileRequest = async (fileName: string | undefined) => {

        try {

            const response = await axios.delete(`${API_URL}/deleteFile/${fileName}`); // делаем запрос на сервер для удаления файла на сервере и указываем в ссылке на эндпоинт параметр fileName,чтобы на бэкэнде его достать

            console.log(response.data); // выводим в логи ответ от сервера

            setImgPath(''); // изменяем состояние imgPath(пути картинки) на пустую строку,чтобы картинка не показывалась,если она не правильная по размеру и была удалена с сервера(иначе картинка показывается,даже если она удалена с сервера)

        } catch (e: any) {
            setErrNewProductForm(e.response?.data?.message);
        }

    }


    // при изменении imgPath проверяем ширину и высоту картинки,которую выбрал пользователь(мы помещаем путь до картинки на нашем сервере node js в тег img и к этому тегу img привязали useRef с помощью которого берем ширину и высоту картинки)
    useEffect(() => {

        // используем тут setTimeout(код в этом callback будет выполнен через время,которое указали вторым параметром в setTimeout после запятой,это время указывается в миллисекундах,в данном случае этот код будет выполнен через 0.1 секунду(через 100 миллисекунд)),в данном случае это делаем для того,чтобы успела появится новая картинка,после того,как пользователь ее выбрал в ипнуте файлов,иначе не успевает появиться и показывает ширину картинки как 0
        setTimeout(() => {

            console.log(newProductImage.current?.width);
            console.log(newProductImage.current?.height);

            // imageNewProduct?.current true,то есть в этом useRef что-то есть(эта проверка просто потому что этот useRef может быть undefined и выдает ошибку об этом)
            if (newProductImage?.current) {

                if (newProductImage.current.width < 264 || newProductImage.current.height < 240) {
                    // если newProductImage?.current?.width меньше 264(то есть если ширина картинки меньше 264 ),или если высота картинки меньше 240,то показываем ошибку

                    setErrNewProductForm('Width of image must be more than 264px and height must be more than 240px');


                    // делаем удаление файла на сервере,который не правильного размера ширины и высоты,так как если не удалять,а нужна конкретная ширина и высота картинки,то файлы будут просто скачиваться на наш node js сервер и не удаляться,поэтому отдельно делаем запрос на сервер на удаление файла
                    deleteFileRequest(inputFile?.name); // передаем в нашу функцию название файла,который пользователь выбрал в инпуте файлов(мы поместили его в состояние inputFile),наша функция deleteFileRequest делает запрос на сервер на удаление файла и возвращает ответ от сервера(в данном случае при успешном запросе ответ от сервера будет объект с полями)

                }

            }

        }, 100)

    }, [imgPath])


    const onSubmitNewProductAdminPanel = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если значение инпута названия продукта,из которого убрали пробелы с помощью trim() равно пустой строке,то выводим ошибку(то есть если без пробелов это значение равно пустой строке,то показываем ошибку) или это значение меньше 3
        if (inputNameProduct.trim() === '' || inputNameProduct.length < 3) {
            setErrNewProductForm('Product name must be more than 3 characters');
        } else if (selectCategoryValue === 0 || selectTasteValue === 0) {
            // если состояния значений селектов категории и вкуса пустые,то показываем ошибку
            setErrNewProductForm('Choose category and taste');
        } else if (!inputFile) {
            // если состояние файла false(или null),то есть его нет,то показываем ошибку
            setErrNewProductForm('Choose product image');
        } else if (newProductImage?.current && newProductImage.current.width < 264 || newProductImage?.current && newProductImage.current.height < 240) {
            // если newProductImage?.current true(то есть в этом useRef что-то есть(эта проверка просто потому что этот useRef может быть undefined и выдает ошибку об этом)) и newProductImage?.current?.width меньше 264(то есть если ширина картинки меньше 264 ),или если newProductImage?.current true и высота картинки меньше 240,то показываем ошибку

            setErrNewProductForm('Width of image must be more than 202px and height must be more than 172px');


        } else {

            // если состояние ошибки равно пустой строке,то есть ошибки нет
            if (errNewProductForm === '') {

                let priceFilter; // указываем переменную priceFilter,чтобы ее потом в зависимости от условий изменять

                if (inputPriceValue < 10) {
                    priceFilter = 'Under $10';
                } else if (inputPriceValue >= 10 || inputPriceValue < 20) {
                    priceFilter = '$10-$20';
                } else if (inputPriceValue >= 20 || inputPriceValue < 30) {
                    priceFilter = '$20-$30';
                } else if (inputPriceValue >= 30) {
                    priceFilter = 'Above $30';
                }

                // в image передаем путь до файла на нашем node js сервере,в данном случае мы помещаем этот путь в состояние imgPath
                mutate({name:inputNameProduct,categoryId:selectCategoryValue,tasteId:selectTasteValue,price:inputPriceValue,priceFilter:priceFilter,amount:1,rating:0,totalPrice:inputPriceValue,image:inputFile.name} as IProduct); // поле id не указываем,чтобы оно сгенерировалось на сервере автоматически,указываем тип этого объекта as IProduct(то есть как на основе нашего типа IProduct, в данном случае это для того,чтобы не было ошибки,что priceFilter может быть undefined),указываем поле image как поле name у состояния inputFile(inputFile.name,то есть название файла,который выбрал пользователь),потом по этому с помощью этого поле image еще будем удалять картинку товара из папки на сервере при удалении товара из каталога


                setErrNewProductForm(''); // убираем ошибку формы

                // очищаем инпуты формы создания нового товара
                setInputNameProduct('');
                setSelectCategoryValue(0);
                setSelectTasteValue(0);
                setInputPriceValue(1);
                setImgPath(''); // указываем состоянию пути картинки пустую строку,чтобы когда пользователь сохранил новый товар,то картинка не показывалась уже

            }

        }

    }


    // если состояние загрузки true,то есть идет загрузка,то показываем лоадер(загрузку),если не отслеживать загрузку при функции checkAuth(для проверки на refresh токен при запуске страницы),то будет не правильно работать(только через некоторое время,когда запрос на /refresh будет отработан,поэтому нужно отслеживать загрузку и ее возвращать как разметку страницы,пока грузится запрос на /refresh)
    if (isLoading) {
        // возвращаем тег main с классом main,так как указали этому классу стили,чтобы был прижат header и footer
        return (
            <main className="main">
                <div className="container">
                    <div className="innerForLoader">
                        <div className="loader"></div>
                    </div>
                </div>
            </main>
        )
    }


    // если isAuth false,то есть пользователь не авторизован(когда возвращается ошибка от сервера от эндпоинта /refresh в функции checkAuth,то isAuth становится типа false,и тогда пользователя типа выкидывает из аккаунта,то есть в данном случае возвращаем компонент формы регистрации и авторизации),то возвращаем компонент формы,вместо страницы пользователя,когда пользотватель логинится и вводит правильно данные,то эта проверка на isAuth тоже работает правильно и если данные при логине были введены верно,то сразу показывается страница пользователя(даже без использования отдельного useEffect)
    if (!isAuth) {
        return (
            <main className="main">
                {/* передаем в пропсах параметр nameUserTop с определенным значением,чтобы отображать разный текст в одном компоненте SectionUserTop */}
                <SectionUserTop nameUserTop="Sign In" />

                <UserFormComponent />
            </main>
        )
    }

    return (
        <main className="main">
            {/* передаем в пропсах параметр nameUserTop с определенным значением,чтобы отображать разный текст в одном компоненте SectionUserTop */}
            <SectionUserTop nameUserTop="User Account" />

            <section className="sectionUserPage" >
                <div className="container">
                    <div className="sectionUserPage__inner">
                        <div className="sectionUserPage__leftBar">
                            <h2 className="sectionUserPage__leftBar-title">Navigation</h2>
                            <ul className="leftBar__list">
                                <li className={tab === 'dashboard' ? "leftBar__list-item leftBar__list-item--active" : "leftBar__list-item"} onClick={() => setTab('dashboard')}>
                                    <img src="/images/sectionUserPage/dashboard 2.png" alt="" className="leftBar__list-img" />
                                    <p className={tab === 'dashboard' ? "leftBar__list-text leftBar__list-text--active" : "leftBar__list-text"}>Dashboard</p>
                                </li>

                                {/* если user.role === 1(то есть если роль пользователя равна 1(а в данном случае равна "USER",так как значение в данном случае значение 1 соответствует значению "USER",это мы прописывали в node js для базы данных)),то показываем таб с настройками профиля пользователя */}
                                {user.roleId === 1 &&

                                    <li className={tab === 'settings' ? "leftBar__list-item leftBar__list-item--active" : "leftBar__list-item"} onClick={() => setTab('settings')}>
                                        <img src="/images/sectionUserPage/dashboard 2 (1).png" alt="" className="leftBar__list-img" />
                                        <p className={tab === 'settings' ? "leftBar__list-text leftBar__list-text--active" : "leftBar__list-text"}>Settings</p>
                                    </li>

                                }

                                {/* если user.role === 2(то есть если роль пользователя равна 2(а в данном случае равна "ADMIN",так как значение в данном случае значение 1 соответствует значению "ADMIN",это мы прописывали в node js для базы данных)),то показываем таб с настройками профиля пользователя */}

                                {user.roleId === 2 &&

                                    <li className={tab === 'adminPanel' ? "leftBar__list-item leftBar__list-item--active" : "leftBar__list-item"} onClick={() => setTab('adminPanel')}>
                                        <img src="/images/sectionUserPage/dashboard 2 (1).png" alt="" className="leftBar__list-img" />
                                        <p className={tab === 'adminPanel' ? "leftBar__list-text leftBar__list-text--active" : "leftBar__list-text"}>Admin Panel</p>
                                    </li>

                                }



                                <li className="leftBar__list-item leftBar__list-itemLogout" onClick={logout}>
                                    <img src="/images/sectionUserPage/dashboard 2 (2).png" alt="" className="leftBar__list-img" />
                                    <p className="leftBar__list-text">Logout</p>
                                </li>
                            </ul>
                        </div>
                        <div className="sectionUserPage__mainBlock">

                            {tab === 'dashboard' &&
                                <div className="sectionUserPage__dashboard">
                                    <div className="sectionUserPage__dashboard-userInfo">
                                        <img src="/images/sectionUserPage/Ellipse 5.png" alt="" className="dashboard__userInfo-img" />
                                        <h3 className="dashboard__userInfo-name">{user.userName}</h3>
                                        <p className="dashboard__userInfo-email">{user.email}</p>
                                        <button className="dashboard__userInfo-btn" onClick={() => setTab('settings')}>Edit Profile</button>
                                    </div>
                                </div>
                            }


                            {/* если user.role === 1(то есть если роль пользователя равна 1(а в данном случае равна "USER",так как значение в данном случае значение 1 соответствует значению "USER",это мы прописывали в node js для базы данных)) и tab === 'settings',то показываем таб с настройками профиля пользователя */}
                            {user.roleId === 1 && tab === 'settings' &&
                                <div className="sectionUserPage__settings">
                                    <form onSubmit={onSubmitFormSettings} className="settings__accountSettings">
                                        <h2 className="settings__accountSettings-title">Account Settings</h2>
                                        <div className="settings__accountSettingsMain">
                                            <div className="settings__accountSettingsMain-item">
                                                <p className="accountSettingsMain__item-text">Name</p>
                                                <input type="text" className="accountSettingsMain__item-input" placeholder={`${user.userName}`} value={inputNameAccSettings} onChange={(e) => setInputNameAccSettings(e.target.value)} />
                                            </div>
                                            <div className="settings__accountSettingsMain-item">
                                                <p className="accountSettingsMain__item-text">Email</p>
                                                <input type="text" className="accountSettingsMain__item-input" placeholder={`${user.email}`} value={inputEmailAccSettings} onChange={(e) => setInputEmailAccSettings(e.target.value)} />
                                            </div>

                                            {/* если errorAccSettings true(то есть в состоянии errorAccSettings что-то есть),то показываем текст ошибки */}
                                            {errorAccSettings && <p className="formErrorText">{errorAccSettings}</p>}

                                            {/* указываем тип submit кнопке,чтобы она по клику активировала форму,то есть выполняла функцию,которая выполняется в onSubmit в форме */}
                                            <button type="submit" className="settings__accountSettingsMain__btn">Save Changes</button>
                                        </div>
                                    </form>

                                    <form onSubmit={onSubmitPassSettingsForm} className="settings__accountSettings settings__passwordSettings">
                                        <h2 className="settings__accountSettings-title">Change Password</h2>
                                        <div className="settings__accountSettingsMain">
                                            <div className="settings__accountSettingsMain-item settings__passwordSettings-item">
                                                <p className="accountSettingsMain__item-text">Current Password</p>

                                                {/* если passwordActiveCurrent true(то есть состояние для кнопки скрытия пароля инпута true), то указываем тип инпуту как password(чтобы были точки вместо символов), в другом случае тип как text */}
                                                <input type={passwordActiveCurrent ? "password" : "text"} className="accountSettingsMain__item-input passwordSettings__item-input" placeholder="Current Password" value={inputPassCurrent} onChange={(e) => setInputPassCurrent(e.target.value)} />
                                                <img src="/images/sectionUserForm/eye-open 1.png" alt="" className="login__passwordBlock-img passwordSettings__item-img" onClick={() => setPasswordActiveCurrent((prev) => !prev)} />
                                            </div>

                                            <div className="settings__passwordSettingsMain-passwordsBlock">

                                                <div className="settings__accountSettingsMain-item settings__passwordSettings-item">
                                                    <p className="accountSettingsMain__item-text">New Password</p>
                                                    <input type={passwordActiveNew ? "password" : "text"} className="accountSettingsMain__item-input passwordSettings__item-input" placeholder="New Password" value={inputPassNew} onChange={(e) => setInputPassNew(e.target.value)} />
                                                    <img src="/images/sectionUserForm/eye-open 1.png" alt="" className="login__passwordBlock-img passwordSettings__item-img" onClick={() => setPasswordActiveNew((prev) => !prev)} />
                                                </div>
                                                <div className="settings__accountSettingsMain-item settings__passwordSettings-item">
                                                    <p className="accountSettingsMain__item-text">Confirm Password</p>
                                                    <input type={passwordActiveConfirm ? "password" : "text"} className="accountSettingsMain__item-input passwordSettings__item-input" placeholder="Confirm Password" value={inputPassConfirm} onChange={(e) => setInputPassConfirm(e.target.value)} />
                                                    <img src="/images/sectionUserForm/eye-open 1.png" alt="" className="login__passwordBlock-img passwordSettings__item-img" onClick={() => setPasswordActiveConfirm((prev) => !prev)} />
                                                </div>

                                            </div>


                                            {/* если errorPasswordSettings true(то есть в состоянии errorPasswordSettings что-то есть),то показываем текст ошибки */}
                                            {errorPasswordSettings && <p className="formErrorText">{errorPasswordSettings}</p>}

                                            {/* указываем тип submit кнопке,чтобы она по клику активировала форму,то есть выполняла функцию,которая выполняется в onSubmit в форме */}
                                            <button type="submit" className="settings__accountSettingsMain__btn">Change Password</button>
                                        </div>
                                    </form>

                                </div>
                            }


                            {/* если user.role === 2(то есть если роль пользователя равна 1(а в данном случае равна "ADMIN",так как значение в данном случае значение 2 соответствует значению "ADMIN",это мы прописывали в node js для базы данных)) и tab === 'adminPanel',то показываем таб с панелью администратора */}
                            {user.roleId === 2 && tab === 'adminPanel' &&
                                <div className="sectionUserPage__settings">
                                    <form className="settings__accountSettings" onSubmit={onSubmitNewProductAdminPanel}>
                                        <h2 className="settings__accountSettings-title">New Product</h2>
                                        <div className="settings__accountSettingsMain">
                                            <div className="settings__accountSettingsMain-item">
                                                <p className="accountSettingsMain__item-text">Name</p>
                                                <input type="text" className="accountSettingsMain__item-input" placeholder="Name" value={inputNameProduct} onChange={(e) => setInputNameProduct(e.target.value)} />
                                            </div>


                                            <div className="adminPanel__newProduct-selectsBlock">

                                                <div className="adminPanel__newProduct-categoryBlock">
                                                    <p className="accountSettingsMain__item-text">Category</p>
                                                    <div className="selectBlock__select-inner" onClick={() => setSelectCategoryActive((prev) => !prev)}>
                                                        <div className="selectBlock__select">
                                                            {/* если selectCategoryValue === 1(если состояние селекта категорий равно 1,то указываем один текст,в других случаях другой текст) */}
                                                            <p className="selectBlock__select-text">{selectCategoryValue === 1 ? "Vegetables" : selectCategoryValue === 2 ? "Cooking" : selectCategoryValue === 3 ? "Beauty & Health" : ""}</p>

                                                            <img src="/images/sectionCatalog/Chevron Down.png" alt="" className={selectCategoryActive ? "selectBlock__select-img selectBlock__select-imgActive" : "selectBlock__select-img"} />
                                                        </div>
                                                        <div className={selectCategoryActive ? "selectBlock__optionsBlock select__optionsBlock--active select__adminPanelCategory--active" : "selectBlock__optionsBlock"}>
                                                            <div className="optionsBlock__item" onClick={() => setSelectCategoryValue(1)}>
                                                                <p className="optionsBlock__item-text">Vegetables</p>
                                                            </div>
                                                            <div className="optionsBlock__item" onClick={() => setSelectCategoryValue(2)}>
                                                                <p className="optionsBlock__item-text">Cooking</p>
                                                            </div>
                                                            <div className="optionsBlock__item" onClick={() => setSelectCategoryValue(3)}>
                                                                <p className="optionsBlock__item-text">Beauty & Health</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="adminPanel__newProduct-categoryBlock">
                                                    <p className="accountSettingsMain__item-text">Taste</p>
                                                    <div className="selectBlock__select-inner" onClick={() => setSelectTasteActive((prev) => !prev)}>
                                                        <div className="selectBlock__select">
                                                            {/* если selectTasteValue === 1(если состояние селекта вкусов равно 1,то указываем один текст,в других случаях другой текст) */}
                                                            <p className="selectBlock__select-text">{selectTasteValue === 1 ? "Sweet" : selectTasteValue === 2 ? "Spicy" : selectTasteValue === 3 ? "Bitter" : ""}</p>

                                                            <img src="/images/sectionCatalog/Chevron Down.png" alt="" className={selectTasteActive ? "selectBlock__select-img selectBlock__select-imgActive" : "selectBlock__select-img"} />
                                                        </div>
                                                        <div className={selectTasteActive ? "selectBlock__optionsBlock select__optionsBlock--active select__adminPanelCategory--active" : "selectBlock__optionsBlock"}>
                                                            <div className="optionsBlock__item" onClick={() => setSelectTasteValue(1)}>
                                                                <p className="optionsBlock__item-text">Sweet</p>
                                                            </div>
                                                            <div className="optionsBlock__item" onClick={() => setSelectTasteValue(2)}>
                                                                <p className="optionsBlock__item-text">Spicy</p>
                                                            </div>
                                                            <div className="optionsBlock__item" onClick={() => setSelectTasteValue(3)}>
                                                                <p className="optionsBlock__item-text">Bitter</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>


                                            <div className="settings__accountSettingsMain-item">
                                                <p className="accountSettingsMain__item-text">Price</p>
                                                <div className="info__CartBlock-inputBlock">
                                                    <div className="CartBlock__inputBlock-inputBtn CartBlock__inputBlock-inputBtnMinus" onClick={handlerMinusBtn}>
                                                        <img src="/images/sectionProductsItemTop/Minus.png" alt="" className="inputBlock__inputBtn-img" />
                                                    </div>
                                                    <input type="number" className="CartBlock__inputBlock-input" onChange={changeInputPriceValue} value={inputPriceValue} />
                                                    <div className="CartBlock__inputBlock-inputBtn CartBlock__inputBlock-inputBtnPlus" onClick={handlerPlusBtn}>
                                                        <img src="/images/sectionProductsItemTop/plus 1.png" alt="" className="inputBlock__inputBtn-img" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="adminPanel__imageBlock">
                                                <label htmlFor="inputFile" className="adminPanel__labelInputImage" >
                                                    Load image
                                                    {/* указываем multiple этому инпуту для файлов,чтобы можно было выбирать несколько файлов одновременно для загрузки(в данном случае убрали multiple,чтобы был только 1 файл),указываем accept = "image/*",чтобы можно было выбирать только изображения любого типа */}
                                                    <input accept="image/*" type="file" id="inputFile" className="adminPanel__inputImage" onChange={inputLoadImageHandler} />
                                                </label>
                                            </div>

                                            {/* если imgPath не равно пустой строке,то показываем картинку */}
                                            {imgPath !== '' &&
                                                <>
                                                    <img src={imgPath} alt="" className="adminPanel__previewImg" ref={newProductImage} />
                                                    <p className="adminPanel__namePreviewImg">{inputFile?.name}</p> {/* указываем название файла у состояния inputFile у поля name,указываем здесь ? перед name,так как иначе ошибка,что состояние inputFile может быть undefined */}
                                                </>
                                            }


                                            {/* если errNewProductForm true(то есть в состоянии errNewProductForm что-то есть),то показываем текст ошибки */}
                                            {errNewProductForm && <p className="formErrorText">{errNewProductForm}</p>}

                                            {/* указываем тип submit кнопке,чтобы она по клику активировала форму,то есть выполняла функцию,которая выполняется в onSubmit в форме */}
                                            <button type="submit" className="settings__accountSettingsMain__btn">Save Product</button>
                                        </div>
                                    </form>
                                </div>
                            }

                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default UserPage;