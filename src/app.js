import express from 'express';
import cookieParser from 'cookie-parser';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { logger } from './utils/logger.js';


//Ruta para las vistas
import viewsRouter from './routes/views.router.js';

//import usersRouter from './routes/users.routes.js';
//import sessionRouter from "./routes/sessions.routes.js";
import jwtRouter from "./routes/jwt.routes.js";

//import productfsRouter from "./routes/productsfs.routes.js";
import productRouter from "./routes/products.routes.js";
//import cartsfsRouter from "./routes/cartsfs.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import messageRouter from "./routes/messages.routes.js";
import {Server} from "socket.io";
//import { cartManager } from "./daos/fsManager/CartManager.js";
//import { ProductManager,  Producto} from "./daos/fsManager/ProductManager.js";
import {password, PORT, db_name} from './.env.js';
import methodOverride from "method-override";
//import mongoose, { Mongoose } from 'mongoose';
import messagesDao from "./daos/dbManager/messages.dao.js";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";

import session from "express-session";
//import FileStore from 'session-file-store';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';

import passport from 'passport';
import initializePassport from './config/passport.config.js';




const app = express();

app.use(cookieParser());

app.use(logger);

// `mongodb+srv://mcamposinfocam:${password}@cluster0.alvwu9f.mongodb.net/${db_name}?retryWrites=true&w=majority`)
//const MONGO_URL = "mongodb://localhost:27017/clase19?retryWrites=true&w=majority";
const MONGO_URL =  `mongodb+srv://mcamposinfocam:${password}@cluster0.alvwu9f.mongodb.net/${db_name}?retryWrites=true&w=majority`;

// Configuracion de Session
app.use(session(
    {
        //ttl: Time to live in seconds,
        //retries: Reintentos para que el servidor lea el archivo del storage.
        //path: Ruta a donde se buscará el archivo del session store.
        // // Usando --> session-file-store
//        store: new FileStore({ path: "./sessions", ttl: 15, retries: 0 }),

        // Usando --> connect-mongo
         store: MongoStore.create({
            mongoUrl: MONGO_URL,
            //mongoOptions --> opciones de confi para el save de las sessions
            mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
            ttl: 10 * 60
        }), 

        secret: "coderS3cr3t",
        resave: false, // guarda en memoria
        saveUninitialized: true //lo guarda a penas se crea
    }
)) 

initializePassport();
app.use(passport.initialize());
app.use(passport.session());



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

//app.engine('handlebars', handlebars.engine());

//Inicializndo el motor
app.engine(
    "hbs",
    handlebars.engine({
        extname: "hbs",
        defaultLayout: "main",
        layoutsDir: __dirname+"/views/layouts",
        partialsDir:__dirname+"/views/partials",
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
          },
    })
  );
  //Indico que el motor inicializad
  app.set("view engine", "hbs");


app.set('views', __dirname + '/views')


app.use('/', viewsRouter)

//console.log("Definicion de Ruta a productos");
//app.use("/api/productsfs", productfsRouter);
app.use("/api/products", productRouter);

//console.log("Definicion de rutas a Carts");
//app.use("/api/cartsfs", cartsfsRouter);
app.use("/api/carts", cartsRouter);

// Definicion de rutas para el chat
app.use("/api/messages", messageRouter);

//Definicion de rutas para login y register
//app.use('/api/sessions', sessionRouter);
app.use('/api/jwt', jwtRouter);


//const PORT = 9090
app.listen(PORT, () => {
    console.log(`Server run on port: ${PORT}`);
})

/*=============================================
=            connectMongoDB                   =
=============================================*/
const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URL)
        console.log("Conectado con exito a la DB usando Mongoose!!");
    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
}
connectMongoDB();