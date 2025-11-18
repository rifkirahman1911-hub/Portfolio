import { supabase } from "./supabaseClient.js";

document.getElementById("generateCV").addEventListener("click", async () => {
  const { data: projects } = await supabase.from("projects").select("*");
  const { data: certificates } = await supabase.from("certificates").select("*");

  let html = `
    <h1>Generated CV</h1>

    <h2>Projects</h2>
    <ul>
  `;

  projects.forEach((p) => {
    html += <li>${p.project_name} - ${p.project_type}</li>;
  });

  html += `
    </ul>

    <h2>Certificates</h2>
    <ul>
  `;

  certificates.forEach((c) => {
    html += <li>${c.certificate_name} - ${c.issuer}</li>;
  });

  html += </ul>;

  document.getElementById("cvResult").innerHTML = html;
});
