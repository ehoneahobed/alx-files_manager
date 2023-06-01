const express = require("express");
const routes = require("./routes/index");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
routes(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
