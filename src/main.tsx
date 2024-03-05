
import ReactDOM from 'react-dom/client'
import { 
  //BrowserRouter, 
  Routes, 
  Route, 
  HashRouter 
} from 'react-router-dom';
import { App } from './App';
import { Login } from './pages/Login';
import { AuthContextProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthContextProvider>
      <HashRouter >
        <Routes>
          <Route path="/our-money/login" element={<Login />} />
          <Route path="/our-money/transactions" element={<App />} />
          <Route path="/" element={<App />} />
        </Routes>
      </HashRouter>
    </AuthContextProvider>
);
