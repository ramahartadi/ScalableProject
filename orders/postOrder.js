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

        connection.createChannel((error1, Channel) => {
            if (error1) {
                throw error1;
            }

            Channel.assertQueue("order_created", { durable: false });

            const app = express();
            const port = 9001;
            app.use(express.json());

            Channel.consume(
                "order_created",
                (msg) => {
                    console.log("order diterima");
                    const eventOrder = JSON.parse(msg.content.toString());

                    const newOrder = new Order({
                        customerID: mongoose.Types.ObjectId(
                            eventOrder.customerID
                        ),
                        bookID: mongoose.Types.ObjectId(eventOrder.bookID),
                        initialDate: eventOrder.initialDate,
                        deliveryDate: eventOrder.deliveryDate,
                    });
                    console.log(newOrder);
                    newOrder
                        .save()
                        .then(() => {
                            console.log("New Order created successfully!");
                        })
                        .catch((err) => {
                            console.log(500).send("Internal Server Error!");
                        });
                },
                { noAck: true }
            );

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
