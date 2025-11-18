// --- SETTING SUPABASE ---
const supabase = supabase.createClient(
    "https://khexegxtpykpfqdjxvof.supabase.co",
    "YOUR_ANON_KEY"
);

// --- LOAD DATA SAAT HALAMAN DIBUKA ---
document.addEventListener("DOMContentLoaded", () => {
    loadData();
});

// --- LOGOUT ---
document.getElementById("logoutBtn").addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "index.html";
});

// --- CREATE (Tambah Data) ---
document.getElementById("addForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const quantity = document.getElementById("quantity").value;

    const { error } = await supabase
        .from("items")
        .insert([{ name, quantity }]);

    if (error) {
        alert("Gagal menambah data");
        console.error(error);
        return;
    }

    loadData();
    e.target.reset();
});

// --- READ (Ambil Data) ---
async function loadData() {
    const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("id", { ascending: true });

    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    data.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.id}</td>
            <td><input value="${item.name}" id="name-${item.id}"></td>
            <td><input type="number" value="${item.quantity}" id="qty-${item.id}"></td>
            <td>
                <button onclick="updateItem(${item.id})">Update</button>
                <button onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- UPDATE (Mengubah Data) ---
async function updateItem(id) {
    const name = document.getElementById(name-${id}).value;
    const quantity = document.getElementById(qty-${id}).value;

    const { error } = await supabase
        .from("items")
        .update({ name, quantity })
        .eq("id", id);

    if (error) {
        alert("Gagal update data");
        console.error(error);
    } else {
        loadData();
    }
}

// --- DELETE (Hapus Data) ---
async function deleteItem(id) {
    const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", id);

    if (error) {
        alert("Gagal delete data");
        console.error(error);
    } else {
        loadData();
    }
}
