require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const path = require("path");
const axios = require("axios");
const Usuario = require("./models/Usuario");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// 🔗 Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Conectado a MongoDB"));

// 📧 Configurar Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 🔐 Ruta de registro
app.post("/api/registro", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ error: "El usuario ya existe" });

    const hash = await bcrypt.hash(password, 10);
    const nuevoUsuario = await Usuario.create({ email, password: hash });

    await transporter.sendMail({
      from: `"Recarga Móvil España" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Bienvenido a Recarga Móvil España",
      text: `Hola ${email}, gracias por registrarte. Ya puedes hacer recargas desde nuestra web.`
    });

    res.json({ status: "Usuario registrado y correo enviado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el registro" });
  }
});

// 📲 Ruta de recarga con Reloadly
const RELOADLY_TOKEN = process.env.RELOADLY_TOKEN;

app.post("/api/recargar", async (req, res) => {
  const { numero, operador, importe } = req.body;

  try {
    const response = await axios.post("https://topups.reloadly.com/topups", {
      operatorId: getOperatorId(operador),
      amount: importe,
      recipientPhone: {
        countryCode: "ES",
        number: numero
      }
    }, {
      headers: {
        Authorization: `Bearer ${RELOADLY_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    res.json({ status: "Recarga enviada", data: response.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Error en la recarga" });
  }
});

function getOperatorId(nombre) {
  const operadores = {
    movistar: 1234,
    orange: 5678,
    vodafone: 91011,
    yoigo: 121314,
    digi: 151617
  };
  return operadores[nombre];
}

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));