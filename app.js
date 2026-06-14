// CMC Management System - Main Application

// State Management
const state = {
    currentUser: null,
    userType: null, // 'admin', 'owner', or null
    residents: [],
    collections: [],
    expenses: [],
};

// Resident Data Structure - Updated with 3 floors (18 rooms total)
const rooms = [
    '101', '102', '103', '104', '105', '106',
    '201', '202', '203', '204', '205', '206',
    '401', '402', '403', '404', '405', '406'
];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    if (state.currentUser) {
        showDashboard();
    } else {
        showLoginPage();
    }
});

// ==================== LOCAL STORAGE ====================
function loadFromLocalStorage() {
    const saved = localStorage.getItem('cmcData');
    if (saved) {
        const data = JSON.parse(saved);
        state.residents = data.residents || [];
        state.collections = data.collections || [];
        state.expenses = data.expenses || [];
    }

    const user = localStorage.getItem('currentUser');
    if (user) {
        state.currentUser = JSON.parse(user);
        state.userType = localStorage.getItem('userType');
    }

    // Initialize residents if empty
    if (state.residents.length === 0) {
        rooms.forEach(room => {
            state.residents.push({
                id: room,
                room: room,
                ownerName: '',
                phone: '',
                email: '',
                vehicle: '',
                notes: '',
                createdAt: new Date().toISOString()
            });
        });
    }
}

function saveToLocalStorage() {
    localStorage.setItem('cmcData', JSON.stringify({
        residents: state.residents,
        collections: state.collections,
        expenses: state.expenses
    }));
}

// ==================== LOGIN PAGE ====================
function showLoginPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="login-container">
            <div class="login-card">
                <h1>🏢 CMC Management</h1>
                <div class="alert alert-info show">
                    <strong>Demo Credentials:</strong><br>
                    Admin: admin / admin123<br>
                    Owner: owner@101 / owner123<br>
                    (Room format: owner@RoomNo)<br><br>
                    <strong>Available Rooms:</strong><br>
                    101-106, 201-206, 401-406
                </div>
                
                <form id="loginForm">
                    <div class="form-group">
                        <label>Username/Room No</label>
                        <input type="text" id="username" placeholder="Enter username or owner@RoomNo" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="password" placeholder="Enter password" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });
}

function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin123') {
        state.currentUser = { name: 'Admin', id: 'admin' };
        state.userType = 'admin';
        localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
        localStorage.setItem('userType', 'admin');
        showDashboard();
    } else if (username.startsWith('owner@') && password === 'owner123') {
        const room = username.replace('owner@', '');
        if (rooms.includes(room)) {
            const resident = state.residents.find(r => r.room === room);
            state.currentUser = { name: resident.ownerName || `Room ${room}`, id: room };
            state.userType = 'owner';
            localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
            localStorage.setItem('userType', 'owner');
            showDashboard();
        } else {
            showAlert('Invalid room number', 'danger');
        }
    } else {
        showAlert('Invalid credentials', 'danger');
    }
}

// ==================== DASHBOARD ====================
function showDashboard() {
    const app = document.getElementById('app');

    if (state.userType === 'admin') {
        app.innerHTML = getAdminDashboard();
    } else if (state.userType === 'owner') {
        app.innerHTML = getOwnerDashboard();
    }

    setupEventListeners();
}

