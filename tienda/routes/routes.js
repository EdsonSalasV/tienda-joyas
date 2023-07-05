const express = require('express');

const router = express.Router();
const {getProducts, getHATEOAS, joyasFiltro, getJoya} = require('../consultas/consultas');
const mostrarConsulta = require('../middleware/middleware')



router.get('/', mostrarConsulta, (req,res)=>{
    res.send("uwu mundo")
})

router.get('/joyas', mostrarConsulta, async (req,res)=>{
    try {
        const consultas = req.query
        page = +req.query.page || 1
        const joyas = await getProducts(consultas)
        const HATEOAS = getHATEOAS(joyas, page)
        res.json(HATEOAS)
    } catch (error) {
        console.log(error)
    }
})

router.get('/joyas/joya/:id', mostrarConsulta, async (req,res)=>{
    try {
        const id= req.params.id
        const joyas=await getJoya(id)
        res.json(joyas)
    } catch (error) {
        console.log(error)        
    }
})


router.get('/joyas/filtros', mostrarConsulta, async (req,res)=> {
    try {
        const consulta = req.query
        const joyas = await joyasFiltro(consulta)
        res.json(joyas)
    } catch (error) {
        console.log(error)
    }
})

module.exports= router
