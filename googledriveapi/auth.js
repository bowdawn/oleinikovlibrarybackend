
import dotenv from "dotenv"
import googleapis from "googleapis"
dotenv.config()
const {google} = googleapis

//Service account key file
const KEYFILE= process.env.KEY_FILE

const privatekey = JSON.parse(
  Buffer.from(KEYFILE, "base64").toString()
);
 

// configure a JWT auth client
let jwtClient = new google.auth.JWT(
  privatekey.client_email,
  null,
  privatekey.private_key,
  [
   'https://www.googleapis.com/auth/drive',
   ]);
//authenticate request
jwtClient.authorize(function (err, tokens) {
if (err) {
console.log(err);
return;
} else {
console.log("Successfully connected!");
}
});
const driveService = google.drive({version: 'v3' , auth:jwtClient})

export default driveService