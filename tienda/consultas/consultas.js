const pool = require('../database/conexion')
const format = require("pg-format")


const getProducts = async ({ limits = 5, page = 1, order_by = "id_asc" }) => {
    const [campo, direccion] = order_by.split("_");
    const offset = limits * (page - 1); //revisar esto si no funciona
    const { rows: joyas } = await pool.query(format('SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s', campo, direccion, limits, offset));
    return joyas
}

const getHATEOAS = (joyas) => {
    const results = joyas.map(joya => ({
        id: joya.id,
        nombre: joya.nombre,
        categoria: joya.categoria,
        metal: joya.metal,
        precio: joya.precio,
        stock: joya.stock,
        url: `/joyas/joya/${joya.id}`,
    }));

    const totalJoyas = 20
    const totalJoyasxPage = results.length
    const paginacion = `${page} de ${Math.ceil(totalJoyas / totalJoyasxPage)}`


    const HATEOAS = {
        totalJoyas,
        totalJoyasxPage,
        page,
        paginacion,
        results
    }

    return HATEOAS;

};

const getJoya = async (id) => {
    const { rows } = await pool.query("SELECT * FROM inventario WHERE id=$1", [id])
    return rows[0]
}


const joyasFiltro = async (querystring) => {
    let filtros = [];
    let values = [];

    const agregarFiltro = (campo, comparador, valor) => {
        values.push(valor);
        const { length } = filtros;
        filtros.push(`${campo} ${comparador} $${length + 1}`);
    };

    const { nombre, precio_max, precio_min, categoria, metal, stock_max, stock_min } = querystring;

    if (precio_max) agregarFiltro("precio", "<=", precio_max);
    if (precio_min) agregarFiltro("precio", ">=", precio_min);
    if (categoria) agregarFiltro("categoria", "ilike", `%${categoria}%`);
    if (metal) agregarFiltro("metal", "ilike", `%${metal}%`);
    if (nombre) agregarFiltro("name", "ilike", `%${nombre}%`);
    /* if(stock_max) agregarFiltro('stock', '<=', stock_max)
    if(stock_min) agregarFiltro('stock', '>=', stock_min) */

    let consulta = "SELECT * FROM inventario";
    if (filtros.length > 0) {
        consulta += " WHERE " + filtros.join(" AND ");
    }

    const { rows: joyas } = await pool.query(consulta, values);
    return joyas;

};



module.exports = {
    getProducts,
    getHATEOAS,
    joyasFiltro,
    getJoya
}