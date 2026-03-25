import express from "express";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(express.json());

const FILE = "users.json";

// 1. Add User
app.post("/user", (req, res) => {
  const data = fs.readFileSync(FILE, "utf-8");
  const users = JSON.parse(data);

  const { name, age, email } = req.body;

  // Check email exists
  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const newUser = {
    id: Date.now(),
    name,
    age,
    email,
  };

  users.push(newUser);

  fs.writeFileSync(FILE, JSON.stringify(users, null, 2));

  res.json(newUser);
});


// 2. Update User
app.patch("/user/:id", (req, res) => {
  const data = fs.readFileSync(FILE, "utf-8");
  const users = JSON.parse(data);

  const id = Number(req.params.id);

  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[index] = { ...users[index], ...req.body };

  fs.writeFileSync(FILE, JSON.stringify(users, null, 2));

  res.json(users[index]);
});


// 3. Delete User
app.delete("/user/:id", (req, res) => {
  const data = fs.readFileSync(FILE, "utf-8");
  const users = JSON.parse(data);

  const id = Number(req.params.id);

  const filteredUsers = users.filter((u) => u.id !== id);

  fs.writeFileSync(FILE, JSON.stringify(filteredUsers, null, 2));

  res.json({ message: "User deleted successfully" });
});


// 4. Get All Users
app.get("/user", (req, res) => {
  const data = fs.readFileSync(FILE, "utf-8");
  const users = JSON.parse(data);

  res.json(users);
});


// 5. Get User by ID
app.get("/user/:id", (req, res) => {
  const data = fs.readFileSync(FILE, "utf-8");
  const users = JSON.parse(data);

  const id = Number(req.params.id);

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});


// Run server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


// 1. What is the Node.js Event Loop?
// The Event Loop is the core mechanism in Node.js that allows it to perform non-blocking I/O operations. 
// It continuously checks the call stack and the callback queue, 
// and executes tasks when the stack is empty.

// 2. What is Libuv and What Role Does It Play in Node.js?
// Libuv is a C library that provides Node.js with an event loop and asynchronous I/O capabilities. 
// It handles operations like file system access, 
// networking, and manages the thread pool.

// 3. How Does Node.js Handle Asynchronous Operations Under the Hood?
// Node.js delegates asynchronous tasks (like file reading or network requests) to Libuv. 
// Once the task is completed, Libuv pushes the callback into the event queue, 
// and the event loop executes it when the call stack is empty.

// 4. What is the Difference Between the Call Stack, Event Queue, and Event Loop?
// Call Stack: Executes synchronous code.
// Event Queue: Holds callbacks from asynchronous operations.
// Event Loop: Moves callbacks from the queue to the stack when it's empty.


// 5. What is the Node.js Thread Pool and How to Set the Thread Pool Size?
// The thread pool is a group of worker threads used by Node.js (via Libuv) to handle heavy operations like file system tasks.
// By default, it has 4 threads.


// 6. How Does Node.js Handle Blocking and Non-Blocking Code Execution?
// Blocking code: Executes sequentially and stops the program until finished.
// Non-blocking code: Executes asynchronously, allowing other operations to run without waiting.
// Node.js prefers non-blocking operations for better performance.