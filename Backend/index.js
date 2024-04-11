const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const ConnectToMongo = require('./Database');
dotenv.config();
const app = express();
const port = process.env.PORT;

ConnectToMongo();

app.use(bodyParser.json({limit:"10mb"}))
app.use(cors());
app.use(express.json());

app.post('/', (req, res) => {
    res.json("Server running");  
})
app.use("/api/user",require('./Routes/User'));
app.use("/api/conversation",require("./Routes/Conversation"))
app.use("/api/groups",require("./Routes/Groups"))


app.listen(port,()=>{
    console.log(`Server Running on port ${port}`)
})