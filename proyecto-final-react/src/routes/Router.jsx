import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login.jsx'
import Users from '../pages/Users.jsx'
import UserDetail from '../pages/UserDetail.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import Navbar from '../components/Navbar.jsx'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios/:id"
          element={
            <ProtectedRoute>
              <UserDetail />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/usuarios" />} />
        <Route path="*" element={<Navigate to="/usuarios" />} />
      </Routes>
    </BrowserRouter>
  )
}
