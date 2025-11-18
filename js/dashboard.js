import { supabase } from "./supabase.js";

// ======================
// CEK LOGIN SAAT MASUK DASHBOARD
// ======================
async function checkLogin() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
        window.location.href = "index.html";
    }
}
checkLogin();

// ======================
// LOAD PROFILE DATA
// ======================
async function loadProfile() {
    const { data: session } = await supabase.auth.getUser();
    const userId = session.user.id;

    let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

    if (!data) {
        // Auto create profile jika belum ada
        await supabase.from("profiles").insert([{ user_id: userId }]);
        loadProfile();
        return;
    }

    document.getElementById("full_name").value = data.full_name || "";
    document.getElementById("bio").value = data.bio || "";
}
loadProfile();

// ======================
// UPDATE PROFILE (CRUD)
// ======================
document.getElementById("save-profile").addEventListener("click", async () => {
    const { data: session } = await supabase.auth.getUser();
    const userId = session.user.id;

    const full_name = document.getElementById("full_name").value;
    const bio = document.getElementById("bio").value;

    await supabase
        .from("profiles")
        .update({ full_name, bio })
        .eq("user_id", userId);

    alert("Profil diperbarui!");
});

// ======================
// LOAD PROJECTS
// ======================
async function loadProjects() {
    const { data: session } = await supabase.auth.getUser();
    const userId = session.user.id;

    const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("profile_id", userId);

    const list = document.getElementById("project-list");
    list.innerHTML = "";

    data.forEach((p) => {
        list.innerHTML += `
            <li>
                <b>${p.title}</b> - ${p.description}
                <button onclick="deleteProject('${p.id}')">Delete</button>
            </li>
        `;
    });
}
loadProjects();

// ======================
// CREATE PROJECT
// ======================
document.getElementById("add-project").addEventListener("click", async () => {
    const title = document.getElementById("project-title").value;
    const description = document.getElementById("project-description").value;

    const { data: session } = await supabase.auth.getUser();
    const userId = session.user.id;

    await supabase.from("projects").insert([
        { profile_id: userId, title, description }
    ]);

    alert("Project ditambahkan!");
    loadProjects();
});

// ======================
// DELETE PROJECT
// ======================
window.deleteProject = async function (id) {
    await supabase.from("projects").delete().eq("id", id);
    loadProjects();
};
