import express from "express"
import router from "./router.js"
import http from "http"
import https from  "https"

let app = express()

app.use(router)


http.createServer(app).listen(porthttp);
https.createServer({}, app).listen(porthttps);