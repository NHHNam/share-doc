import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAppContext } from './utils';
import React, { useEffect, useState } from 'react';
import { userRoutes } from './routes/user.route';
import DefaultLayout from './layouts/User/DefaultLayout/Default';
import Login from './layouts/Login/Login';
import { adminRoutes } from './routes/admin.route';
import DefaultLayoutAdmin from './layouts/Admin/DefaultLayout/DefaultAdmin';

function App() {
    const { state } = useAppContext();
    const info = state.set.info ?? {};

    return (
        <Router>
            <Routes>
                {localStorage.getItem('@permission') === 'user'
                    ? userRoutes &&
                      userRoutes.map((route) => {
                          return (
                              <Route
                                  path={route.path}
                                  element={
                                      <DefaultLayout>
                                          {route.element}
                                      </DefaultLayout>
                                  }
                              />
                          );
                      })
                    : adminRoutes &&
                      adminRoutes.map((route) => {
                          return (
                              <Route
                                  path={route.path}
                                  element={
                                      <DefaultLayoutAdmin>
                                          {route.element}
                                      </DefaultLayoutAdmin>
                                  }
                              />
                          );
                      })}
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
