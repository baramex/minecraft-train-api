const bodyParser = require("body-parser");
const CustomError = require("./util");

const app = require("express")();

app.listen(process.env.PORT, () =>
    console.log("Server started !")
);

app.use((req, res, next) => {
    try {
        const { headers: { authorization } } = req;
        if (!authorization) throw new CustomError("Unauthorized", 401);
        const [type, token] = authorization.split(" ");
        if (type !== "Basic") throw new CustomError("Unauthorized", 401);
        if (token !== process.env.API_KEY) throw new CustomError("Unauthorized", 401);
        next();
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});
app.use(bodyParser.json());

app.use("/",
    require("../api/stock.api"),
    require("../api/detector.api"),
    require("../api/line.api"),
    require("../api/station.api"),
    require("../api/train.api"),
    require("../api/user.api")
);

module.exports = app;