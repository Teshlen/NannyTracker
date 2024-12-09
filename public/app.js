// Import Firebase dependencies
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // Replace with your actual API key
    authDomain: "nannytracker-e0441.firebaseapp.com",
    projectId: "nannytracker-e0441",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to Generate the Calendar
async function generateCalendar() {
    const calendar = document.getElementById("calendar");
    calendar.innerHTML = ""; // Clear any previous content

    // Fetch leave records from Firestore
    const leaveRecords = [];
    try {
        const querySnapshot = await getDocs(collection(db, "leaveRecords"));
        querySnapshot.forEach((doc) => {
            leaveRecords.push(doc.data());
        });
    } catch (error) {
        console.error("Error fetching leave records:", error);
    }

    // Placeholder for the current month (December 2024)
    const daysInMonth = 31;
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.style.display = "inline-block";
        dayDiv.style.width = "50px";
        dayDiv.style.height = "50px";
        dayDiv.style.lineHeight = "50px";
        dayDiv.style.margin = "5px";
        dayDiv.style.border = "1px solid #ddd";
        dayDiv.style.textAlign = "center";

        // Format the day as YYYY-MM-DD
        const dateStr = `2024-12-${day.toString().padStart(2, "0")}`;
        dayDiv.textContent = day;

        // Highlight if it's a booked leave day
        const isLeaveDay = leaveRecords.some((record) => record.date === dateStr);
        if (isLeaveDay) {
            dayDiv.style.backgroundColor = "#f0a500"; // Highlight color
            dayDiv.style.color = "white";
        }

        calendar.appendChild(dayDiv);
    }
}

// Function to Handle Form Submission
document.getElementById("leave-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent page refresh

    // Get form values
    const leaveDate = document.getElementById("leave-date").value;
    const leaveReason = document.getElementById("leave-reason").value;

    try {
        // Add leave details to Firestore
        await addDoc(collection(db, "leaveRecords"), {
            date: leaveDate,
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

// Generate the calendar on page load
document.addEventListener("DOMContentLoaded", generateCalendar);