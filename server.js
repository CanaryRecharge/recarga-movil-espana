// server.js
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

const RELOADLY_TOKEN = "TU_TOKEN_DE_API";

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
    yoigo: 121314
  };
  return operadores[nombre];
}

app.listen(3000, () => console.log("Servidor en puerto 3000"));