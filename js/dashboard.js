import { supabase } from "./supabaseClient.js";

// LOAD USER
async function loadUser() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    window.location.href = "index.html";
  }
}
loadUser();

// -------- PROJECT CRUD -------- //

// GET ALL PROJECTS
async function loadProjects() {
  const { data, error } = await supabase.from("projects").select("*");

  const projectList = document.getElementById("projectList");
  projectList.innerHTML = "";

  data.forEach((p) => {
    projectList.innerHTML += `
      <div class="item">
        <h3>${p.project_name}</h3>
        <p>Type: ${p.project_type}</p>
        <p>${p.description}</p>
        <button onclick="editProject('${p.id}')">Edit</button>
        <button onclick="deleteProject('${p.id}')">Delete</button>
      </div>
    `;
  });
}

// ADD PROJECT
document.getElementById("projectForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("pname").value;
  const type = document.getElementById("ptype").value;
  const desc = document.getElementById("pdesc").value;

  await supabase.from("projects").insert([
    { project_name: name, project_type: type, description: desc }
  ]);

  loadProjects();
});

window.deleteProject = async (id) => {
  await supabase.from("projects").delete().eq("id", id);
  loadProjects();
};

// -------- CERTIFICATE CRUD -------- //

async function loadCertificates() {
  const { data } = await supabase.from("certificates").select("*");

  const certList = document.getElementById("certList");
  certList.innerHTML = "";

  data.forEach((c) => {
    certList.innerHTML += `
      <div class="item">
        <h3>${c.certificate_name}</h3>
        <p>Issuer: ${c.issuer}</p>
        <button onclick="deleteCertificate('${c.id}')">Delete</button>
      </div>
    `;
  });
}

// ADD CERTIFICATE
document
  .getElementById("certForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("cname").value;
    const issuer = document.getElementById("issuer").value;

    await supabase.from("certificates").insert([
      { certificate_name: name, issuer }
    ]);

    loadCertificates();
  });

window.deleteCertificate = async (id) => {
  await supabase.from("certificates").delete().eq("id", id);
  loadCertificates();
};

// INITIAL LOAD
loadProjects();
loadCertificates();
