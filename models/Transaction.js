// payment process
const currencySchema = new Schema({
  currency: ["$", "KSHs"],
  amount: Number,
  minAmount: String,
});

const transactionSchema = new Schema({
  send: Number,
});
// transactions are saved on the db either received or sent
// after saving a transaction generate a receipt and send it to the user
