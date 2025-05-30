import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Navbar from './components/Layout/Navbar';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { HotelsList } from './pages/HotelsList';
import { HotelDetail } from './pages/HotelDetail';
import { HotelArea } from './pages/HotelArea';
import { GuestArea } from './pages/GuestArea';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          {/* públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HotelsList />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />

          {/* protegidas */}
          <Route
            path="/guest"
            element={
              <PrivateRoute roles={['hospede']}>
                <GuestArea />
              </PrivateRoute>
            }
          />

          <Route
            path="/hotel"
            element={
              <PrivateRoute roles={['hotel']}>
                <HotelArea />
              </PrivateRoute>
            }
          />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
