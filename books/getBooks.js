require("dotenv").config();
const express = require("express");
const axios = require("axios");

// Connect
require("../db/db");

const app = express();
const port = 3001;
app.use(express.json());

app.get("/books", (req, res) => {
    const options = {
        method: "GET",
        url: "https://book4.p.rapidapi.com/",
        headers: {
            "X-RapidAPI-Host": "book4.p.rapidapi.com",
            "X-RapidAPI-Key":
                "dc95e60defmsheacb286f2535da2p1673c2jsnb437a09f2972",
        },
    };

    axios
        .request(options)
        .then(function (response) {
            res.json(response.data);
        })
        .catch(function (error) {
            res.status(500).send("Internal Server Error!");
        });
});

app.listen(port, () => {
    console.log(`Up and Running on port ${port} - This is Book service`);
});
