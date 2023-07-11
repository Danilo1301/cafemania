import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const sharedsession = require("express-socket.io-session");

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server();
const port = 3000;

const session = sessions({
  secret: "secret_gaj24dgj18lq367",
  saveUninitialized:true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  resave: false 
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session);

io.use(sharedsession(session));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(function(req, res, next) {
  var session = req.session;

  if(!session["sessionid"]) {
    session["sessionid"] = uuidv4();
  }

  next();
});


app.use(express.static(path.join(__dirname, "..", "..", "public")));

io.attach(server, {
    //path: '/socket',
    cors: { origin: '*' }
});

server.listen(port, "0.0.0.0", () => console.log(`[index.ts] express web server started: http://localhost:${port}`));

//

console.log(`[index.ts] loading geckos`);

import '@geckos.io/phaser-on-nodejs'
global['phaserOnNodeFPS'] = 5

import { MasterServer } from './masterServer/masterServer';
import { Debug } from '../shared/debug/debug';

Debug.useConsoleFormat = false;

const masterServer = new MasterServer(io);
masterServer.start();

/*
TODO:

Add MainScene
Completely change how PlayerTexture Factory & Generator works
(maybe) Add point detection in floors and walls to increase performance
*/