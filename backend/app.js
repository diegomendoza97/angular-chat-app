const express = require('express');
const bodyParser = require('body-parser');
const { Server } = require('ws');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = express();

const userRoutes = require('./routes/userRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
    failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Hello World',
        version: '1.0.0',
      },
    },
    apis: ['app.js'],
  };
const swaggerSpec = swaggerJsdoc(options);

dotenv.config();
const MONGO_DB_URI = `mongodb+srv://chat-app-user:${process.env.DB_PASSWORD}@chat-app.dr1avgu.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to Mongo');
})
.catch( err => console.log(err));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const messages = ['Hello'];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

const messagesSocket = new Server({ port: 443});

messagesSocket.broadcast = function broadcast(msg) {
    messagesSocket.clients.forEach((client) => {
        client.send(JSON.stringify([msg]));
     });
 };


messagesSocket.on('connection', (ws) => {
    console.log('New Client Connected');
    ws.on('message', (data) => {
        const msg = JSON.parse(data);
        messages.push(msg);
        console.log(messages)
        messagesSocket.broadcast(msg);
    });
    ws.on('close', () => console.log( 'Client disconnected'));
});


app.get('', (req, res) => {
    return res.send('Hello World');
});

app.get('/api/messages', (req, res) => {
    res.send(messages);
});


app.use('/api/users', userRoutes);



app.listen(8080, () => {
    console.log('Server started on port 8080');
});