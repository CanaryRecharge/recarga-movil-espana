// app.js
paypal.Buttons({
  createOrder: function(data, actions) {
    const importe = document.getElementById("importe").value;
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: importe
        }
      }]
    });
  },
  onApprove: function(data, actions) {
    return actions.order.capture().then(function(details) {
      const numero = document.getElementById("numero").value;
      const operador = document.getElementById("operador").value;
      const importe = document.getElementById("importe").value;

      // Enviar datos al backend
      fetch("/api/recargar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero, operador, importe })
      })
      .then(res => res.json())
      .then(data => alert("Recarga exitosa: " + data.status))
      .catch(err => alert("Error en la recarga"));
    });
  }
}).render('#paypal-button-container');