const axios = require("axios");
const cheerio = require("cheerio");

async function obtenerPrecio(material) {
  const url = `https://www.homedepot.com.mx/search?q=${material}`;

  const { data } = await axios.get(url);

  const $ = cheerio.load(data);

  const precio = $(".price").first().text();

  return precio;
}

module.exports = { obtenerPrecio };