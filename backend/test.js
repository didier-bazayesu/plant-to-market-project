// test.js
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const TOKEN = "eyJhbGciOiJIUzI1NiIsInRvbGUiOiJhZG1pbiIsImlhdCI6MTc3NDgwOTIxNiwiZXhwIjoxNzc1NDE0MDE2fQ.McBZt4pPsqfDuvFi0Pz3l6VfE_K55V_46iONzTye2RU";

async function fetchUsers() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const users = await response.json();
    console.log(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
  }
}

fetchUsers();
