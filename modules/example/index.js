import express from "express"
import router from "./router.js"

let app = express()

app.use(router)


app.listen(80)
app.listen(443)