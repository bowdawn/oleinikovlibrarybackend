import express, { json } from "express";
const app = express();
import product from "./api/product.js";

app.use(json({ extended: false }));

app.use("/api/product", product);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
