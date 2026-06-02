// ===================== REGISTER =====================
async function register(e) {
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    let emailPattern = /^[a-zA-Z0-9]+@gmail\.com$/;
    let passwordPattern = /^[a-zA-Z0-9]{6}$/;

    if (name === "" || email === "" || password === "") {
        alert("All fields are required ❌");
        return;
    }

    if (!emailPattern.test(email)) {
        alert("Email must be like xyz23@gmail.com ❌");
        return;
    }

    if (!passwordPattern.test(password)) {
        alert("Password must be exactly 6 characters ❌");
        return;
    }

    try {
        const response = await fetch("https://srms-backend-23db.onrender.com/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Registered Successfully ✅");
        window.location.href = "login.html";

    } catch (error) {
        console.log(error);
        alert("Backend Connection Failed ❌");
    }
}
// ===================== LOGIN =====================
async function login(e) {
    e.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    try {
        const response = await fetch("https://srms-backend-23db.onrender.com/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Login Successful ✅");

        localStorage.setItem("currentUser", JSON.stringify(data.user));

        window.location.href = "booking.html";

    } catch (error) {
        console.log(error);
        alert("Backend Connection Failed ❌");
    }
}
// ===================== BOOKING =====================
async function bookTable(e) {
    e.preventDefault();

    let name = document.getElementById("custName").value.trim();
    let people = document.getElementById("people").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;

    if (name === "" || people === "" || date === "" || time === "") {
        alert("Fill all booking details ❌");
        return;
    }

    let today = new Date().toISOString().split("T")[0];

    if (date < today) {
        alert("Cannot book past dates ❌");
        return;
    }

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    try {
        const response = await fetch("https://srms-backend-23db.onrender.com/booking", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userEmail: currentUser ? currentUser.email : "guest",
                name,
                people,
                date,
                time
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Booking Saved Successfully ✅");
        window.location.href = "payment.html";

    } catch (error) {
        console.log(error);
        alert("Backend Connection Failed ❌");
    }
}

// ===================== PAYMENT =====================
async function pay(e) {
    e.preventDefault();

    let cardNo = document.getElementById("cardNo").value.trim();
    let expiry = document.getElementById("expiry").value.trim();
    let cvv = document.getElementById("cvv").value.trim();

    let cardPattern = /^[0-9]{12}$/;
    let expiryPattern = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
    let cvvPattern = /^[0-9]{3}$/;

    if (!cardPattern.test(cardNo)) {
        alert("Card number must be exactly 12 digits ❌");
        return;
    }

    if (!expiryPattern.test(expiry)) {
        alert("Expiry must be in format MM/YY ❌");
        return;
    }

    let [month, year] = expiry.split("/");
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear() % 100;
    let currentMonth = currentDate.getMonth() + 1;

    month = parseInt(month);
    year = parseInt(year);

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        alert("Card is expired ❌");
        return;
    }

    if (!cvvPattern.test(cvv)) {
        alert("CVV must be exactly 3 digits ❌");
        return;
    }

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const response = await fetch("https://srms-backend-23db.onrender.com/payment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userEmail: currentUser ? currentUser.email : "guest",
            cardNo,
            expiry,
            amount: "500",
            status: "Success"
        })
    });

    const data = await response.json();

    alert("Payment Successful ✅");
    window.location.href = "index.html";
}

// ===================== LOGOUT =====================
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

// ===================== SHOW ALL BOOKINGS =====================
function showBookings() {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    let container = document.getElementById("bookingList");

    if (!container) return;

    container.innerHTML = "";

    if (bookings.length === 0) {
        container.innerHTML = "<p>No bookings yet ❌</p>";
        return;
    }

    bookings.forEach((b, index) => {
        let div = document.createElement("div");

        div.innerHTML = `
            <h4>Booking ${index + 1}</h4>
            <p><b>Name:</b> ${b.name}</p>
            <p><b>Email:</b> ${b.userEmail || "N/A"}</p>
            <p><b>People:</b> ${b.people}</p>
            <p><b>Date:</b> ${b.date}</p>
            <p><b>Time:</b> ${b.time}</p>
            <hr>
        `;

        container.appendChild(div);
    });
}
