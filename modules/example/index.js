import express from "express";

let router = express.Router()

router.get('/', function(req, res, next) {
    res.send('example page')
});

export default router
