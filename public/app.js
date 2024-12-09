document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");

    // Simple placeholder calendar (add proper one later)
    for (let day = 1; day <= 31; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.style.display = "inline-block";
        dayDiv.style.width = "50px";
        dayDiv.style.height = "50px";
        dayDiv.style.lineHeight = "50px";
        dayDiv.style.margin = "5px";
        dayDiv.style.border = "1px solid #ddd";
        dayDiv.style.textAlign = "center";
        dayDiv.textContent = day;
        calendar.appendChild(dayDiv);
    }
});