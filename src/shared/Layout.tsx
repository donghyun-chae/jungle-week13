import { useState } from "react";
import { useSelector } from "react-redux";
import CartModal from "../components/CartModal";
import { useNavigate } from "react-router-dom";

const HeaderStyles = {
  width: "100%",
  background: "black",
  height: "50px",
  display: "flex",
  alignItems: "center",
  paddingLeft: "20px",
  color: "white",
  fontWeight: "600",
};
const FooterStyles = {
  width: "100%",
  height: "50px",
  display: "flex",
  background: "black",
  color: "white",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
};

const layoutStyles = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "90vh",
};

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalOrderCount = useSelector((state) => state.counter.totalQuantity);
  const navigate = useNavigate();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <header id="main-header">
        <div id="title">
          {/* <img src={kaist_jungle_logo} alt="logo" /> */}
          <button
            onClick={() => {
              navigate("/");
            }}
          >
            홈페이지
          </button>
        </div>
        <span>
          <button
            onClick={() => {
              navigate("/orders");
            }}
          >
            주문 목록
          </button>
        </span>
        <nav>
          <button onClick={handleOpenModal}>
            카트 목록: {totalOrderCount}개 담김
          </button>
        </nav>
      </header>

      <CartModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

function Footer() {
  return (
    <div style={{ ...FooterStyles }}>
      <span>copyright @SCC</span>
    </div>
  );
}

function Layout({ children }) {
  return (
    <div>
      <Header />
      <div style={{ ...layoutStyles }}>{children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
