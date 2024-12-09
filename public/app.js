// Import Firebase dependencies
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "nannytracker-e0441.firebaseapp.com",
    projectId: "nannytracker-e0441",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Handle Form Submission
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
        // Reset the form
        document.getElementById("leave-form").reset();
    } catch (error) {
        console.error("Error booking leave:", error);
        alert("Failed to book leave. Please try again.");
    }
});