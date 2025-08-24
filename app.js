// 🕒 Mostrar la hora al cargar la página
function actualizarHora() {
  const reloj = document.getElementById("reloj");
  if (!reloj) return;

  const ahora = new Date();
  const opciones = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZoneName: 'short'
  };

  const horaFormateada = ahora.toLocaleTimeString('es-ES', opciones);
  reloj.textContent = horaFormateada;
}

setInterval(actualizarHora, 1000);
actualizarHora();

// 💳 Configurar botón de PayPal
paypal.Buttons({
  createOrder: function(data, actions) {
    const importe = document.getElementById("importe").value;
    return actions.order.create({
      purchase_units: [{
        amount: { value: importe }
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