import supabase from './supabaseClient.js';

// ========================
// CEK AUTH STATUS GLOBAL
// ========================
export async function checkLogin() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
        localStorage.removeItem('userId');
        window.location.href = "index.html";
    } else {
        localStorage.setItem('userId', data.user.id);
    }
}

// ========================
// AUTH
// ========================
export async function register(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) return alert("Register gagal: " + error.message);

    // Insert profile jika berhasil signup
    await supabase.from('profiles').insert([{
        user_id: data.user.id,
        email,
        full_name: fullName
    }]);

    alert("Register berhasil! Silahkan Login.");
    window.location.href = "index.html";
}

export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return alert("Login gagal: " + error.message);

    localStorage.setItem('userId', data.user.id);
    alert("Login berhasil!");
    window.location.href = "dashboard.html";
}

export function logout() {
    localStorage.removeItem('userId');
    supabase.auth.signOut();
    window.location.href = "index.html";
}

// ========================
// PROFILE CRUD
// ========================
export async function getProfile() {
    const userId = localStorage.getItem('userId');

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) console.error("Get profile error:", error);
    return data;
}

export async function updateProfile(fullName, phone, bio, skills = [], interests = []) {
    const userId = localStorage.getItem('userId');

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

    if (!profile) return alert("Profile tidak ditemukan.");

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: fullName,
            phone,
            bio,
            skills,
            interests
        })
        .eq('id', profile.id);

    if (error) alert("Update profile gagal: " + error.message);
    else alert("Profile berhasil diupdate!");
}

// ========================
// PROJECTS CRUD
// ========================
export async function addProject(title, description, type, demoLink) {
    const userId = localStorage.getItem('userId');

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

    if (!profile) return alert("Profile tidak ditemukan");

    const { error } = await supabase.from('projects').insert([{
        profile_id: profile.id,
        title,
        description,
        project_type: type,
        demo_link: demoLink,
        created_at: new Date()
    }]);

    if (error) alert("Tambah project gagal: " + error.message);
    else alert("Project berhasil ditambahkan!");
}

export async function getProjects() {
    const userId = localStorage.getItem('userId');

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('profile_id', profile.id);

    if (error) console.error(error);
    return data;
}

export async function updateProject(projectId, title, description, type, demoLink) {
    const { error } = await supabase
        .from('projects')
        .update({
            title,
            description,
            project_type: type,
            demo_link: demoLink
        })
        .eq('id', projectId);

    if (error) alert("Update project gagal: " + error.message);
    else alert("Project berhasil diperbarui!");
}

export async function deleteProject(projectId) {
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

    if (error) alert("Hapus project gagal: " + error.message);
    else alert("Project berhasil dihapus!");
}

// ========================
// CERTIFICATES CRUD
// ========================
export async function addCertificate(name, issuer, issuedDate, fileUrl) {
    const userId = localStorage.getItem('userId');

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

    if (!profile) return alert("Profile tidak ditemukan");

    const { error } = await supabase.from('certificates').insert([{
        profile_id: profile.id,
        name,
        issuer,
        issued_date: issuedDate,
        file_url: fileUrl
    }]);

    if (error) alert("Tambah certificate gagal: " + error.message);
    else alert("Certificate berhasil ditambah!");
}

export async function getCertificates() {
    const userId = localStorage.getItem('userId');

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

    const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('profile_id', profile.id);

    if (error) console.error(error);
    return data;
}

export async function deleteCertificate(certId) {
    const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', certId);

    if (error) alert("Hapus certificate gagal: " + error.message);
    else alert("Certificate berhasil dihapus!");
}

// ========================
// CV GENERATOR (SIMULASI)
// ========================
export async function generateCV(summary) {
    const userId = localStorage.getItem('userId');

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

    if (!profile) return alert("Profile tidak ditemukan.");

    const { error } = await supabase.from('cv_generator_logs').insert([{
        profile_id: profile.id,
        ai_summary: summary,
        generated_url: "https://example.com/generated-cv.pdf"
    }]);

    if (error) alert("Generate CV gagal: " + error.message);
    else alert("CV berhasil digenerate!");
}
