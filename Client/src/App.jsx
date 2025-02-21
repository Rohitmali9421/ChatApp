import React from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import Login from './Pages/Login';
import { Provider } from 'react-redux';
import { store } from "./App/Store"
import SignUp from './Pages/SignUp';
import Home from './Pages/Home';
import Start from './Components/Start';
import Chat from './Components/Chat';
import EditProfile from './Pages/EditProfile';
const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/home" element={<Home />}>
                <Route path="chat" element={<Start />} />
                <Route path="chat/:id" element={<Chat />} />
            </Route>
        </>
    )
);

const App = () => {
    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
        
    );
};

export default App;
