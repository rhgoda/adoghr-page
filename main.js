import path from 'path'
import expressSubdomain from 'express-subdomain'
import express from 'express'
import { readdir, access } from 'node:fs/promises'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import http from 'http'
import https from 'https'
import routerConfig from './router-config.json' assert { type: 'json' } //config
import vhost from 'vhost'
import util from 'util'
import connect from 'connect'

const __dirname = dirname(fileURLToPath(import.meta.url));

async function formPath(module) { //ostorozhno govnokod - finding the router file
    const files = await readdir(path.join(__dirname, `/modules/${module}`));
    let index
    if ( files.includes('index.mjs') ) {
        index = 'index.mjs'
    } else if( files.includes('index.cjs') ) {
        index = 'index.cjs'
    } else if ( files.includes('index.js') ) {
        index = 'index.js'
    } else {
        throw new Error('No index js file: ' + module)
    }
    let prefix = 'file://' //windows file url
    return prefix + path.join(__dirname, `/modules/${module}/${index}`)
}

async function loadModule(app, module) { //add a module subdomain //the main req handler
    if (!routerConfig.exceptions.includes(module)) {
        let module_path = await formPath(module)
        let routerModule = await import(module_path)
        //console.log(routerModule)
        app.use(expressSubdomain(module, routerModule.default));//use imported router
    }
}

async function loadModules(app) { //load folder modules
    try {
        let homeModule = await import(await formPath(routerConfig.homepageFolder)) //можно добавлять хомпеж как субдомен и не парсить его отдельно

        app.use('/', function (req, res, next) { //main req handler
            if (req.subdomains.length > 0) {
                return next(); //pass to app
            } else {
               return homeModule.default(req, res, next); //pass to homepage
            }
        });

        const files = await readdir(path.join(__dirname, '/modules'));
        for (let filename of files){ 
            if(!(routerConfig.homepageFolder === filename)){
                await loadModule(app, filename)
            }
        }

        app.use('*',function(req, res, next) {
            if (req.subdomains.length > 0) {
                res.send('subdomain notfound'); // undefined subdomain
            } else {
                next(); // let the app handle the notfound
            }
        });

    } catch (err) {
        console.error(err);
    }
}

//run
//node --experimental-json-modules ./main.js
let main = express()
let dogspinning = express()
let app = express()

let porthttp = 80;
let porthttps = 443;

dogspinning.use(vhost('dogspinning.com', function handle (req, res, next) {
    // for match of "foo.bar.example.com:8080" against "*.*.example.com":
    res.send('penis')
}))

await loadModules(main)

app.use(vhost('*.adoghr.ru', main))
app.use(vhost('dogspinning.com', dogspinning))

http.createServer(app).listen(porthttp);
https.createServer({}, app).listen(porthttps);