function getAdminDashboard() {
    const totalCollected = state.collections.reduce((sum, c) => sum + c.amount, 0);
    const totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);
    const balance = totalCollected - totalExpenses;

    return `
        <nav class="navbar">
            <h1>🏢 CMC Management - Admin</h1>
            <div class="nav-links">
                <a class="nav-link active" data-page="dashboard">Dashboard</a>
                <a class="nav-link" data-page="residents">Residents</a>
                <a class="nav-link" data-page="collections">Collections</a>
                <a class="nav-link" data-page="expenses">Expenses</a>
                <a class="nav-link" data-page="public">Public View</a>
                <button class="logout-btn" onclick="logout()">Logout</button>
            </div>
        </nav>

        <div class="container">
            <div id="alert-container"></div>

            <!-- Dashboard Page -->
            <div id="dashboard" class="page active">
                <h2>📊 Dashboard Overview</h2>
                
                <div class="grid">
                    <div class="stat-card">
                        <h3>Total Residents</h3>
                        <div class="value">${state.residents.length}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Amount Collected</h3>
                        <div class="value">₹${totalCollected}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Total Expenses</h3>
                        <div class="value">₹${totalExpenses}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Balance</h3>
                        <div class="value" style="color: ${balance >= 0 ? 'var(--success)' : 'var(--danger)'};">
                            ₹${balance}
                        </div>
                    </div>
                </div>

                <div class="card" style="margin-top: 2rem;">
                    <h3>📋 Recent Collections</h3>
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Room</th>
                                    <th>Owner Name</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Mode</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${state.collections.slice(-5).reverse().map(c => `
                                    <tr>
                                        <td>${c.room}</td>
                                        <td>${state.residents.find(r => r.room === c.room)?.ownerName || 'N/A'}</td>
                                        <td>₹${c.amount}</td>
                                        <td>${new Date(c.date).toLocaleDateString()}</td>
                                        <td><span class="badge badge-success">${c.mode}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Residents Page -->
            <div id="residents" class="page">
                <h2>👥 Residents Information</h2>
                <button class="btn btn-primary" style="margin-bottom: 1rem;" onclick="openAddResidentModal()">
                    + Add/Edit Resident
                </button>

                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Room</th>
                                <th>Owner Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Vehicle</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${state.residents.map(r => `
                                <tr>
                                    <td><strong>${r.room}</strong></td>
                                    <td>${r.ownerName || '-'}</td>
                                    <td>${r.phone || '-'}</td>
                                    <td>${r.email || '-'}</td>
                                    <td>${r.vehicle || '-'}</td>
                                    <td>
                                        <button class="btn btn-primary" style="padding: 0.5rem;" 
                                            onclick="editResident('${r.room}')">Edit</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Collections Page -->
            <div id="collections" class="page">
                <h2>💰 Collections</h2>
                <button class="btn btn-success" style="margin-bottom: 1rem;" onclick="openAddCollectionModal()">
                    + Record Collection
                </button>

                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Room</th>
                                <th>Owner Name</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Mode</th>
                                <th>Notes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${state.collections.map((c, i) => `
                                <tr>
                                    <td>${c.room}</td>
                                    <td>${state.residents.find(r => r.room === c.room)?.ownerName || 'N/A'}</td>
                                    <td>₹${c.amount}</td>
                                    <td>${new Date(c.date).toLocaleDateString()}</td>
                                    <td><span class="badge badge-success">${c.mode}</span></td>
                                    <td>${c.notes || '-'}</td>
                                    <td>
                                        <button class="btn btn-danger" style="padding: 0.5rem;" 
                                            onclick="deleteCollection(${i})">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Expenses Page -->
            <div id="expenses" class="page">
                <h2>📊 Expenses</h2>
                <button class="btn btn-primary" style="margin-bottom: 1rem;" onclick="openAddExpenseModal()">
                    + Add Expense
                </button>

                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${state.expenses.map((e, i) => `
                                <tr>
                                    <td>${e.description}</td>
                                    <td>₹${e.amount}</td>
                                    <td><span class="badge">${e.category}</span></td>
                                    <td>${new Date(e.date).toLocaleDateString()}</td>
                                    <td>
                                        <button class="btn btn-danger" style="padding: 0.5rem;" 
                                            onclick="deleteExpense(${i})">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Public View Page -->
            <div id="public" class="page">
                <h2>🔗 Public Collection Dashboard</h2>
                <p>Share this link with all residents to view live collection status:</p>
                <div class="card">
                    <input type="text" value="${window.location.origin}${window.location.pathname}?public=true" 
                        readonly style="margin-bottom: 1rem;">
                    <button class="btn btn-primary" onclick="copyPublicLink()">Copy Link</button>
                </div>
                <p style="margin-top: 1rem; color: #7f8c8d;">
                    <strong>Note:</strong> This link displays live collection statistics and resident information.
                    No sensitive data is shown.
                </p>
            </div>
        </div>

        <!-- Modals -->
        ${getModals()}
    `;
}

function getOwnerDashboard() {
    const room = state.currentUser.id;
    const resident = state.residents.find(r => r.room === room);
    const roomCollections = state.collections.filter(c => c.room === room);
    const totalPaid = roomCollections.reduce((sum, c) => sum + c.amount, 0);

    return `
        <nav class="navbar">
            <h1>🏢 CMC Management - Resident</h1>
            <div class="nav-links">
                <a class="nav-link active" data-page="dashboard">Dashboard</a>
                <a class="nav-link" data-page="profile">My Profile</a>
                <a class="nav-link" data-page="payments">My Payments</a>
                <button class="logout-btn" onclick="logout()">Logout</button>
            </div>
        </nav>

        <div class="container">
            <div id="alert-container"></div>

            <!-- Dashboard Page -->
            <div id="dashboard" class="page active">
                <h2>📊 Welcome, ${resident.ownerName || `Room ${room}`}!</h2>
                
                <div class="grid">
                    <div class="stat-card">
                        <h3>Your Room</h3>
                        <div class="value">${room}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Total Paid</h3>
                        <div class="value">₹${totalPaid}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Payment History</h3>
                        <div class="value">${roomCollections.length}</div>
                    </div>
                </div>

                <div class="card">
                    <h3>📋 Recent Payments</h3>
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Mode</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${roomCollections.slice(-5).reverse().map(c => `
                                    <tr>
                                        <td>₹${c.amount}</td>
                                        <td>${new Date(c.date).toLocaleDateString()}</td>
                                        <td><span class="badge badge-success">${c.mode}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Profile Page -->
            <div id="profile" class="page">
                <div class="card">
                    <h2>👤 My Profile</h2>
                    <form id="profileForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Owner Name</label>
                                <input type="text" id="ownerName" value="${resident.ownerName}" required>
                            </div>
                            <div class="form-group">
                                <label>Room Number</label>
                                <input type="text" value="${room}" disabled>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Phone Number</label>
                                <input type="tel" id="phone" value="${resident.phone}">
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" id="email" value="${resident.email}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Vehicle Number</label>
                            <input type="text" id="vehicle" value="${resident.vehicle}">
                        </div>
                        <div class="form-group">
                            <label>Notes</label>
                            <textarea id="notes">${resident.notes}</textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Update Profile</button>
                    </form>
                </div>
            </div>

            <!-- Payments Page -->
            <div id="payments" class="page">
                <h2>💳 My Payment History</h2>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Mode</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${roomCollections.map(c => `
                                <tr>
                                    <td>₹${c.amount}</td>
                                    <td>${new Date(c.date).toLocaleDateString()}</td>
                                    <td><span class="badge badge-success">${c.mode}</span></td>
                                    <td>${c.notes || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function getModals() {
    return `
        <!-- Add Resident Modal -->
        <div id="residentModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Edit Resident Information</h2>
                    <button class="close-btn" onclick="closeModal('residentModal')">×</button>
                </div>
                <form id="residentForm">
                    <div class="form-group">
                        <label>Room Number</label>
                        <input type="text" id="residentRoom" disabled>
                    </div>
                    <div class="form-group">
                        <label>Owner Name</label>
                        <input type="text" id="residentName" required>
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" id="residentPhone">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="residentEmail">
                    </div>
                    <div class="form-group">
                        <label>Vehicle Number</label>
                        <input type="text" id="residentVehicle">
                    </div>
                    <div class="form-group">
                        <label>Notes</label>
                        <textarea id="residentNotes"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Resident</button>
                </form>
            </div>
        </div>

        <!-- Add Collection Modal -->
        <div id="collectionModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Record Collection</h2>
                    <button class="close-btn" onclick="closeModal('collectionModal')">×</button>
                </div>
                <form id="collectionForm">
                    <div class="form-group">
                        <label>Room Number</label>
                        <select id="collectionRoom" required>
                            <option value="">Select Room</option>
                            ${rooms.map(room => `<option value="${room}">${room}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Amount (₹)</label>
                        <input type="number" id="collectionAmount" min="0" required>
                    </div>
                    <div class="form-group">
                        <label>Payment Mode</label>
                        <select id="collectionMode" required>
                            <option value="Cash">Cash</option>
                            <option value="Cheque">Cheque</option>
                            <option value="Online">Online Transfer</option>
                            <option value="Card">Card</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" id="collectionDate" required>
                    </div>
                    <div class="form-group">
                        <label>Notes</label>
                        <textarea id="collectionNotes"></textarea>
                    </div>
                    <button type="submit" class="btn btn-success">Record Collection</button>
                </form>
            </div>
        </div>

        <!-- Add Expense Modal -->
        <div id="expenseModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Add Expense</h2>
                    <button class="close-btn" onclick="closeModal('expenseModal')">×</button>
                </div>
                <form id="expenseForm">
                    <div class="form-group">
                        <label>Description</label>
                        <input type="text" id="expenseDescription" required>
                    </div>
                    <div class="form-group">
                        <label>Amount (₹)</label>
                        <input type="number" id="expenseAmount" min="0" required>
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select id="expenseCategory" required>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Security">Security</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Repair">Repair</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" id="expenseDate" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Expense</button>
                </form>
            </div>
        </div>
    `;
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const page = e.target.dataset.page;
            if (page) {
                navigateToPage(page);
            }
        });
    });

    // Forms
    const residentForm = document.getElementById('residentForm');
    if (residentForm) {
        residentForm.addEventListener('submit', saveResident);
    }

    const collectionForm = document.getElementById('collectionForm');
    if (collectionForm) {
        collectionForm.addEventListener('submit', saveCollection);
    }

    const expenseForm = document.getElementById('expenseForm');
    if (expenseForm) {
        expenseForm.addEventListener('submit', saveExpense);
    }

    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', saveOwnerProfile);
    }

    // Set today's date as default
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => {
        if (!input.value) input.value = today;
    });
}

function navigateToPage(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageName).classList.add('active');

    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');
}

