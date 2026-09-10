// Excel Export Functionality for CMC Management System
// Uses SheetJS (xlsx library) to generate Excel files

/**
 * Function to export data to Excel file
 * @param {string} filename - Name of the Excel file to create
 * @param {array} sheets - Array of sheet objects with name and data
 */
function exportToExcel(filename, sheets) {
    // Check if XLSX library is loaded
    if (typeof XLSX === 'undefined') {
        showAlert('Excel library not loaded. Please refresh the page.', 'danger');
        return;
    }

    const wb = XLSX.utils.book_new();

    sheets.forEach(sheet => {
        const ws = XLSX.utils.json_to_sheet(sheet.data);
        
        // Set column widths
        const maxWidth = 20;
        const colWidths = [];
        if (sheet.data.length > 0) {
            Object.keys(sheet.data[0]).forEach(key => {
                colWidths.push({ wch: Math.min(maxWidth, key.length + 2) });
            });
        }
        ws['!cols'] = colWidths;

        XLSX.utils.book_append_sheet(wb, ws, sheet.name);
    });

    XLSX.writeFile(wb, filename);
    showAlert(`Excel file "${filename}" downloaded successfully!`, 'success');
}

/**
 * Export Residents Data to Excel
 */
function exportResidentsToExcel() {
    const residentsData = state.residents.map(r => ({
        'Room No': r.room,
        'Owner Name': r.ownerName || '-',
        'Phone': r.phone || '-',
        'Email': r.email || '-',
        'Vehicle Number': r.vehicle || '-',
        'Notes': r.notes || '-',
        'Created Date': new Date(r.createdAt).toLocaleDateString()
    }));

    exportToExcel(`Residents_${getTimestamp()}.xlsx`, [
        {
            name: 'Residents',
            data: residentsData
        }
    ]);
}

/**
 * Export Collections Data to Excel
 */
function exportCollectionsToExcel() {
    const collectionsData = state.collections.map(c => ({
        'Room No': c.room,
        'Owner Name': state.residents.find(r => r.room === c.room)?.ownerName || 'N/A',
        'Amount (₹)': c.amount,
        'Date': new Date(c.date).toLocaleDateString(),
        'Payment Mode': c.mode,
        'Notes': c.notes || '-'
    }));

    const totalCollected = state.collections.reduce((sum, c) => sum + c.amount, 0);

    exportToExcel(`Collections_${getTimestamp()}.xlsx`, [
        {
            name: 'Collections',
            data: collectionsData
        },
        {
            name: 'Summary',
            data: [
                { 'Metric': 'Total Collections', 'Value': totalCollected },
                { 'Metric': 'Number of Records', 'Value': collectionsData.length },
                { 'Metric': 'Export Date', 'Value': new Date().toLocaleString() }
            ]
        }
    ]);
}

/**
 * Export Expenses Data to Excel
 */
function exportExpensesToExcel() {
    const expensesData = state.expenses.map(e => ({
        'Description': e.description,
        'Amount (₹)': e.amount,
        'Category': e.category,
        'Date': new Date(e.date).toLocaleDateString(),
        'Notes': '-'
    }));

    const totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);

    exportToExcel(`Expenses_${getTimestamp()}.xlsx`, [
        {
            name: 'Expenses',
            data: expensesData
        },
        {
            name: 'Summary',
            data: [
                { 'Metric': 'Total Expenses', 'Value': totalExpenses },
                { 'Metric': 'Number of Records', 'Value': expensesData.length },
                { 'Metric': 'Export Date', 'Value': new Date().toLocaleString() }
            ]
        }
    ]);
}

/**
 * Export Outstanding/Bill Status to Excel
 */
function exportOutstandingToExcel() {
    const outstandingData = state.residents.map(r => {
        const roomCollections = state.collections.filter(c => c.room === r.room);
        const totalPaid = roomCollections.reduce((sum, c) => sum + c.amount, 0);
        const expectedAmount = state.monthlyBill * 12;
        const outstanding = Math.max(0, expectedAmount - totalPaid);
        const monthsOutstanding = state.monthlyBill > 0 ? Math.ceil(outstanding / state.monthlyBill) : 0;

        return {
            'Room No': r.room,
            'Owner Name': r.ownerName || '-',
            'Monthly Bill (₹)': state.monthlyBill,
            'Total Expected (₹)': expectedAmount,
            'Total Paid (₹)': totalPaid,
            'Outstanding (₹)': outstanding,
            'Months Outstanding': monthsOutstanding,
            'Status': outstanding > 0 ? 'Pending' : 'Clear'
        };
    });

    const totalExpected = state.monthlyBill * 12 * state.residents.length;
    const totalCollected = state.collections.reduce((sum, c) => sum + c.amount, 0);
    const totalOutstanding = Math.max(0, totalExpected - totalCollected);

    exportToExcel(`Outstanding_${getTimestamp()}.xlsx`, [
        {
            name: 'Outstanding',
            data: outstandingData
        },
        {
            name: 'Summary',
            data: [
                { 'Metric': 'Total Residents', 'Value': state.residents.length },
                { 'Metric': 'Monthly Bill per Room (₹)', 'Value': state.monthlyBill },
                { 'Metric': 'Total Expected (₹)', 'Value': totalExpected },
                { 'Metric': 'Total Collected (₹)', 'Value': totalCollected },
                { 'Metric': 'Total Outstanding (₹)', 'Value': totalOutstanding },
                { 'Metric': 'Collection Rate (%)', 'Value': state.monthlyBill > 0 ? ((totalCollected / totalExpected) * 100).toFixed(2) : 0 },
                { 'Metric': 'Export Date', 'Value': new Date().toLocaleString() }
            ]
        }
    ]);
}

