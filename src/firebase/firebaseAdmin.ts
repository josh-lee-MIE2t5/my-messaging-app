import admin from "firebase-admin";
import serviceAccount from "../../my-messaging-app-556dd-firebase-adminsdk-kylyw-7e9faec531.json";

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(JSON.stringify(serviceAccount)),
});
export default firebaseAdmin;