// ==================== MODAL FUNCTIONS ====================
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function openAddResidentModal() {
    document.getElementById('residentRoom').value = '';
    document.getElementById('residentName').value = '';
    document.getElementById('residentPhone').value = '';
    document.getElementById('residentEmail').value = '';
    document.getElementById('residentVehicle').value = '';
    document.getElementById('residentNotes').value = '';
    openModal('residentModal');
}

function editResident(room) {
    const resident = state.residents.find(r => r.room === room);
    document.getElementById('residentRoom').value = resident.room;
    document.getElementById('residentName').value = resident.ownerName;
    document.getElementById('residentPhone').value = resident.phone;
    document.getElementById('residentEmail').value = resident.email;
    document.getElementById('residentVehicle').value = resident.vehicle;
    document.getElementById('residentNotes').value = resident.notes;
    openModal('residentModal');
}

function openAddCollectionModal() {
    document.getElementById('collectionForm').reset();
    document.getElementById('collectionDate').value = new Date().toISOString().split('T')[0];
    openModal('collectionModal');
}

function openAddExpenseModal() {
    document.getElementById('expenseForm').reset();
    document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];
    openModal('expenseModal');
}

// ==================== FORM SUBMISSION ====================
function saveResident(e) {
    e.preventDefault();
    const room = document.getElementById('residentRoom').value;
    const resident = state.residents.find(r => r.room === room);

    if (resident) {
        resident.ownerName = document.getElementById('residentName').value;
        resident.phone = document.getElementById('residentPhone').value;
        resident.email = document.getElementById('residentEmail').value;
        resident.vehicle = document.getElementById('residentVehicle').value;
        resident.notes = document.getElementById('residentNotes').value;
        saveToLocalStorage();
        showAlert('Resident information updated successfully!', 'success');
        closeModal('residentModal');
        showDashboard();
    }
}

