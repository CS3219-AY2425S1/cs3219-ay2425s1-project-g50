#!/bin/bash
mongosh <<EOF
use user_service
// password: admin
db.usermodels.insertOne({
  username: "admin",
  email: "admin@gmail.com",
  password: "\$2b\$10\$Znbj5qwkQymg2Yk1asb2zO3kyhS.2UP6Vv/oJE1DsBmyLnZhqG90.",
  isAdmin: true
});
print("Admin user created.");
EOF
