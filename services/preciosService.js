const puppeteer = require('puppeteer');
const PrecioHistorial = require('../models/precioHistorial');

const CACHE_TIEMPO = 1000 * 60 * 60; // 1 hora
const cacheMemoria = new Map();

let browserInstance = null; // reutilizar navegador

// ==============================
// OBTENER BROWSER (SINGLETON)
// ==============================
const getBrowser = async () => {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox']
    });
  }
  return browserInstance;
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
// SCRAPING (CONTROLADO)
// ==============================
const scrapingHomeDepot = async (query) => {
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    );

    const url = `https://www.homedepot.com.mx/s?q=${encodeURIComponent(query)}`;

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.waitForTimeout(3000);

    const resultados = await page.evaluate(() => {
      const items = document.querySelectorAll('.product-item');

      let productos = [];

      items.forEach((el, i) => {
        if (i < 5) {
          const nombre = el.querySelector('.product-title')?.innerText;
          const precio = el.querySelector('.price')?.innerText;

          if (nombre && precio) {
            productos.push({
              nombre,
              precio: parseFloat(precio.replace(/[^0-9.]/g, '')),
              tienda: "home_depot"
            });
          }
        }
      });

      return productos;
    });

    await page.close(); 

    return resultados;

  } catch (error) {
    console.error("Error scraping:", error);
    return [];
  }
};


// ==============================
// COMPARADOR
// ==============================
const compararPrecios = (precios) => {
  if (!precios || precios.length === 0) return null;

  const ordenados = [...precios].sort((a, b) => a.precio - b.precio);

  return {
    mas_barato: ordenados[0],
    mas_caro: ordenados[ordenados.length - 1]
  };
};


// ==============================
// LIMPIEZA PROGRAMADA
// ==============================
setInterval(async () => {
  try {
    await PrecioHistorial.deleteMany({
      fecha: { $lt: new Date(Date.now() - (1000 * 60 * 60 * 24)) }
    });
    console.log("Cache DB limpiado");
  } catch (error) {
    console.error("Error limpiando cache:", error);
  }
}, 1000 * 60 * 60); // cada hora


// ==============================
// OBTENER PRECIOS
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
    setTimeout(() => cacheMemoria.delete(key), CACHE_TIEMPO);

    return {
      precios: datos,
      comparacion: compararPrecios(datos),
      cache: "database"
    };
  }

  // SCRAPING CON RETRY
  let resultados = await scrapingHomeDepot(nombre);

  if (resultados.length === 0) {
    console.log("Fallback a historial...");

    const historial = await PrecioHistorial
      .find({ nombre, zona })
      .sort({ fecha: -1 })
      .limit(5);

    resultados = historial.map(h => ({
      nombre: h.nombre,
      precio: h.precio,
      tienda: h.tienda
    }));
  }

  // GUARDAR DB
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
  obtenerPrecios,
  compararPrecios
};