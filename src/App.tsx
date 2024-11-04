import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Order from "./pages/Oreder";
import Layout from "./shared/Layout";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<Order />} />
      </Routes>
    </Layout>
  );
}

export default App;
