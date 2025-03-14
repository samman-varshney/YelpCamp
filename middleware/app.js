const express = require('express');
const app = express();
const morgan = require('morgan');
//app.use(() => console.log('hey there!'));


// app.use((req, res, next) => {
//     console.log(req.query);
//     const { islogged } = req.query;
//     console.log(islogged);
//     if (islogged === 'true') {
//         next();
//     } else {
//         res.send("hey! your not a authentic user first verify yourself");
//     }
// })


const AppError = require("./error.js");
const isVerified = (req, res, next) => {

    const { islogged } = req.query;
    if (islogged === "true") {
        next();
    }
    else {
        res.status(404);
        throw new AppError(" bhenchood tere ko access nhi hai, fir kyu a jata hai mu uthaye", 401);
    }
}
// app.use((req, res, next) => {
//     console.log("blocked");
// })
app.get('/home', (req, res) => {
    res.send("this is new home page")
})


app.get("/multiverse", isVerified, (req, res) => {
    samman.name();
    res.send("this is multiverse");
})
app.use((req, res) => {
    res.status(404).send("Not found");
})
app.use((err, req, res, next) => {
    const { message = "bhai kuch lafda ho gya hai idhar tum jara ruk", status = 500 } = err;
    res.status(status).send(message);
})
app.listen(3000, () => console.log('serving on port 3000.'));
