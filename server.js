const http = require("http");
const fs = require("fs");

const filePath = "./users.json";

function getUsers() {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

// save users
function saveUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // GET all users
  if (method === "GET" && url === "/users") {
    const users = getUsers();

    return res.end(JSON.stringify(users));
  }

  // GET user by id
  if (method === "GET" && url.startsWith("/users/")) {
    const id = parseInt(url.split("/")[2]);
    const users = getUsers();

    const user = users.find((u) => u.id === id);

    if (!user) {
      return res.end("User not found");
    }

    return res.end(JSON.stringify(user));
  }

  // POST user
  if (method === "POST" && url === "/users") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const users = getUsers();
      const newUser = JSON.parse(body);

      newUser.id = users.length + 1;

      users.push(newUser);
      saveUsers(users);

      res.end(JSON.stringify(newUser));
    });

    return;
  }

  // PUT update user
  if (method === "PUT" && url.startsWith("/users/")) {
    const id = parseInt(url.split("/")[2]);
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const users = getUsers();
      const updatedData = JSON.parse(body);

      const index = users.findIndex((u) => u.id === id);

      if (index === -1) {
        return res.end("User not found");
      }

      users[index] = { ...users[index], ...updatedData };

      saveUsers(users);

      res.end(JSON.stringify(users[index]));
    });

    return;
  }

  // DELETE user
  if (method === "DELETE" && url.startsWith("/users/")) {
    const id = parseInt(url.split("/")[2]);

    const users = getUsers();
    const newUsers = users.filter((u) => u.id !== id);

    saveUsers(newUsers);

    res.end("User deleted");
  }

  res.end("Route not found");
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});