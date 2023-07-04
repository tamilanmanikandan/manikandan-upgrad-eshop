import { useContext, useState } from "react";
import NavigationBar from "../navigation/NavigationBar";
import { Avatar, Button, TextField, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../common/AuthContext";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const { authToken, setToken, setUserId, setIsAdmin } = useContext(AuthContext);

    const handleSubmit = (event) => {
        event.preventDefault();

        setEmailError(false);
        setPasswordError(false);

        if (email === "") {
            setEmailError(true);
        }
        if (password === "") {
            setPasswordError(true);
        }

        if (email && password) {
            console.log(email, password);
            axios
                .post("http://localhost:8080/api/auth/signin", {
                    username: email,
                    password: password,
                })
                .then(function (response) {
                    console.log(response.data.token);
                    if (response.data.token) {
                        setToken(response.data.token);
                    }
                    if (response.data.id) {
                        setUserId(response.data.id);
                    }
                    if (response.data.roles && response.data.roles.includes("ADMIN")) {
                        setIsAdmin(true);
                    }
                    navigate("/products");
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };

    if (authToken) {
        navigate("/products");
    }

    return (
        <>
            <NavigationBar />
            <div
                style={{
                    width: "500px",
                    padding: "10px 20px",
                    margin: "100px auto",
                    height: "100%",
                    textAlign: "center",
                }}
            >
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <Avatar
                        style={{
                            backgroundColor: "deeppink",
                            margin: "10px auto",
                        }}
                    >
                        <LockIcon />
                    </Avatar>
                    <Typography gutterBottom variant="h5" component="p">
                        Sign in
                    </Typography>
                    <TextField
                        label="Email Address"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        variant="outlined"
                        type="email"
                        sx={{ mb: 3 }}
                        fullWidth
                        value={email}
                        error={emailError}
                    />
                    <TextField
                        label="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        variant="outlined"
                        type="password"
                        value={password}
                        error={passwordError}
                        fullWidth
                        sx={{ mb: 3 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ mt: 2, width: "100%" }}
                    >
                        Sign In
                    </Button>
                </form>
            </div>
            <div style={{ textAlign: "center" }}>
                Copyright &copy; <Link href="https://www.upgrad.com/">upGrad</Link> 2023
            </div>
        </>
    );
}

export default Login;