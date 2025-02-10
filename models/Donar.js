const donateSchema = new Schema({
  address: String,
  paymentMethod: ["credit", "bank", "mobile"],
});
// saves donates in the db
// user can donate without creating an account
