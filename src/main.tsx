
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { Login } from './pages/Login';
import { AuthContextProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthContextProvider>
      <Routes>
        <Route path="/our-money/" element={<Login />} />
        <Route path="/our-money/transactions" element={<App />} />
      </Routes>
    </AuthContextProvider>
  </BrowserRouter>
);
