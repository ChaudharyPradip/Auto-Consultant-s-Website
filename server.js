const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./connectDB");
const Car = require("./models");
const uuid4 = require("uuid4");
const fileUploader = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("./dist"));
app.use(fileUploader({ useTempFiles: true }));

const uploadImage = async (imagePath) => {
    // Use the uploaded file's name as the asset's public ID and
    // allow overwriting the asset with new versions
    const options = {
        use_filename: true,
        unique_filename: true
    };

    try {
        // Upload the image
        const result = await cloudinary.uploader.upload(imagePath, options);
        return result.secure_url;
    } catch (error) {
        console.error(error);
    }
};

app.get("/api/", async (req, res) => {
    let cars = await Car.find();
    res.json({ status: "200", cars });
});

app.get("/api/:id", async (req, res) => {
    let car = await Car.find({ _id: req.params.id });
    res.json({ status: "200", car });
});

app.post("/api/", async (req, res) => {
    const data = { Images: [] };
    for (el in req.body) {
        data[el] = req.body[el];
    }

    if (Array.isArray(req.files.images)) {
        for (image of req.files.images) {
            let url = await uploadImage(image.tempFilePath);
            data["Images"].push(url);
        }
    } else {
        let url = await uploadImage(req.files.images.tempFilePath);
        data["Images"].push(url);
    }

    let car = new Car(data);

    car.save();

    res.json({ status: "200", message: "Car added successfully" });
});

connectDB();
app.listen(5000, function () {
    console.log("Server running on port 5000");
});
