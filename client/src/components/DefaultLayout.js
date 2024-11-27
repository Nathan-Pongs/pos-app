import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  CopyOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
  DashboardOutlined
} from "@ant-design/icons";
import "../styles/DefaultLayout.css";

const { Header, Sider, Content } = Layout;

const DefaultLayout = ({ children }) => {
  const cartItems = useSelector((state) => state.rootReducer?.cartItems || []); // Safe access
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // To get current route

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleLogout = () => {
    // Clear any tokens or session data if needed
    localStorage.removeItem("user"); // Example of clearing token
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <h1 className="text-center text-light fs-4">Food Order</h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname]} // Using useLocation for dynamic selection
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/" className="link">
              Home
            </Link>
          </Menu.Item>
          <Menu.Item key="/bills" icon={<CopyOutlined />}>
            <Link to="/bills" className="link">
              Bills
            </Link>
          </Menu.Item>
          <Menu.Item key="/items" icon={<UnorderedListOutlined />}>
            <Link to="/items" className="link">
              Items
            </Link>
          </Menu.Item>
          <Menu.Item key="/customers" icon={<UserOutlined />}>
            <Link to="/customers" className="link">
              Customers
            </Link>
          </Menu.Item>
          <Menu.Item key="/insights" icon={<DashboardOutlined />}>
            <Link to="/dashboard" className="link">
              Dashboard
            </Link>
          </Menu.Item>
          <Menu.Item key="/logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            }
          )}
          <Link to='/cart' className="cart-item link">
            <p>{cartItems.length}</p>
            <ShoppingCartOutlined />
          </Link>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;