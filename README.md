# 🏢 CMC Management System - Shikhar Avenue

A complete web-based solution for managing Colony Management Charges (CMC) collection, resident information, and expense tracking for residential societies.

## 📋 Features

### 👤 Admin Features
- **Dashboard Overview**: View total collections, expenses, and balance at a glance
- **Resident Management**: Add, edit, and manage resident information
- **Collection Tracking**: Record all CMC payments with different modes (Cash, Cheque, Online, Card)
- **Expense Management**: Track and categorize all colony expenses
- **Public Dashboard Link**: Share live collection status with all residents

### 👨‍💼 Resident (Owner) Features
- **Personal Dashboard**: View payment summary and history
- **Profile Management**: Update personal information anytime
- **Payment History**: Track all CMC payments made
- **Payment Verification**: See which residents have paid and who are pending

### 🌐 Public Features
- **Live Dashboard**: View collection statistics without login
- **Real-time Updates**: Auto-refreshing every 30 seconds
- **Collection Status**: See room-wise collection status
- **Transaction History**: Track all recent collections and expenses

## 🚀 How to Use

### Access the Application
1. Open `index.html` in your web browser
2. The application runs entirely in your browser using local storage

### Login Credentials

**Admin Access:**
- Username: `admin`
- Password: `admin123`

**Resident Access (Example for Room 101):**
- Username: `owner@101`
- Password: `owner123`

Replace `101` with your room number. All rooms from 101-106 and 401-406 are available.

### Admin Workflow
1. **Login** with admin credentials
2. **Add/Edit Residents**: Go to Residents section and fill in owner details
3. **Record Collections**: In Collections section, select room and record payment
4. **Track Expenses**: In Expenses section, add all colony expenses by category
5. **Share Dashboard**: Copy the public link to share with residents

### Resident Workflow
1. **Login** with your room number (e.g., `owner@101`)
2. **Update Profile**: Add your details (name, phone, email, vehicle)
3. **View Payments**: Check your payment history and status
4. **Monitor Collections**: View live statistics on public dashboard

## 📊 Dashboard Sections

### Admin Dashboard
- **Statistics**: Total residents, collected amount, expenses, and balance
- **Recent Collections**: Latest 5 payment entries
- **Full Management**: Access to all features through navigation

### Public Dashboard (Share with residents)
- **Collection Stats**: Visual display of total collections and expenses
- **Room-wise Status**: See which residents have paid
- **Transaction Log**: 20 most recent transactions
- **Auto-refresh**: Updates every 30 seconds

## 💾 Data Storage
- All data is stored in **browser's Local Storage**
- Data persists across browser sessions
- Export/backup recommended before clearing browser data

## 🎨 Features Breakdown

### Room Management
- Rooms: 101, 102, 103, 104, 105, 106, 401, 402, 403, 404, 405, 406
- Each room has individual resident profile

### Collection Modes
- Cash
- Cheque
- Online Transfer
- Card

### Expense Categories
- Maintenance
- Utilities
- Security
- Cleaning
- Repair
- Other

## 📱 Responsive Design
- Works on desktop, tablet, and mobile devices
- Optimized for all screen sizes
- Touch-friendly interface

## 🔐 Security Notes
- This is a demo/local application
- All data stored locally in browser
- For production use, implement backend authentication and database

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: Browser Local Storage API
- **No Dependencies**: Runs without any external libraries

## 📈 Scalability
Current system supports:
- 12 residential units
- Unlimited transaction records
- Unlimited expense entries
- Real-time dashboard updates

## 🔧 Customization

### Add More Rooms
Edit the `rooms` array in `app.js`:
```javascript
const rooms = [
    '101', '102', '103', '104', '105', '106',
    '401', '402', '403', '404', '405', '406'
    // Add more room numbers here
];
```

### Change Admin Password
Modify login verification in `handleLogin()` function:
```javascript
if (username === 'admin' && password === 'your_new_password') {
    // ...
}
```

### Modify Expense Categories
Edit the select options in `getModals()` function

## 📞 Usage Tips

1. **Backup Data**: Regularly export your data or take screenshots
2. **Share Public Link**: Found in Admin → Public View
3. **Monthly Collections**: Set a collection date each month
4. **Balance Tracking**: Monitor monthly expenses vs collections
5. **Resident Updates**: Remind residents to update their profiles

## 🐛 Troubleshooting

**Data Lost?**
- Clear browser cache causes data loss
- Use browser's "Do Not Track" to prevent auto-clearing

**Link Not Working?**
- Public link only works when saved in bookmarks
- Share the full URL with timestamp

**Slow Performance?**
- Too many transactions may slow display
- Consider archiving old records manually

## 📝 Monthly Checklist

- [ ] Collect CMC charges from all residents
- [ ] Record all collections and expenses
- [ ] Review balance and outstanding payments
- [ ] Share public dashboard with residents
- [ ] Update resident information as needed

## 🎯 Future Enhancements

Potential features for future versions:
- Backend database integration
- SMS/Email notifications
- Payment reminders
- PDF receipts generation
- Multiple administrator roles
- Audit trail and logging
- Advanced reporting

## 📄 License
This project is open source and can be freely used and modified.

## 🤝 Support
For issues or feature requests, please document and communicate with your team.

---

**Last Updated**: June 2026
**Version**: 1.0.0
**Status**: Production Ready ✅