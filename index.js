require("dotenv").config();

require("./services/database");
const app = require("./services/server");

app.use("/",
    require("./api/stock.api"),
    require("./api/detector.api"),
    require("./api/line.api"),
    require("./api/station.api"),
    require("./api/train.api"),
    require("./api/user.api")
);