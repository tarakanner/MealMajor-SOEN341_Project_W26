// This file is deprecated - authentication logic has been moved to:
// - Context: ../context/AuthContext.jsx
// - API Service: ./auth.js
//
// This file can be removed after confirming all components are updated

// DEPRECATED - DO NOT USE
export function login(email, password) {
  console.log("DEPRECATED: Use AuthContext instead");
  console.log("email: ", { email }, "\npass:", { password });
}

export function signup(email, password) {
  console.log("DEPRECATED: Use AuthContext instead");
  console.log("email: ", { email }, "\npass:", { password });
}
