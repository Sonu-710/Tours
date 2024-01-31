const morgan = require(`morgan`);
const express = require("express");
const app = express();
const toursRouter = require("./starter/router/tours");
const userRouter = require("./starter/router/users");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(`./starter/public`));
// app.use((req, res, next) => {
//   console.log("Hello from the middleware");
//   next();
// });
app.use((req, res, next) => {
  req.time = new Date();
  next();
});

// app.get("/api/v1/tours", getAllTours());
// app.post("/api/v1/tours", createTour());

// app.get("/api/v1/tours/:id", getTour());
// app.patch("/api/v1/tours/:id", updateTour());
// app.delete("/api/v1/tours/:id", deleteTour());

app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", userRouter);
module.exports = app;
