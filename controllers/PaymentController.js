require("dotenv").config();
const Flutterwave = require("flutterwave-node-v3");
const User = require("../models/User");

const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);

exports.makePayment = async (req, res) => {
  try {
    const { email, amount, currency } = req.body;
    const tx_ref = `TX-${Date.now()}`;

    const response = await flw.PaymentInitiate({
      tx_ref,
      amount,
      currency,
      redirect_url: "https://your-redirect-url.com",
      customer: { email },
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
