const { json } = require("express");
const express = require("express");
const connection = require("./config");
const Customer = require("./models/customer");
const Order = require("./models/order");
const Product = require("./models/product");

const app = express();

app.use(express.json());

app.post("/orders", async (req, res) => {
  const { order_id, customer_id, Product_id, Product_name, quantity } =
    req.body;
  const product = await Product.findOne({ Product_id });

  if (product && product.Available_quantity >= quantity) {
    const totalPrice = quantity * product.Product_price;
    const customer = await Customer.findOne({ customer_id });
    if (customer && customer.balance >= totalPrice) {
      const order = Order.create({
        order_id,
        customer_id,
        Product_id,
        Product_name,
        quantity,
      });
      if (order) {
        const prod = await Product.findOneAndUpdate(
          { Product_id: product.Product_id },
          { Available_quantity: product.Available_quantity - quantity }
        );
        const cus = await Customer.findOneAndUpdate(
          {
            customer_id: customer.customer_id,
          },
          { balance: customer.balance - totalPrice }
        );

        if (prod && cus) {
          res.send("order placed successfully");
        }
      }
    } else {
      res.send("Insufficient balance");
    }
  } else {
    res.send("Out of Stock!");
  }
});

app.post("/product", async (req, res) => {
  const {
    Product_id,
    Product_type,
    Product_name,
    Product_price,
    Available_quantity,
  } = req.body;

  const product = await Product.create({
    Product_id,
    Product_type,
    Product_name,
    Product_price,
    Available_quantity,
  });

  if (product) {
    res.status(200).json({
      Product_id,
      Product_type,
      Product_name,
      Product_price,
      Available_quantity,
    });
  }
});

app.post("/customer", async (req, res) => {
  const { customer_id, customer_name, email, balance } = req.body;
  const customer = await Customer.create({
    customer_id,
    customer_name,
    email,
    balance,
  });

  if (customer) {
    res.status(200).json({
      customer_id,
      customer_name,
      email,
      balance,
    });
  }
});

app.get("/orders", async (req, res) => {
  const orderid = req.query.order_id;
  const orders = await Order.find({ order_id: orderid });
  if (orders) {
    res.status(200).json(orders);
  }
});
app.get("/product", async (req, res) => {
  const Product_id = req.query.Product_id;
  const products = await Order.find({ Product_id: Product_id });
  if (products) {
    res.status(200).json(products);
  }
});
app.get("/customer", async (req, res) => {
  const customer_id = req.query.customer_id;
  const customers = await Order.find({ customer_id: customer_id });
  if (customers) {
    res.status(200).json(customers);
  }
});

app.get("/productType", async (req, res) => {
  const Product_type = req.query.Product_type;
  const products = await Product.find({ Product_type: Product_type });
  if (products) {
    res.status(200).json(products);
  }
});

app.put("/product", async (req, res) => {
  const Product_name = req.query.Product_name;
  const Available_quantity = req.query.Available_quantity;
  const products = await Product.findOneAndUpdate(
    {
      Product_name: Product_name,
    },
    { Available_quantity: Available_quantity }
  );
  if (products) {
    res.status(200).json(products);
  }
});

app.listen(3000, () => {
  console.log("Server started at port 3000");
});
