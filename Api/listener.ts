import express, { Application } from 'express';
import bodyParser from 'body-parser';

// CORS
import cors from 'cors';

// Infraestructura
import Database from './db.connection';
// Enrutamiento
let Rutas = require('./routes');

class Listener 
{

    public App : Application;

    private CorsConfig = {
        origin: "localhost:3000"
    }

    constructor()
    {
        Database.TryConnect();
        this.App = express();
        this.config();
    }

    config() : void
    {
        this.App.use(bodyParser.urlencoded({extended: true}) );
        this.App.use(bodyParser.json());

        this.App.use(cors());
        this.App.use('/api', Rutas);
    }

}

export default new Listener().App;