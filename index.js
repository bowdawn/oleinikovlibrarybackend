import express, { json } from "express";
import mongoose from 'mongoose'
import product from "./api/product.js";
import dotenv from "dotenv"

dotenv.config()



const PORT = process.env.PORT || 5000;

const DB_URL = process.env.DB_URL || "Error - DB URL is not definted";

const app = express();

app.use(json({ extended: false }));

app.use("/api/product", product);

app.use("/", ( req, res) => {
    try {
      res.status(200).json("Oleinikov Library");
    } catch (error) {
      console.error(error);
      return res.status(500).send("Server error");
    }
});

async function startApp() {
  try {
    await mongoose.connect(DB_URL);
    app.listen(PORT, () => app.listen(PORT, () => console.log(`Server is running in port ${PORT}` ) ))
  } catch (e) {
    console.log(e)
  }
}

startApp()


