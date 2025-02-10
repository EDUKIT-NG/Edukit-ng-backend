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

// create a sign up function with different options to select from ie: sponsor, student, volunteer
// if user has an account and logins in first check the role then direct him to his dashboard
