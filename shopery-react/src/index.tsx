import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// устанавливаем react query с помощью команды в терминале npm i @tanstack/react-query

// указываем наш queryClient и указываем у него настройки
const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      refetchOnWindowFocus:false // refetchOnWindowFocus:false-убирает повторный запрос на сервер с помощью react query при смене фокуса окна
    } 
  }
})


root.render(
  <React.StrictMode>
    {/* оборачиваем наше приложение в QueryClientProvider,чтобы работал react query,в client указываем наш queryClient,который мы создали выше и указали в нем настройки */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
