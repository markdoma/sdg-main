// api.js
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

// Initialize Firebase app
const firebaseConfig = {
  // Your Firebase configuration
};

// Check if Firebase app is already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const apiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    if (req.query.type === "mwgList") {
      try {
        const mwgList = [];
        const querySnapshot = await getDocs(collection(getFirestore(), "MWGs"));
        querySnapshot.forEach((doc) => {
          mwgList.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(mwgList);
      } catch (error) {
        console.error("Error fetching MWG list:", error);
        res.status(500).json({ error: "Failed to fetch MWG list" });
      }
    } else if (req.query.type === "membersList") {
      const mwgId = req.query.mwgId;
      try {
        const membersList = [];
        const querySnapshot = await getDocs(
          collection(getFirestore(), "MWGs", mwgId, "members")
        );
        querySnapshot.forEach((doc) => {
          membersList.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(membersList);
      } catch (error) {
        console.error("Error fetching members list:", error);
        res.status(500).json({ error: "Failed to fetch members list" });
      }
    }
  } else if (req.method === "PUT") {
    const { mwgId, memberId } = req.query;
    const { present } = req.body;
    try {
      const memberDocRef = doc(
        getFirestore(),
        "MWGs",
        mwgId,
        "members",
        memberId
      );
      await updateDoc(memberDocRef, { present });
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error updating member presence:", error);
      res.status(500).json({ error: "Failed to update member presence" });
    }
  } else if (req.method === "POST") {
    try {
      const { name, birthday, address, invitedBy } = req.body;
      const newAttendee = {
        name,
        birthday,
        address,
        invitedBy,
      };
      const newAttendeeRef = await addDoc(
        collection(getFirestore(), "attendees"),
        newAttendee
      );
      res.status(200).json({ id: newAttendeeRef.id, ...newAttendee });
    } catch (error) {
      console.error("Error creating new attendee:", error);
      res.status(500).json({ error: "Failed to create new attendee" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default apiHandler;
