import express from "express";

let router = express.Router()

router.get('/', function(req, res, next) {
    res.sendFile('./index.js')
});

router.get('/dogpinning.gif', function(req, res, next) {
    res.sendFile('./dogspinning.gif')
});

export default router

