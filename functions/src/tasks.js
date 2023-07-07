import { FieldValue } from "firebase-admin/firestore";
import db from "./dbConnect.js";

const coll = db.collection("tasks");

export async function getTasks(req, res) {
    const { uid } = req.params;
    const tasks = await coll.where('uid', '==', uid).get(); //get all tasks by user
    const taskArray = tasks.docs.map(doc => ({ id: doc.id, ...doc.data() })); //arranges tasks in an array 
    res.send(taskArray);
}

export async function addTask(req, res) {
    const {title, uid} = req.body;
    if(!title || !uid) {
        res.status(401).send({ success: false, message: 'Not a valid request'});
        return;
    }
    // Create a document with the following field values in it
    const newTask = {
        title, uid, done: false,
        createdAt: FieldValue.serverTimestamp()
    }
    await coll.add(newTask);
    res.status(201).send({ success: true, message: 'Item Added'});
}