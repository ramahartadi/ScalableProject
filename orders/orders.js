require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const amqp = require("amqplib/callback_api");

// Connect
require("../db/db");

const Order = require("./Order");

amqp.connect(
    "amqps://dvsnkhgq:ULdh0ha7hNaz_NcLL5uVpBCfOaVzXoLb@armadillo.rmq.cloudamqp.com/dvsnkhgq",
    (error0, connection) => {
        if (error0) {
            throw error0;
        }

        connection.createChannel((error0, Channel) => {
            if (error0) {
                throw error0;
            }
            const app = express();
            const port = 9000;
            app.use(express.json());

            app.get("/orders", (req, res) => {
                Order.find()
                    .then((orders) => {
                        if (orders) {
                            res.json(orders);
                        } else {
                            res.status(404).send("Orders not found");
                        }
                    })
                    .catch((err) => {
                        res.status(500).send("Internal Server Error!");
                    });
            });

            app.post("/order", (req, res) => {
                const newOrder = {
                    customerID: req.body.customerID,
                    bookID: req.body.bookID,
                    initialDate: req.body.initialDate,
                    deliveryDate: req.body.deliveryDate,
                };
                console.log("order dikirim");
                console.log(newOrder);
                Channel.sendToQueue(
                    "order_created",
                    Buffer.from(JSON.stringify(newOrder))
                );
                return res.send("order dikirim");
            });

            app.get("/order/:id", (req, res) => {
                Order.findById(req.params.id)
                    .then((order) => {
                        if (order) {
                            axios
                                .get(
                                    `http://localhost:5000/customer/${order.customerID}`
                                )
                                .then((response) => {
                                    let orderObject = {
                                        CustomerName: response.data.name,
                                        BookTitle: "",
                                    };

                                    axios
                                        .get(
                                            `http://localhost:3000/book/${order.bookID}`
                                        )
                                        .then((response) => {
                                            orderObject.BookTitle =
                                                response.data.title;
                                            res.json(orderObject);
                                        });
                                });
                        } else {
                            res.status(404).send("Orders not found");
                        }
                    })
                    .catch((err) => {
                        res.status(500).send("Internal Server Error!");
                    });
            });

            app.listen(port, () => {
                console.log(
                    `Up and Running on port ${port} - This is Order service`
                );
            });
            process.on("beforeExit", () => {
                console.log("closing");
                connection.close();
            });
        });
    }
);
