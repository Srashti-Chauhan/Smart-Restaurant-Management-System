// ===================== REGISTER =====================
function register(e) {
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    // PATTERNS
    let emailPattern = /^[a-zA-Z0-9]+@gmail\.com$/;
    let passwordPattern = /^[a-zA-Z0-9]{6}$/;

    // VALIDATION
    if (name === "" || email === "" || password === "") {
        alert("All fields are required ❌");
        return;
    }

    if (!emailPattern.test(email)) {
        alert("Email must be like xyz23@gmail.com ❌");
        return;
    }

    if (!passwordPattern.test(password)) {
        alert("Password must be exactly 6 characters (letters & numbers only) ❌");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // CHECK IF USER EXISTS
    let exists = users.find(user => user.email === email);
    if (exists) {
        alert("User already exists ❌");
        return;
    }

    users.push({ name, email, password });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registered Successfully ✅");
    window.location.href = "login.html";
}

// ===================== LOGIN =====================
function login(e) {
    e.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    let emailPattern = /^[a-zA-Z0-9]+@gmail\.com$/;
    let passwordPattern = /^[a-zA-Z0-9]{6}$/;

    if (!emailPattern.test(email) || !passwordPattern.test(password)) {
        alert("Invalid email or password format ❌");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let validUser = users.find(user => user.email === email && user.password === password);

    if (validUser) {
        localStorage.setItem("currentUser", JSON.stringify(validUser));

        alert("Login Successful ✅");
        window.location.href = "booking.html";
    } else {
        alert("Invalid Credentials ❌");
    }
}

// ===================== BOOKING =====================
function bookTable(e) {
    e.preventDefault();

    let name = document.getElementById("custName").value.trim();
    let people = document.getElementById("people").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;

    if (name === "" || people === "" || date === "" || time === "") {
        alert("Fill all booking details ❌");
        return;
    }

    // ❌ Block past dates
    let today = new Date().toISOString().split("T")[0];
    if (date < today) {
        alert("Cannot book past dates ❌");
        return;
    }

    // GET EXISTING BOOKINGS (IMPORTANT)
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    // NEW BOOKING OBJECT
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

let newBooking = {
    userEmail: currentUser ? currentUser.email : "guest",
    name: name,
    people: people,
    date: date,
    time: time
};

    // ADD NEW BOOKING (NOT OVERWRITE)
    bookings.push(newBooking);

    // SAVE BACK TO LOCAL STORAGE
    localStorage.setItem("bookings", JSON.stringify(bookings));

    console.log("Before Save:", bookings);

    alert("Booking Saved Successfully ✅");

    window.location.href = "payment.html";

}

// ===================== PAYMENT =====================
function pay(e) {
    e.preventDefault();

    let cardNo = document.getElementById("cardNo").value.trim();
    let expiry = document.getElementById("expiry").value.trim();
    let cvv = document.getElementById("cvv").value.trim();

    // PATTERNS
    let cardPattern = /^[0-9]{12}$/;
    let expiryPattern = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
    let cvvPattern = /^[0-9]{3}$/;

    // CARD VALIDATION
    if (!cardPattern.test(cardNo)) {
        alert("Card number must be exactly 12 digits ❌");
        return;
    }

    // EXPIRY FORMAT VALIDATION
    if (!expiryPattern.test(expiry)) {
        alert("Expiry must be in format MM/YY ❌");
        return;
    }

    // EXPIRY DATE CHECK (NO PAST)
    let [month, year] = expiry.split("/");

    let currentDate = new Date();
    let currentYear = currentDate.getFullYear() % 100; // last 2 digits
    let currentMonth = currentDate.getMonth() + 1;

    month = parseInt(month);
    year = parseInt(year);

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        alert("Card is expired ❌");
        return;
    }

    // CVV VALIDATION
    if (!cvvPattern.test(cvv)) {
        alert("CVV must be exactly 3 digits ❌");
        return;
    }

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