import app from "./server.js";

const handleListening = () => 
    console.log(`Server listening on port`);
app.listen(app.get('port'), handleListening);