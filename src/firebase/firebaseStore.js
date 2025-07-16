import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteField,
  updateDoc,
  deleteDoc,
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
      ownerId: userId,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    throw new Error("Failed to add room, please try again");
  }
};

export const getRoomsData = async (uid) => {
  try {
    const roomQuery = query(
      collection(db, "rooms"),
      where("ownerId", "==", uid)
    );
    const querySnapshot = await getDocs(roomQuery);

    const rooms = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return rooms;
  } catch (error) {
    console.error("Failed to get user rooms", error);
  }
  return [];
};

export const getRoomById = async (roomId) => {
  try {
    const docRef = doc(db, "rooms", roomId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Room not found");
    }
  } catch (error) {
    console.error("Error whilst fetching Room", error);
    throw error;
  }
};

export const patchRoomLayout = async (roomId, layout) => {
  const roomRef = doc(db, "rooms", roomId);

  try {
    await updateDoc(roomRef, {
      layout: layout,
      furniturePositions: deleteField(),
    });
    console.log("Room layout updated");
  } catch (error) {
    console.error("Failed to update room layout", error);
  }
};

export const deleteRoomById = async (roomId) => {
  try {
    await deleteDoc(doc(db, "rooms", roomId));
  } catch (error) {
    console.error("Error whilst deleting room", error);
    throw error;
  }
};
