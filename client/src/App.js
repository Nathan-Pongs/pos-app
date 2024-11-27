import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Homepage from './pages/Homepage';
import CryptoJS from 'crypto-js';
import ItemPage from './pages/ItemPage';
import './styles/DefaultLayout.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import CartPage from './pages/CartPage';
import Register from './pages/Register';
import Login from './pages/Login';
import BillsPage from './pages/BillsPage';
import CustomerPage from './pages/CustomerPage';
function App() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path='/login' element = {<Login/>}></Route>
                <Route path='/register' element = {<Register/>}></Route>
                <Route path="/" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
                <Route path="/items" element={<ProtectedRoute><ItemPage /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="/bills" element={<ProtectedRoute><BillsPage /></ProtectedRoute>} />
                <Route path="/customers" element={<ProtectedRoute><CustomerPage /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;


export function ProtectedRoute({ children }){
  const encryptedData = localStorage.getItem('user');

  if (!encryptedData) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decryptedData = JSON.parse(CryptoJS.AES.decrypt(encryptedData, 'secret-key').toString(CryptoJS.enc.Utf8));
    if (!decryptedData) {
      throw new Error('Invalid user data');
    }
  } catch (error) {
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  return children;
};