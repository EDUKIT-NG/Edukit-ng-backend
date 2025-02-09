// functional requirement

import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  role: ["Students", "Schools", "partners", "Donors", "Volunteer", "Admin"],
});

// Auth
const User = mongoose.models("User", userSchema);
export default User;

//
const resourceSchema = new Schema({
  total: Number,
  status: ["delivered", "shipped"],
  needsCategory: ["books", "uniform", "learning resources"],
  quantities: Number,
  description: String,
  condition: String,
  methodOfDelivery: ["pickup", "ship"],
  pickUpDetails: String,

  // Volunteer roles for the materials supplied
  role: ["collection", "sorting", "distribution"],
});
// admin will view resources, transactions, users
// save updated admin database
//can generate reports

const requestSchema = new Schema({
  status: ["delivered", "shipped", "pending", "picked", "distributed"],
});

// OTP
const otpSchema = new Schema({
  otp: Number,
});
// expires after 120sec
// generate otp after clicking submit button on sign up
// resend otp when the other one has expired
// notifications send to user emails within 5 sec
// generate random otp numbers  4 in number

// forgot password
//  reset the password using email
// sends 6 digit number random to the email
// compare the sent digits and the entered
// creates another password after success verification code
// saves the new password on the db

// impact metrics section
const metricSchema = new Schema({
  total: Number,
});

const studentProfileSchema = new Schema({
  fullName: String,
  age: Number,
  gender: String,
  address: String,
  schoolName: String,
  class: Number,
  schoolType: String,
  schoolLocation: String,
  schoolContact: String,
  parentOccupation: String,
  noOfSiblings: Number,
  resourceNeed: String,
  reason: String,
  otherSupport: ["scholarships", "donations"],
  supportReceived: String,
  whyConsidered: String,
  howResourceWillHelp: String,
  communityContribution: String,
  goals: String,
  otherInfo: String,
});
// save updated students info
// can view resources, request a resource, join communities, chat
// validation

const schoolProfileSchema = new Schema({
  schoolName: String,
  address: String,
  email: String,
  students: Number,
  address: String,
  contact: String,
  document: String,
});
// save updated info
// request resource
// save quantities, resource type

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

const donateSchema = new Schema({
  address: String,
  paymentMethod: ["credit", "bank", "mobile"],
});
// saves donates in the db
// user can donate without creating an account

// signup
// select type of user
// if email exits prompt to login
// unique emails and username

// login after confirming the email
// user can login with username/email and password
// if user not found redirected to sign up
// success login user is directed to dashboard

// user can logout
// can also delete account

// two-factor authentication
// can use google, facebook,
// take name, email and profile pic from the social media signed up with
// save the user on the database
// can log in using social media accounts
// if user is found directs to dashboard if none create one
// under 3 sec

// session timeout and account lockout

// save to db
// no of books collected, school supplies, transactions, donations
// no of students received resources
// no of volunteers, partners, community events, contributed financial

// community
// chat room
// user can join communities group
// volunteers can joni communities

// booking sessions
// mentor, counseling, scholarships, online tutors

// send response after every successful thing
// delivered, picked send through email or sms

// all users can view the testimonial sections

// donor can view other donations

// delete already done events from the db and all delivered items