function saveOwnerProfile(e) {
    e.preventDefault();
    const room = state.currentUser.id;
    const resident = state.residents.find(r => r.room === room);

    if (resident) {
        resident.ownerName = document.getElementById('ownerName').value;
        resident.phone = document.getElementById('phone').value;
        resident.email = document.getElementById('email').value;
        resident.vehicle = document.getElementById('vehicle').value;
        resident.notes = document.getElementById('notes').value;
        saveToLocalStorage();
        state.currentUser.name = resident.ownerName;
        localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
        showAlert('Profile updated successfully!', 'success');
        showDashboard();
    }
}

function saveCollection(e) {
    e.preventDefault();
    const collection = {
        room: document.getElementById('collectionRoom').value,
        amount: parseFloat(document.getElementById('collectionAmount').value),
        mode: document.getElementById('collectionMode').value,
        date: document.getElementById('collectionDate').value,
        notes: document.getElementById('collectionNotes').value,
        id: Date.now()
    };

    state.collections.push(collection);
    saveToLocalStorage();
    showAlert('Collection recorded successfully!', 'success');
    closeModal('collectionModal');
    showDashboard();
}

function saveExpense(e) {
    e.preventDefault();
    const expense = {
        description: document.getElementById('expenseDescription').value,
        amount: parseFloat(document.getElementById('expenseAmount').value),
        category: document.getElementById('expenseCategory').value,
        date: document.getElementById('expenseDate').value,
        id: Date.now()
    };

    state.expenses.push(expense);
    saveToLocalStorage();
    showAlert('Expense added successfully!', 'success');
    closeModal('expenseModal');
    showDashboard();
}

// ==================== DELETE FUNCTIONS ====================
function deleteCollection(index) {
    if (confirm('Are you sure you want to delete this collection record?')) {
        state.collections.splice(index, 1);
        saveToLocalStorage();
        showAlert('Collection deleted successfully!', 'success');
        showDashboard();
    }
}

