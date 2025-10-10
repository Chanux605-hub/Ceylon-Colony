import mongoose from "mongoose";

const orderDetailsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      img: { type: String }
    }
  ],
  amount: { type: Number, required: true },
  address: {
    firstName: String,
    lastName: String,
    email: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
    phone: String
  },
  paymentMethod: { type: String, enum: ["cod", "stripe"], default: "cod" },
  status: { type: String, default: "Processing" },
  date: { type: Date, default: Date.now }
});

const orderDetailsModel =
  mongoose.models.orderdetails ||
  mongoose.model("orderdetails", orderDetailsSchema);

export default orderDetailsModel;
