const requestSchema = new Schema({
  status: ["delivered", "shipped", "pending", "picked", "distributed"],
});