/**
 * Export Complete Data (All sections) to Excel
 */
function exportCompleteDataToExcel() {
    const residentsData = state.residents.map(r => ({
        'Room No': r.room,
        'Owner Name': r.ownerName || '-',
        'Phone': r.phone || '-',
        'Email': r.email || '-',
        'Vehicle Number': r.vehicle || '-',
        'Notes': r.notes || '-'
    }));

    const collectionsData = state.collections.map(c => ({
        'Room No': c.room,
        'Owner Name': state.residents.find(r => r.room === c.room)?.ownerName || 'N/A',
        'Amount (₹)': c.amount,
        'Date': new Date(c.date).toLocaleDateString(),
        'Payment Mode': c.mode,
        'Notes': c.notes || '-'
    }));

    const expensesData = state.expenses.map(e => ({
        'Description': e.description,
        'Amount (₹)': e.amount,
        'Category': e.category,
        'Date': new Date(e.date).toLocaleDateString()
    }));

    const outstandingData = state.residents.map(r => {
        const roomCollections = state.collections.filter(c => c.room === r.room);
        const totalPaid = roomCollections.reduce((sum, c) => sum + c.amount, 0);
        const expectedAmount = state.monthlyBill * 12;
        const outstanding = Math.max(0, expectedAmount - totalPaid);

        return {
            'Room No': r.room,
            'Owner Name': r.ownerName || '-',
            'Total Paid (₹)': totalPaid,
            'Outstanding (₹)': outstanding,
            'Status': outstanding > 0 ? 'Pending' : 'Clear'
        };
    });

    // Calculate summaries
    const totalCollected = state.collections.reduce((sum, c) => sum + c.amount, 0);
    const totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);
    const balance = totalCollected - totalExpenses;

    const summaryData = [
        { 'Metric': 'Total Residents', 'Value': state.residents.length },
        { 'Metric': 'Monthly Bill per Room (₹)', 'Value': state.monthlyBill },
        { 'Metric': 'Total Collected (₹)', 'Value': totalCollected },
        { 'Metric': 'Total Expenses (₹)', 'Value': totalExpenses },
        { 'Metric': 'Current Balance (₹)', 'Value': balance },
        { 'Metric': 'Total Collections Count', 'Value': state.collections.length },
        { 'Metric': 'Total Expenses Count', 'Value': state.expenses.length },
        { 'Metric': 'Export Date & Time', 'Value': new Date().toLocaleString() }
    ];

    exportToExcel(`CMC_Complete_Report_${getTimestamp()}.xlsx`, [
        {
            name: 'Summary',
            data: summaryData
        },
        {
            name: 'Residents',
            data: residentsData.length > 0 ? residentsData : [{ 'Info': 'No data available' }]
        },
        {
            name: 'Collections',
            data: collectionsData.length > 0 ? collectionsData : [{ 'Info': 'No data available' }]
        },
        {
            name: 'Expenses',
            data: expensesData.length > 0 ? expensesData : [{ 'Info': 'No data available' }]
        },
        {
            name: 'Outstanding',
            data: outstandingData.length > 0 ? outstandingData : [{ 'Info': 'No data available' }]
        }
    ]);
}

/**
 * Get formatted timestamp for filenames
 */
function getTimestamp() {
    const now = new Date();
    return now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
}

/**
 * Setup automatic backup to Excel (optional)
 * Call this function to enable automatic daily backups
 */
function enableAutomaticBackup() {
    const lastBackup = localStorage.getItem('lastBackupDate');
    const today = new Date().toISOString().split('T')[0];

    if (lastBackup !== today) {
        // Backup every day
        exportCompleteDataToExcel();
        localStorage.setItem('lastBackupDate', today);
        console.log('Automatic backup completed:', today);
    }
}
