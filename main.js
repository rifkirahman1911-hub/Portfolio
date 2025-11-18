// main.js
import supabase from './supabaseClient.js';

/* ====================
   AUTH: register & login
   ==================== */
export async function register(email, password, fullName) {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // create profile row
    await supabase.from('profiles').insert([{
      user_id: data.user.id,
      email,
      full_name: fullName
    }]);

    alert('Register berhasil — silakan login.');
    window.location.href = 'index.html';
  } catch (err) {
    console.error(err);
    alert('Register gagal: ' + (err.message || err));
  }
}

export async function login(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // simpan user id ke localStorage untuk akses cepat
    localStorage.setItem('userId', data.user.id);
    alert('Login berhasil!');
    window.location.href = 'dashboard.html';
  } catch (err) {
    console.error(err);
    alert('Login gagal: ' + (err.message || err));
  }
}

/* ====================
   SESSION check & logout
   ==================== */
export async function checkLogin() {
  try {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      localStorage.removeItem('userId');
      window.location.href = 'index.html';
      return false;
    } else {
      localStorage.setItem('userId', data.user.id);
      return true;
    }
  } catch (err) {
    console.error(err);
    window.location.href = 'index.html';
    return false;
  }
}

export async function logout() {
  try {
    await supabase.auth.signOut();
  } catch (e) { console.warn(e); }
  localStorage.removeItem('userId');
  window.location.href = 'index.html';
}

/* ====================
   PROFILE helpers
   ==================== */
export async function getProfile() {
  const userId = localStorage.getItem('userId');
  if (!userId) return null;

  const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
  if (error) {
    console.error('getProfile error', error);
    return null;
  }
  return data;
}

export async function updateProfile(fullName, phone, bio, skills = [], interests = []) {
  try {
    const userId = localStorage.getItem('userId');
    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', userId).single();
    if (!profile) throw new Error('Profile tidak ditemukan');

    const { error } = await supabase.from('profiles').update({
      full_name: fullName, phone, bio, skills, interests
    }).eq('id', profile.id);

    if (error) throw error;
    alert('Profile berhasil diperbarui');
  } catch (err) {
    console.error(err);
    alert('Update profile gagal: ' + (err.message || err));
  }
}

/* ====================
   PROJECTS CRUD
   ==================== */
export async function addProject(title, description, project_type, demo_link = null) {
  try {
    const userId = localStorage.getItem('userId');
    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', userId).single();
    if (!profile) throw new Error('Profile tidak ditemukan');

    const { error } = await supabase.from('projects').insert([{
      profile_id: profile.id,
      title, description, project_type, demo_link, created_at: new Date()
    }]);
    if (error) throw error;
    alert('Project berhasil ditambahkan');
  } catch (err) {
    console.error(err);
    alert('Tambah project gagal: ' + (err.message || err));
  }
}

export async function getProjects() {
  try {
    const userId = localStorage.getItem('userId');
    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', userId).single();
    if (!profile) return [];
    const { data, error } = await supabase.from('projects').select('*').eq('profile_id', profile.id).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function updateProject(projectId, title, description, project_type, demo_link = null) {
  try {
    const { error } = await supabase.from('projects').update({
      title, description, project_type, demo_link
    }).eq('id', projectId);
    if (error) throw error;
    alert('Project berhasil diupdate');
  } catch (err) {
    console.error(err);
    alert('Update project gagal: ' + (err.message || err));
  }
}

export async function deleteProject(projectId) {
  try {
    const { error } = await supabase.from('projects').delete().eq('id', projectId);
    if (error) throw error;
    alert('Project berhasil dihapus');
  } catch (err) {
    console.error(err);
    alert('Hapus project gagal: ' + (err.message || err));
  }
}

/* ====================
   CERTIFICATES CRUD
   ==================== */
export async function addCertificate(name, issuer, issued_date = null, file_url = null) {
  try {
    const userId = localStorage.getItem('userId');
    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', userId).single();
    if (!profile) throw new Error('Profile tidak ditemukan');

    const { error } = await supabase.from('certificates').insert([{
      profile_id: profile.id,
      name, issuer, issued_date, file_url
    }]);
    if (error) throw error;
    alert('Sertifikat berhasil ditambahkan');
  } catch (err) {
    console.error(err);
    alert('Tambah sertifikat gagal: ' + (err.message || err));
  }
}

export async function getCertificates() {
  try {
    const userId = localStorage.getItem('userId');
    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', userId).single();
    if (!profile) return [];
    const { data, error } = await supabase.from('certificates').select('*').eq('profile_id', profile.id).order('issued_date', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function deleteCertificate(certId) {
  try {
    const { error } = await supabase.from('certificates').delete().eq('id', certId);
    if (error) throw error;
    alert('Sertifikat berhasil dihapus');
  } catch (err) {
    console.error(err);
    alert('Hapus sertifikat gagal: ' + (err.message || err));
  }
}

/* ====================
   CV GENERATOR
   - menghasilkan halaman CV (bisa print/save as PDF)
   ==================== */
export async function generateCV() {
  try {
    const profile = await getProfile();
    const projects = await getProjects();
    const certs = await getCertificates();

    let html = `
      <html><head><title>Generated CV</title>
      <style>
        body{font-family:Arial,Helvetica,sans-serif;padding:20px}
        h1{margin-bottom:0}
        h2{margin-top:20px}
        ul{margin-top:5px}
      </style>
      </head><body>
      <h1>${profile?.full_name || 'Nama'}</h1>
      <p>${profile?.bio || ''}</p>
      <h2>Projects</h2>
      <ul>
    `;

    projects.forEach(p => {
      html += `
        <li>
          <strong>${p.title}</strong> — ${p.project_type}
          ${p.demo_link ? <a href="${p.demo_link}" target="_blank">${p.demo_link}</a> : ''}
          <br/><small>${p.description || ''}</small>
        </li>`;
    });

    html += </ul><h2>Certificates</h2><ul>;

    certs.forEach(c => {
      html += `
        <li>
          <strong>${c.name}</strong> — ${c.issuer}
          ${c.issued_date ? (${c.issued_date}) : ''}
        </li>`;
    });

    html += </ul></body></html>;

    const w = window.open('', '_blank');
    w.document.open();
    w.document.write(html);
    w.document.close();
  } catch (err) {
    console.error(err);
    alert('Generate CV gagal: ' + (err.message || err));
  }
}
