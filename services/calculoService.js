exports.calcularTotal = (materiales, manoObra, gastos) => {
  const m = materiales.reduce((a, b) => a + b.subtotal, 0);
  const mo = manoObra.reduce((a, b) => a + b.subtotal, 0);
  const g = gastos.reduce((a, b) => a + b.monto, 0);

  return m + mo + g;
};