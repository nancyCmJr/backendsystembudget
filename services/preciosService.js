const axios = require('axios');
const cheerio = require('cheerio');
const PrecioHistorial = require('../models/precioHistorial');

const CACHE_TIEMPO = 1000 * 60 * 60;
const cacheMemoria = new Map();

// ==============================
// LIMPIAR PRECIO
// ==============================
const limpiarPrecio = (texto) => {
  if (!texto) return null;
  return parseFloat(texto.replace(/[^0-9.]/g, ''));
};

// ==============================
// CACHE DB
// ==============================
const buscarEnCacheDB = async (nombre, zona) => {
  const haceUnaHora = new Date(Date.now() - CACHE_TIEMPO);

  return await PrecioHistorial.find({
    nombre,
    zona,
    fecha: { $gte: haceUnaHora }
  });
};

// ==============================
// SCRAPING MERCADOLIBRE (ESTABLE)
// ==============================
const scrapingMercadoLibre = async (query) => {
  try {
    const url = `https://listado.mercadolibre.com.mx/${encodeURIComponent(query)}`;

    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(data);

    const resultados = [];

    $('.ui-search-result').each((i, el) => {
      if (i < 5) {
        const nombre = $(el).find('.ui-search-item__title').text();
        const precio = $(el).find('.andes-money-amount__fraction').text();

        if (nombre && precio) {
          resultados.push({
            nombre: nombre.trim(),
            precio: limpiarPrecio(precio),
            tienda: "mercado_libre"
          });
        }
      }
    });

    return resultados;

  } catch (error) {
    console.log("Error MercadoLibre:", error.message);
    return [];
  }
};

// ==============================
// SCRAPING AMAZON (OPCIONAL)
// ==============================
const scrapingAmazon = async (query) => {
  try {
    const url = `https://www.amazon.com.mx/s?k=${encodeURIComponent(query)}`;

    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(data);
    const resultados = [];

    $('.s-result-item').each((i, el) => {
      if (i < 5) {
        const nombre = $(el).find('h2 span').text();
        const precio = $(el).find('.a-price-whole').text();

        if (nombre && precio) {
          resultados.push({
            nombre,
            precio: limpiarPrecio(precio),
            tienda: "amazon"
          });
        }
      }
    });

    return resultados;

  } catch (error) {
    console.log("Error Amazon:", error.message);
    return [];
  }
};

// ==============================
// COMPARAR PRECIOS
// ==============================
const compararPrecios = (precios) => {
  if (!precios.length) return null;

  const ordenados = [...precios].sort((a, b) => a.precio - b.precio);

  return {
    mas_barato: ordenados[0],
    mas_caro: ordenados[ordenados.length - 1],
    promedio: ordenados.reduce((a, b) => a + b.precio, 0) / ordenados.length
  };
};

// ==============================
// FUNCIÓN PRINCIPAL
// ==============================
const obtenerPrecios = async (nombre, zona) => {

  const key = `${nombre}-${zona}`;

  // CACHE MEMORIA
  if (cacheMemoria.has(key)) {
    return {
      precios: cacheMemoria.get(key),
      comparacion: compararPrecios(cacheMemoria.get(key)),
      cache: "memoria"
    };
  }

  // CACHE DB
  const cacheDB = await buscarEnCacheDB(nombre, zona);

  if (cacheDB.length > 0) {
    const datos = cacheDB.map(c => ({
      nombre: c.nombre,
      precio: c.precio,
      tienda: c.tienda
    }));

    cacheMemoria.set(key, datos);

    return {
      precios: datos,
      comparacion: compararPrecios(datos),
      cache: "database"
    };
  }

  // SCRAPING MULTI-TIENDA
  const [ml, amazon] = await Promise.all([
    scrapingMercadoLibre(nombre),
    scrapingAmazon(nombre)
  ]);

  let resultados = [...ml, ...amazon];

  if (resultados.length === 0) {
    return {
      precios: [],
      comparacion: null,
      cache: "sin_datos"
    };
  }

  // GUARDAR EN DB
  for (let item of resultados) {
    await PrecioHistorial.create({
      nombre: item.nombre,
      tienda: item.tienda,
      precio: item.precio,
      zona
    });
  }

  // CACHE MEMORIA
  cacheMemoria.set(key, resultados);
  setTimeout(() => cacheMemoria.delete(key), CACHE_TIEMPO);

  return {
    precios: resultados,
    comparacion: compararPrecios(resultados),
    cache: "scraping"
  };
};

module.exports = {
  obtenerPrecios
};