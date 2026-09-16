// ========================================
// HEALTHCARE CLINIC JAVASCRIPT
// ========================================


// ========================================
// APPOINTMENT FORM
// ========================================

const appointmentForm =
    document.getElementById("appointmentForm");


if (appointmentForm) {

    appointmentForm.addEventListener(
        "submit",
        async function (event) {

            // Stop page from refreshing
            event.preventDefault();


            // Get form values
            const name =
                document.getElementById("name").value.trim();

            const phone =
                document.getElementById("phone").value.trim();

            const service =
                document.getElementById("service").value;

            const date =
                document.getElementById("date").value;


            const status =
                document.getElementById("status");


            // Basic validation
            if (!name || !phone || !service || !date) {

                status.innerHTML =
                    "❌ Please fill all fields.";

                status.style.color = "red";

                return;
            }


            // Phone validation
            if (phone.length < 10) {

                status.innerHTML =
                    "❌ Please enter a valid phone number.";

                status.style.color = "red";

                return;
            }


            // Show loading message
            status.innerHTML =
                "⏳ Booking appointment...";

            status.style.color = "#1d4ed8";


            try {

                // Send data to backend
                const response = await fetch(
                    "/api/appointments",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name: name,

                            phone: phone,

                            service: service,

                            date: date

                        })
                    }
                );


                // Convert response to JSON
                const result =
                    await response.json();


                // Check result
                if (response.ok) {

                    status.innerHTML =
                        "✅ Appointment booked successfully!";

                    status.style.color = "green";


                    // Clear form
                    appointmentForm.reset();

                } else {

                    status.innerHTML =
                        "❌ " +
                        (result.message ||
                         "Unable to book appointment.");

                    status.style.color = "red";

                }


            } catch (error) {

                console.error(
                    "Backend error:",
                    error
                );


                status.innerHTML =
                    "❌ Backend is not running. Please start server.js.";

                status.style.color = "red";

            }

        }
    );

}


// ========================================
// SET MINIMUM APPOINTMENT DATE
// ========================================

const dateInput =
    document.getElementById("date");


if (dateInput) {

    const today =
        new Date().toISOString().split("T")[0];

    dateInput.min = today;

}


// ========================================
// CONSOLE MESSAGE
// ========================================

console.log(
    "✅ HealthCare Clinic JavaScript loaded successfully."
);