const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
require('dotenv').config(); 
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 

app.use(cors());
app.use(express.json());

app.post('/crear-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creando intent:', error);
    res.status(500).json({ error: 'Error al crear PaymentIntent' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
