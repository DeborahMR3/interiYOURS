import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  addDoc
} from "firebase/firestore";
import app from "./firebase.config";

export const db = getFirestore(app);

export const addUserToFirestore = async (user) => {
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    createdAt: serverTimestamp(),
  });
};

export const getUserData = async (uid) => {
  const docSnap = await getDoc(doc(db, "users", uid));
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return { error: "User not found" };
  }
};

export const addRoomToFireStore = async (userId, roomData) => {
  try {
    const docRef = await addDoc(collection(db, "rooms"), {
      ...roomData,
      userId,
      createdAt: serverTimestamp(),
    });
    return docRef.id
  } catch (error) {
    throw new Error("Failed to add room, please try again")
  }
}