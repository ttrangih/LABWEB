require("dotenv").config(); 

const express = require("express");
const app = express();

app.use(express.json());

// RAW SQL routes
app.use("/users-sql", require("./routes/users.sql"));
app.use("/products-sql", require("./routes/products.sql"));
app.use("/carts-sql", require("./routes/carts.sql"));

// ORM routes
app.use("/users-orm", require("./routes/users.orm"));

app.get("/", (req, res) => res.send("LAB5 OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

app.use("/email", require("./routes/email"));
app.use("/upload", require("./routes/upload"));
app.use("/fetch-api", require("./routes/fetchApi"));

//xem ảnh
app.use("/uploads", require("express").static("uploads"));

//swagger
const swaggerUi = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const path = require("path");

const swaggerPath = path.join(__dirname, "swagger.yaml");
const swaggerDoc = YAML.parse(fs.readFileSync(swaggerPath, "utf8"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

