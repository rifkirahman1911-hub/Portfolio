import { supabase } from "./supabaseClient.js";

// REGISTER
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        alert("Register gagal: " + error.message);
      } else {
        alert("Register berhasil! Silakan login.");
        window.location.href = "index.html";
      }
    });
  }

  // LOGIN
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        alert("Login gagal: " + error.message);
      } else {
        alert("Login berhasil!");
        window.location.href = "dashboard.html";
      }
    });
  }
});
