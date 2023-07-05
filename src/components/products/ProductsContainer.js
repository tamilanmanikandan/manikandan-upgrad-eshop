import { Fragment, useContext, useEffect, useState } from "react";
import NavigationBar from "../navigation/NavigationBar";
import {
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
} from "@mui/material";
import ProductCard from "./ProductCard";
import axios from "axios";
import { AuthContext } from "../../common/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Products.css"
import { showToast, ToastTypes } from "../../common/ToastUtils";

function ProductsContainer() {
    const [category, setCategory] = useState("all");
    const [sortBy, setSortBy] = useState("default");
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState([]);
    const { authToken, isAdmin } = useContext(AuthContext);
    const navigate = useNavigate();
    const [originalData, setOriginalData] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [dlgOpen, setDlgOpen] = useState(false);
    const [item, setItem] = useState();


    const triggerDataFetch = () => {
        if (authToken !== null) {
            axios
                .get("http://localhost:8080/api/products/categories", {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                })
                .then(function (response) {
                    setCategoryList(response.data);
                })
                .catch(function () {
                    showToast("There was an issue in retrieving categories list.", ToastTypes.ERROR);
                });
            axios
                .get("http://localhost:8080/api/products", {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                })
                .then((response) => {
                    console.log(response.data);
                    if (response.data.length > 0) {
                        setOriginalData(response.data);
                        setData(response.data);
                    }
                })
                .catch((error) => console.error("Error fetching data:", error));
        } else {
            navigate("/login");
        }
    }
    useEffect(() => {
        triggerDataFetch();
    }, []);

    const handleCategoryChange = (event, newCategory) => {
        const newData =
            newCategory === "all"
                ? originalData
                : originalData.filter((item) => item.category === newCategory);
        setCategory(newCategory);
        setSortBy("default");
        setData(newData);
    };

    const handleSortChange = (event) => {
        const keyString = event.target.value;
        const temp = [...data];
        if (keyString !== "default") {
            setData(
                temp.sort((a, b) =>
                    keyString === "new" ? b.id.localeCompare(a.id) : keyString === "lth" ? a.price - b.price : b.price - a.price
                )
            );
        } else {
            setData(temp);
        }
        setSortBy(keyString);
    };

    const handleSearchChange = (event) => {
        const newData = originalData.filter((item) =>
            item.name.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setData(newData);
        setSearchTerm(event.target.value);
    };

    const handleClose = () => {
    };

    let handleCloseDlg = (userChoice) => {
        setDlgOpen(false)
        if (userChoice) {
            console.log('confirmed deletion');
            axios
                .delete(`http://localhost:8080/api/products/${item.id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                })
                .then(function () {
                    setItem()
                    showToast(`Product ${item.name} deleted successfully!`, ToastTypes.SUCCESS)
                    triggerDataFetch();
                })
                .catch(function () {
                    showToast(
                        `There was an issue in deleting product, please try again later.`, ToastTypes.ERROR
                    );
                });
        }
        else {
            console.log('declined deletion');
        }
    }

    const handleDeleteCall = (item) => {
        setItem(item)
        setDlgOpen(true)
    };

    return (
        <Fragment>
            <NavigationBar
                isLogged={authToken !== null}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                isAdmin={isAdmin}
            />
            <Dialog
                open={dlgOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm deletion of product!"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete the product?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleCloseDlg(false)}>Cancel</Button>
                    <Button onClick={() => handleCloseDlg(true)} autoFocus> Confirm </Button>
                </DialogActions>
            </Dialog>
            {originalData.length > 0 ? (
                <div className="productsContainer">
                    <div className="categorySectionStyle">
                        <ToggleButtonGroup
                            color="primary"
                            value={category}
                            exclusive
                            onChange={handleCategoryChange}
                            aria-label="Category">
                            <ToggleButton key="all" value="all">
                                ALL
                            </ToggleButton>
                            {categoryList.map((category) => (
                                <ToggleButton key={category} value={category}>
                                    {category.toUpperCase()}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </div>

                    <div>
                        <FormControl className="sortByDropdown">
                            <InputLabel id="sort-select-label">Sort By</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={sortBy}
                                label="Sort"
                                onChange={handleSortChange}
                            >
                                <MenuItem value={"default"}>Default</MenuItem>
                                <MenuItem value={"htl"}>Price: High to Low</MenuItem>
                                <MenuItem value={"lth"}>Price: Low to High</MenuItem>
                                <MenuItem value={"new"}>Newest</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <Grid container spacing={5} style={{ margin: "10px 0" }}>
                        {data.map((item) => (
                            <ProductCard
                                key={item.id}
                                productData={item}
                                isAdmin={isAdmin}
                                handleDeleteCall={() => handleDeleteCall(item)}
                                navigate={navigate}
                            />
                        ))}
                    </Grid>
                </div>
            ) : (
                <Typography gutterBottom variant="body1" component="p">
                    There are no products available.
                </Typography>
            )}
        </Fragment>
    );
}

export default ProductsContainer;