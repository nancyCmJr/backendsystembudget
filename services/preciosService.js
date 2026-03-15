const axios = require("axios");
const cheerio = require("cheerio");

exports.buscarEnHomeDepot = async (query) => {

  const url = `https://www.homedepot.com.mx/search?q=${query}`;

  const response = await axios.get(url);

  const $ = cheerio.load(response.data);

  let productos = [];

  $(".product-item").each((i, el) => {

    const nombre = $(el).find(".product-title").text().trim();

    const precioTexto = $(el).find(".price").text().trim();

    const precio = parseFloat(precioTexto.replace(/[^0-9.]/g, ""));

    if (nombre) {

      productos.push({
        nombre,
        precio,
        tienda: "Home Depot"
      });

    }

  });

  return productos.slice(0, 10);

};
