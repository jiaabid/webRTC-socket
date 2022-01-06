const {httpServer,app} = require('./app')
const {ExpressPeerServer} = require('peer')
const peerServer = ExpressPeerServer(httpServer,{
    path:'/'
});

app.use(peerServer);
peerServer.on('connection', (client) => { console.log('client',client.id) });
httpServer.listen(5000, () => console.log("server started"));