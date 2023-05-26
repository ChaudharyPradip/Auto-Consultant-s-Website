const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
    {
        Name: {
            type: String
        },
        Images: {
            type: []
        }
    },
    { strict: false }
);

module.exports = mongoose.model("Car", carSchema);
