import supabase from './supabaseClient.js';

// ========================
// AUTH
// ========================
export async function register(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return alert("Register gagal: " + error.message);

    // Insert profile
    await supabase.from('profiles').insert([{
        user_id: data.user.id,
        email: email,
        full_name: fullName
    }]);

    alert("Register berhasil! Cek email untuk verifikasi.");
    window.location.href = "index.html";
}

export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert("Login gagal: " + error.message);

    localStorage.setItem('userId', data.user.id);
    alert("Login berhasil!");
    window.location.href = "dashboard.html";
}

// ========================
// PROFILE
// ========================
export async function getProfile() {
    const userId = localStorage.getItem('userId');
    const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
    if (error) return console.error(error);
    return data;
}

export async function updateProfile(fullName, phone, bio, skills = [], interests = []) {
    const userId = localStorage.getItem('userId');
    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', userId).single();
    if (!profile) return alert("Profile tidak ditemukan");

    const { data, error } = await supabase.from('profiles').update({
        full_name: fullName,
        phone,
        bio,
        skills,
        interests
    }).eq('id', profile.id);

    if (error) return alert("Update profile gagal: " + error.message);
    return data;
}

// ========================
// PROJECTS
// ========================
export async function addProject(title, description, type, demoLink) {
    const userId = localStorage.getItem('userId');
    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', userId).single();
    if (!profile) return alert("Profile tidak ditemukan");

    const { data, error } = await supabase.from('projects').insert([{
        profile_id: profile.id,
        title,
        description,
        project_type: type,
        demo_link: demoLink
    }]);
    if (error) return alert("Gagal tambah project: " + error.message);
    return data;
}

export async function getProjects() {
    const userId = localStorage.getItem('userId');
    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', userId).single();
    const { data, error } = await supabase.from('projects').select('*').eq('profile_id', profile.id);
    if (error) return console.error(error);
    return data;
}

export async function updateProject(projectId, title, description, type, demoLink) {
    const { data, error } = await supabase.from('projects').update({
        title, description, project_type: type, demo_link: demoLink
    }).eq('id', projectId);
    if (error) return alert("Update project gagal: " + error.message);
    return data;
}

export async function deleteProject(projectId) {
    const { data, error } = await supabase.from('projects').delete().eq('id', projectId);
    if (error) return alert("Hapus project gagal: " + error.message);
    return data;
}

// ========================
// CERTIFICATES
// ========================
export async function addCertificate(name, issuer, issuedDate, fileUrl) {
    const userId = localStorage.getItem('userId');
    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', userId).single();
    if (!profile) return alert("Profile tidak ditemukan");

    const { data, error } = await supabase.from('certificates').insert([{
        profile_id: profile.id,
        name,
        issuer,
        issued_date: issuedDate,
        file_url: fileUrl
    }]);
    if (error) return alert("Tambah certificate gagal: " + error.message);
    return data;
}

export async function getCertificates() {
    const userId = localStorage.getItem('userId');
    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', userId).single();
    const { data, error } = await supabase.from('certificates').select('*').eq('profile_id', profile.id);
    if (error) return console.error(error);
    return data;
}

export async function deleteCertificate(certId) {
    const { data, error } = await supabase.from('certificates').delete().eq('id', certId);
    if (error) return alert("Hapus certificate gagal: " + error.message);
    return data;
}

// ========================
// CV GENERATOR SIMULASI
// ========================
export async function generateCV(summary) {
    const userId = localStorage.getItem('userId');
    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', userId).single();
    if (!profile) return alert("Profile tidak ditemukan");

    const { data, error } = await supabase.from('cv_generator_logs').insert([{
        profile_id: profile.id,
        ai_summary: summary,
        generated_url: "https://example.com/generated-cv.pdf"  // simulasi
    }]);
    if (error) return alert("Generate CV gagal: " + error.message);
    return data;
}

// ========================
// LOGOUT
// ========================
export function logout() {
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}