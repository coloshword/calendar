import React from 'react';
import { createRoot } from "react-dom/client";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import { AuthProvider } from './components/AuthProvider'

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement)
// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
root.render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>,
);

reportWebVitals();


