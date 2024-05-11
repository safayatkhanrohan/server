const products = require("./data");
const connectDB = require("./src/config/dbConfig");
const Product = require("./src/model/productModel");

connectDB();
Product.deleteMany({}).then(() => {
  console.log("Data Destroyed");
}).catch(error => {
  console.error("Error with data destroy", error);
});

Product.insertMany(products).then(() => {
    console.log("Data Import Success");
  process.exit();
}).catch(error => {
    console.error("Error with data import", error);
    process.exit(1);
});