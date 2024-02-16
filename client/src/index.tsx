import React from 'react';
import  ReactDOM  from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import { AuthProvider } from './components/AuthProvider'

// const rootElement = document.getElementById("root") as HTMLElement;
// const root = createRoot(rootElement)

ReactDOM.render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>,
document.getElementById('root'));

reportWebVitals();