function deleteExpense(index) {
    if (confirm('Are you sure you want to delete this expense?')) {
        state.expenses.splice(index, 1);
        saveToLocalStorage();
        showAlert('Expense deleted successfully!', 'success');
        showDashboard();
    }
}

// ==================== UTILITY FUNCTIONS ====================
function showAlert(message, type) {
    const container = document.getElementById('alert-container');
    if (!container) return;

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} show`;
    alert.textContent = message;

    container.innerHTML = '';
    container.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 4000);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userType');
        state.currentUser = null;
        state.userType = null;
        showLoginPage();
    }
}

function copyPublicLink() {
    const link = `${window.location.origin}${window.location.pathname}?public=true`;
    navigator.clipboard.writeText(link).then(() => {
        showAlert('Link copied to clipboard!', 'success');
    });
}

// ==================== PUBLIC DASHBOARD ====================
function checkIfPublic() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('public') === 'true') {
        showPublicDashboard();
        return true;
    }
    return false;
}

function showPublicDashboard() {
    const app = document.getElementById('app');
    const totalCollected = state.collections.reduce((sum, c) => sum + c.amount, 0);
    const totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);
    const balance = totalCollected - totalExpenses;
    const collectionsByRoom = {};

    state.collections.forEach(c => {
        if (!collectionsByRoom[c.room]) {
            collectionsByRoom[c.room] = 0;
        }
        collectionsByRoom[c.room] += c.amount;
    });

    app.innerHTML = `
        <div style="background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); color: white; padding: 3rem 1rem; text-align: center;">
            <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">🏢 Shikhar Avenue</h1>
            <p style="font-size: 1.2rem; margin: 0;">CMC Collection Dashboard</p>
        </div>

        <div class="container" style="margin-top: 2rem;">
            <div class="grid">
                <div class="stat-card">
                    <h3>Total Residents</h3>
                    <div class="value">${state.residents.length}</div>
                </div>
                <div class="stat-card">
                    <h3>Amount Collected</h3>
                    <div class="value" style="color: var(--success);">₹${totalCollected}</div>
                </div>
                <div class="stat-card">
                    <h3>Total Expenses</h3>
                    <div class="value" style="color: var(--warning);">₹${totalExpenses}</div>
                </div>
                <div class="stat-card">
                    <h3>Net Balance</h3>
                    <div class="value" style="color: ${balance >= 0 ? 'var(--success)' : 'var(--danger)'};">
                        ₹${balance}
                    </div>
                </div>
            </div>

            <div class="card" style="margin-top: 2rem;">
                <h2>📊 Collections by Room</h2>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Room</th>
                                <th>Owner</th>
                                <th>Amount Collected</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rooms.map(room => {
                                const resident = state.residents.find(r => r.room === room);
                                const amount = collectionsByRoom[room] || 0;
                                return `
                                    <tr>
                                        <td><strong>${room}</strong></td>
                                        <td>${resident.ownerName || '-'}</td>
                                        <td>₹${amount}</td>
                                        <td>
                                            ${amount > 0 
                                                ? '<span class="badge badge-success">✓ Paid</span>' 
                                                : '<span class="badge badge-danger">✗ Pending</span>'}
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card">
                <h2>📋 Recent Transactions</h2>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Room</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${[
                                ...state.collections.map(c => ({
                                    room: c.room,
                                    amount: c.amount,
                                    date: c.date,
                                    type: 'Collection',
                                    isCollection: true
                                })),
                                ...state.expenses.map(e => ({
                                    room: 'CMC',
                                    amount: e.amount,
                                    date: e.date,
                                    type: e.category,
                                    isCollection: false
                                }))
                            ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20).map(t => `
                                <tr>
                                    <td>${t.room}</td>
                                    <td style="color: ${t.isCollection ? 'var(--success)' : 'var(--danger)'};">
                                        ${t.isCollection ? '+' : '-'} ₹${t.amount}
                                    </td>
                                    <td>${new Date(t.date).toLocaleDateString()}</td>
                                    <td><span class="badge ${t.isCollection ? 'badge-success' : 'badge-warning'}">${t.type}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style="text-align: center; margin-top: 3rem; color: #7f8c8d; padding-bottom: 2rem;">
                <p><small>Last updated: ${new Date().toLocaleString()}</small></p>
                <p><small>This dashboard refreshes automatically every 30 seconds</small></p>
            </div>
        </div>

        <script>
            // Auto-refresh every 30 seconds
            setInterval(() => {
                location.reload();
            }, 30000);
        </script>
    `;
}

// Check if it's public view and load accordingly
if (checkIfPublic()) {
    loadFromLocalStorage();
    showPublicDashboard();
}
