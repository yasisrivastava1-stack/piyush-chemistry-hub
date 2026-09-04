import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const app = initializeApp({ projectId: "demo-test" });
try {
  const db = initializeFirestore(app, { experimentalForceLongPolling: true }, "my-db");
  console.log("Success", !!db);
} catch (e) {
  console.error("Error:", e.message);
}
