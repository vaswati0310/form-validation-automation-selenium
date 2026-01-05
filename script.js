document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("regForm");
    const submitBtn = document.getElementById("submitBtn");
    const formErrors = document.getElementById("formErrors");
    const strengthDiv = document.getElementById("strength");

    const states = {
        USA: ["California", "New York", "Texas"],
        India: ["Maharashtra", "Delhi", "Karnataka"],
        Canada: ["Ontario", "Quebec", "British Columbia"]
    };

    const cities = {
        California: ["Los Angeles", "San Francisco", "San Diego"],
        "New York": ["New York City", "Buffalo", "Albany"],
        Texas: ["Houston", "Austin", "Dallas"],
        Maharashtra: ["Mumbai", "Pune", "Nagpur"],
        Delhi: ["New Delhi", "Delhi"],
        Karnataka: ["Bangalore", "Mysore", "Hubli"],
        Ontario: ["Toronto", "Ottawa", "Hamilton"],
        Quebec: ["Montreal", "Quebec City"],
        "British Columbia": ["Vancouver", "Victoria"]
    };

    const disposableDomains = [
        "tempmail.com",
        "yopmail.com",
        "mailinator.com",
        "guerrillamail.com"
    ];

    const countryCodes = {
        USA: "+1",
        India: "+91",
        Canada: "+1"
    };

    function showError(field, message) {
        const errorSpan = field.closest(".form-group").querySelector(".error");
        errorSpan.textContent = message;
        field.classList.add("error-border");
    }

    function clearError(field) {
        const errorSpan = field.closest(".form-group").querySelector(".error");
        errorSpan.textContent = "";
        field.classList.remove("error-border");
    }

    document.getElementById("country").addEventListener("change", e => {
        const stateSelect = document.getElementById("state");
        stateSelect.innerHTML = `<option value="">Select State</option>`;
        document.getElementById("city").innerHTML = `<option value="">Select City</option>`;

        (states[e.target.value] || []).forEach(state => {
            stateSelect.add(new Option(state, state));
        });

        validateForm();
    });

    document.getElementById("state").addEventListener("change", e => {
        const citySelect = document.getElementById("city");
        citySelect.innerHTML = `<option value="">Select City</option>`;

        (cities[e.target.value] || []).forEach(city => {
            citySelect.add(new Option(city, city));
        });

        validateForm();
    });

    document.getElementById("password").addEventListener("input", e => {
        const val = e.target.value;
        strengthDiv.className = "";

        if (val.length >= 12 && /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W])/.test(val)) {
            strengthDiv.textContent = "Strength: Strong";
            strengthDiv.classList.add("strong");
        } else if (val.length >= 8 && /(?=.*\d)(?=.*[a-zA-Z])/.test(val)) {
            strengthDiv.textContent = "Strength: Medium";
            strengthDiv.classList.add("medium");
        } else {
            strengthDiv.textContent = "Strength: Weak";
            strengthDiv.classList.add("weak");
        }

        validateForm();
    });

    function validateForm() {
        let valid = true;
        formErrors.style.display = "none";

        const fname = document.getElementById("fname");
        const lname = document.getElementById("lname");
        const email = document.getElementById("email");
        const phone = document.getElementById("phone");
        const country = document.getElementById("country");
        const state = document.getElementById("state");
        const city = document.getElementById("city");
        const password = document.getElementById("password");
        const confirmPassword = document.getElementById("confirmPassword");
        const terms = document.getElementById("terms");

        [fname, lname, email, phone, country, state, city, password, confirmPassword].forEach(field => {
            if (!field.value.trim()) {
                showError(field, "This field is required");
                valid = false;
            } else {
                clearError(field);
            }
        });

        if (email.value) {
            const domain = email.value.split("@")[1];
            if (!/\S+@\S+\.\S+/.test(email.value)) {
                showError(email, "Invalid email format");
                valid = false;
            } else if (disposableDomains.includes(domain)) {
                showError(email, "Disposable emails not allowed");
                valid = false;
            }
        }

        if (country.value && phone.value) {
            const code = countryCodes[country.value];
            if (!phone.value.startsWith(code)) {
                showError(phone, `Phone must start with ${code}`);
                valid = false;
            }
        }

        if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
            showError(confirmPassword, "Passwords do not match");
            valid = false;
        }

        const genderChecked = document.querySelector('input[name="gender"]:checked');
        const genderError = document.querySelector(".gender-options")
            .closest(".form-group")
            .querySelector(".error");

        genderError.textContent = genderChecked ? "" : "Please select gender";
        if (!genderChecked) valid = false;

        if (!terms.checked) {
            showError(terms, "You must agree to terms");
            valid = false;
        } else {
            clearError(terms);
        }

        submitBtn.disabled = !valid;

        if (!valid) {
            formErrors.textContent = "Please fix the errors highlighted below";
            formErrors.style.display = "block";
        }

        return valid;
    }

    form.querySelectorAll("input, select, textarea").forEach(el => {
        el.addEventListener("input", validateForm);
        el.addEventListener("change", validateForm);
    });

    form.addEventListener("submit", e => {
        e.preventDefault();
        if (validateForm()) {
            alert("Registration Successful! Your profile has been submitted successfully.");
            form.reset();
            strengthDiv.textContent = "Strength:";
            strengthDiv.className = "";
            submitBtn.disabled = true;
            formErrors.style.display = "none";
        }
    });
});