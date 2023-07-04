import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import ProductsContainer from "./components/products/ProductsContainer";
import { AuthContextProvider } from "./common/AuthContext";
import ProductDetail from "./components/products/ProductDetails";
import Order from "./components/order/Order";
import AddEditProduct from "./components/products/AddEditProduct";

const appTheme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f44336",
    },
  },
});

function App() {
  return (
    <AuthContextProvider>
      <ThemeProvider theme={appTheme}>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/products" element={<ProductsContainer />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/order" element={<Order />} />
            <Route path="/add-product" element={<AddEditProduct />} />
            <Route path="/edit-product/:id" element={<AddEditProduct />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthContextProvider>
  );
}

export default App;
