const app = require("express")();

app.listen(process.env.PORT, () => 
    console.log("Server started !")
);

module.exports = app;