import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Order from "../pages/Orders";

const Router = () => {
  return (
    <BrowserRouter>
      <Provider store={store}></Provider>
    </BrowserRouter>
  );
};

export default Router;
