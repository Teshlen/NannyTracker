// Import Firebase dependencies
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // Replace with your API key
    authDomain: "nannytracker-e0441.firebaseapp.com",
    projectId: "nannytracker-e0441",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// State variable for the current date
let currentDate = new Date();

// Predefined Public Holidays
const publicHolidays = [
    { date: "2024-01-01", name: "New Year's Day" },
    { date: "2024-03-21", name: "Human Rights Day" },
    { date: "2024-03-29", name: "Good Friday" },
    { date: "2024-04-01", name: "Family Day" },
    { date: "2024-04-27", name: "Freedom Day" },
    { date: "2024-05-01", name: "Workers' Day" },
    { date: "2024-06-16", name: "Youth Day" },
    { date: "2024-08-09", name: "Women's Day" },
    { date: "2024-09-24", name: "Heritage Day" },
    { date: "2024-12-16", name: "Day of Reconciliation" },
    { date: "2024-12-25", name: "Christmas Day" },
    { date: "2024-12-26", name: "Day of Goodwill" },
];

// Function to Generate Calendar
async function generateCalendar() {
    const calendar = document.getElementById("calendar");
    calendar.innerHTML = ""; // Clear previous calendar

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    // Display current month and year
    document.getElementById("month-year").textContent = `${currentDate.toLocaleString("default", { month: "long" })} ${year}`;

    const firstDay = new Date(year, month, 1).getDay(); // Day of the week (0-6)
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total days in the month

    // Fetch leave records from Firestore
    const leaveRecords = [];
    try {
        const querySnapshot = await getDocs(collection(db, "leaveRecords"));
        querySnapshot.forEach((doc) => {
            leaveRecords.push({ id: doc.id, ...doc.data() });
        });
    } catch (error) {
        console.error("Error fetching leave records:", error);
    }

    // Generate empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("calendar-cell", "empty");
        calendar.appendChild(emptyCell);
    }

    // Generate cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        const dayCell = document.createElement("div");
        dayCell.classList.add("calendar-cell");
        dayCell.textContent = day;

        // Highlight weekends
        const dayOfWeek = new Date(year, month, day).getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            dayCell.classList.add("weekend");
        }

        // Highlight public holidays
        const publicHoliday = publicHolidays.find((holiday) => holiday.date === dateStr);
        if (publicHoliday) {
            dayCell.classList.add("public-holiday");
            dayCell.title = publicHoliday.name; // Tooltip with holiday name
        }

        // Highlight leave days
        leaveRecords.forEach((record) => {
            const fromDate = new Date(record.from);
            const toDate = new Date(record.to);

            for (let d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
                const rangeDateStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
                if (rangeDateStr === dateStr) {
                    dayCell.classList.add("leave");
                    dayCell.title = `Reason: ${record.reason}`;
                }
            }
        });

        calendar.appendChild(dayCell);
    }
}

// Handle navigation
document.getElementById("prev-month").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1); // Go to the previous month
    generateCalendar();
});

document.getElementById("next-month").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1); // Go to the next month
    generateCalendar();
});

// Handle Form Submission
document.getElementById("leave-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent page refresh

    // Get form values
    const leaveFromDate = document.getElementById("leave-from-date").value;
    const leaveToDate = document.getElementById("leave-to-date").value;
    const leaveReason = document.getElementById("leave-reason").value;

    // Validate date range
    if (!leaveFromDate || !leaveToDate || !leaveReason) {
        alert("All fields are required.");
        return;
    }

    if (new Date(leaveFromDate) > new Date(leaveToDate)) {
        alert("The 'From Date' cannot be after the 'To Date'.");
        return;
    }

    try {
        // Add leave details to Firestore
        await addDoc(collection(db, "leaveRecords"), {
            from: leaveFromDate,
            to: leaveToDate,
            reason: leaveReason,
            timestamp: new Date().toISOString(),
        });
        alert("Leave booked successfully!");
        document.getElementById("leave-form").reset(); // Reset the form
        generateCalendar(); // Refresh the calendar to show the new leave
    } catch (error) {
        console.error("Error booking leave:", error);
        alert("Failed to book leave. Please try again.");
    }
});

// Generate calendar on page load
document.addEventListener("DOMContentLoaded", generateCalendar);