import express, { json } from "express";
const app = express();
import product from "./api/product.js";

app.use(json({ extended: false }));

app.use("/api/product", product);

app.use("/", ( req, res) => {
    try {
      res.json("Oleinikov Library");
    } catch (error) {
      console.error(error);
      return res.status(500).send("Server error");
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
