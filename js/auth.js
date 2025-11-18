import { supabase } from "./supabase.js";

// =========================
// REGISTER
// =========================
const registerForm = document.getElementById("register-form");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;

        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            alert("Error: " + error.message);
            return;
        }

        alert("Registrasi berhasil! Silakan login.");
        window.location.href = "index.html";
    });
}

// =========================
// LOGIN
// =========================
const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert("Login gagal: " + error.message);
            return;
        }

        alert("Login berhasil!");
        window.location.href = "dashboard.html";
    });
}
