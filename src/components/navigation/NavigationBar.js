import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchInput from "../search/SearchInput";

function NavigationBar(props) {
  const { isLogged, isAdmin, searchTerm, onSearchChange } = props;
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };
  return (
    <AppBar position="static" className="app-primary-color">
      <Toolbar>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <IconButton
              size="small"
              edge="start"
              color="inherit"
              aria-label="menu"
            >
              <ShoppingCartIcon />
              <Typography variant="body1" component="span">
                upGrad E-Shop
              </Typography>
            </IconButton>
          </Grid>
          <Grid item xs={3}>
            <SearchInput
              searchText={searchTerm}
              onSearchChange={onSearchChange}
            />
          </Grid>
          <Grid item xs={4} textAlign={"right"}>
            {isLogged ? (
              <div>
                <Button
                  color="inherit"
                  variant="text"
                  onClick={() => navigate(isLogged ? "/products" : "/login")}
                >
                  Home
                </Button>
                {isAdmin && (
                  <Button
                    color="inherit"
                    variant="text"
                    onClick={() => navigate("/add-product")}
                  >
                    Add Product
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  color="inherit"
                  variant="text"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  variant="text"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;