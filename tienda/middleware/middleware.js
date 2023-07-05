const mostrarConsulta = (req, res, next) => {
    const url = req.url;
    const method = req.method;
    console.log(`consulta en ${url} y por el metodo ${method}`); 
    next();
}

module.exports= mostrarConsulta