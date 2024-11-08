document.getElementById("selfAssessmentForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Get selected values
    const q1 = parseInt(document.getElementById("q1").value);
    const q2 = parseInt(document.getElementById("q2").value);
    const q3 = parseInt(document.getElementById("q3").value);

    // Calculate total score
    const totalScore = q1 + q2 + q3;

    // Determine result
    let resultMessage;
    let resources = [];

    if (totalScore <= 3) {
        resultMessage = "Your responses suggest that you are doing well. Keep it up!";
        resources = ["Maintain a healthy routine.", "Stay connected with friends and family."];
    } else if (totalScore <= 6) {
        resultMessage = "You may be experiencing some challenges. Consider reaching out for support.";
        resources = ["Consider talking to a counselor.", "Join a support group."];
    } else {
        resultMessage = "It appears you might be facing significant challenges. Please seek professional help.";
        resources = ["Reach out to a mental health professional.", "Visit the campus counseling center."];
    }

    // Display result
    document.getElementById("result").innerText = resultMessage;

    // Display resources
    const resourceList = document.getElementById("resourceList");
    resourceList.innerHTML = ""; // Clear previous resources
    resources.forEach(resource => {
        const listItem = document.createElement("li");
        listItem.innerText = resource;
        resourceList.appendChild(listItem);
    });
});
