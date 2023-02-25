const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const userRoutes = require("./router/userRoute");
const customerRoutes = require("./router/customerRoute");
const cookieParser = require("cookie-parser");

dotenv.config();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4343;

app.use("/auth", userRoutes);
app.use("/customer", customerRoutes);

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected Successfully!");
  })
  .catch((error) => {
    console.log("Error Occured!");
  });
