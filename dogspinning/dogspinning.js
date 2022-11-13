import express from "express";
import path from 'path'
import { fileURLToPath } from 'url';
import fs from 'fs'
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let router = express.Router()

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, './index.html'))
});

router.get('*', (req, res) => {
    let reqpath = path.join(__dirname, req.url.replace('..', ''));
    fs.promises.access(reqpath, fs.constants.F_OK)
        .then(() =>
            res.sendFile(reqpath)
        )
        .catch(() => {
            res.status(404);
        })
})

export default router

