let users = [];
// -----------------Load Users From Localstorage---------------------------------
function loadUsers() {
  return JSON.parse(localStorage.getItem("userDB")) || [];
}
// -----------------Save Users In Localstorage----------------------------------
function saveUsers(users) {
  localStorage.setItem("userDB", JSON.stringify(users));
}
// ----------------------------------------------------------------------------
// ---------------Convert between login or register or other pages-------------
document.querySelector(".new-account").onclick = () => {
  location.hash = "register";
};
document.querySelector(".login-account").onclick = () => {
  location.hash = "login";
};

function showPageFromHash() {
  const hash = location.hash.replace("#", "") || "login";
  document.querySelectorAll(".app > div").forEach((div) => {
    div.style.display = div.id === hash ? "block" : "none";
  });
}
window.addEventListener("hashchange", showPageFromHash);
window.addEventListener("load", showPageFromHash);
// ----------------------------------------------------------------------------
// ---------------------Fill the Select options of birth date------------------
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

document.querySelector(".birth #day").innerHTML = [...Array(30)].map(
  (ele, i) =>
    `<option value= ${i + 1} ${
      new Date().getDate() === i + 1 ? "selected" : ""
    }> ${i + 1} </option>`
);

document.querySelector(".birth #month").innerHTML = monthNames.map(
  (month, i) =>
    `<option value= ${month} ${
      new Date().getMonth() === i ? "selected" : ""
    }> ${month} </option>`
);

document.querySelector(".birth #year").innerHTML = [...Array(50)].map(
  (ele, i) =>
    `<option value= ${new Date().getFullYear() - i} > ${
      new Date().getFullYear() - i
    } </option>`
);

// ----------------------------------------------------------------------------
// Get values of Firstname, Lastname, Username, Password and check if the fields is empty
// ----------------------------------------------------------
let firstname = "",
  lastname = "",
  username = "",
  password = "",
  year = new Date().getFullYear();
let gender = document.querySelector("input[name=gender]:checked")?.value;

document.querySelector(".register").addEventListener("input", (e) => {
  if (e.target.id === "firstname") firstname = e.target.value;
  if (e.target.id === "lastname") lastname = e.target.value;
  if (e.target.id === "username") username = e.target.value;
  if (e.target.id === "register-password") password = e.target.value;
  if (e.target.id === "year") year = e.target.value;
  gender = document.querySelector("input[name=gender]:checked")?.value;
});

function checkEmptyFields(field) {
  const fieldDiv = document.querySelector(`.${field}`);

  if (fieldDiv.querySelector("select")) {
    fieldDiv.querySelectorAll("select").forEach((ele) => {
      ele.addEventListener("focus", () => {
        if (ele.classList.contains("required"))
          fieldDiv.classList.add(`show-${field}`);
      });

      ele.addEventListener("blur", () => {
        fieldDiv.classList.remove(`show-${field}`);
        if (Number(year) + 10 >= new Date().getFullYear()) {
          fieldDiv.querySelectorAll("select").forEach((ele) => {
            ele.classList.add("required");
          });
        } else {
          fieldDiv.querySelectorAll("select").forEach((ele) => {
            ele.classList.remove("required");
          });
        }
      });
    });
    return;
  }

  fieldDiv.firstElementChild.addEventListener("focus", () => {
    if (fieldDiv.firstElementChild.classList.contains("required"))
      fieldDiv.classList.add(`show-${field}`);
  });

  fieldDiv.firstElementChild.addEventListener("blur", () => {
    fieldDiv.classList.remove(`show-${field}`);

    if (fieldDiv.firstElementChild.value === "") {
      fieldDiv.firstElementChild.classList.add("required");
    } else {
      fieldDiv.firstElementChild.classList.remove("required");
    }
  });
}

checkEmptyFields("firstname");
checkEmptyFields("lastname");
checkEmptyFields("username");
checkEmptyFields("register-password");
checkEmptyFields("options");

const emailPhoneInput = document.querySelector(".username");
emailPhoneInput.style.setProperty(
  "--before-content",
  '"Please enter your email or Mobile number?"'
);

const passWordInput = document.querySelector(".register-password");
passWordInput.style.setProperty(
  "--before-content",
  '"Please enter your password?"'
);

// -----------------------------------------------------------------------------
// ----Handle Validate Username, PassWord And All Required Inputs Function------
const validators = {
  required: (value) => value.trim() !== "",
  emailOrPhone: (value) => /^\d{7}$|^[0-9a-zA-Z]+@\w+$/.test(value),
  password: (value) => {
    const errors = [];
    if (!/[a-z]/.test(value)) errors.push("Must contain a small letter");
    if (!/[A-Z]/.test(value)) errors.push("Must contain a capital letter");
    if (!/[0-9]/.test(value)) errors.push("Must contain a digit");
    if (!/[!@#$&]/.test(value))
      errors.push("Must contain a special char (!@#$&)");
    if (value.length < 8) errors.push("Must be at least 8 characters");
    return errors;
  },
};

function validationField(value, type) {
  if (type === "password") {
    const errors = validators.password(value);
    return { valid: errors.length === 0, errors };
  } else {
    const valid = validators[type](value);
    return { valid, errors: valid ? [] : [`Invalid ${type}`] };
  }
}

function showFieldError(fieldElement, message) {
  fieldElement.classList.add("required");
  fieldElement.dataset.error = message.join(", ");
}

function clearFieldError(fieldElement) {
  fieldElement.classList.remove("required");
  fieldElement.removeAttribute("data-error");
}

// ------------------------------------------------------------------------------
// -------------------------Handle Password Color Function-----------------------
function handlePwdColor(pwdInput) {
  pwdInput.oninput = () => {
    if (
      /[a-z]/.test(pwdInput.value) &&
      /[A-Z]/.test(pwdInput.value) &&
      /[0-9]/.test(pwdInput.value) &&
      /[!@#$&]/.test(pwdInput.value) &&
      pwdInput.value.length >= 8
    ) {
      pwdInput.style.color = "green";
    } else {
      pwdInput.style.color = "#b00000";
    }
  };
}

// ------------------------------------------------------------------------------
// ----------------------------------Handle Register-----------------------------
const pwdRegisterInput = document.getElementById("register-password");
pwdRegisterInput.style.color = "#b00000";

handlePwdColor(pwdRegisterInput);

document.querySelector(`.register-form`).addEventListener("submit", (e) => {
  e.preventDefault();

  const day = document.getElementById("day").value;
  const month = document.getElementById("month").value;
  const birthDate = `${day}-${month}-${year}`;

  colorRequireFields();

  const fields = [
    { el: document.getElementById("firstname"), type: "required" },
    { el: document.getElementById("lastname"), type: "required" },
    { el: document.getElementById("username"), type: "emailOrPhone" },
    { el: document.getElementById("register-password"), type: "password" },
  ];

  fields.forEach(({ el, type }) => {
    clearFieldError(el);
    const { valid, errors } = validationField(el.value, type);
    if (!valid) {
      showFieldError(el, errors);
    }
  });

  if (!firstname) {
    document.querySelector(".firstname").classList.add(`show-firstname`);
    return;
  } else if (!lastname) {
    document.querySelector(".lastname").classList.add(`show-lastname`);
    return;
  } else if (Number(year) + 10 >= new Date().getFullYear()) {
    document.querySelector(".birth .options").classList.add(`show-options`);
    return;
  } else if (!gender) {
    document.querySelector(".gender .options").classList.add(`show-options`);
    return;
  } else if (!validationField(username, "emailOrPhone").valid) {
    document.querySelector(".username").classList.add(`show-username`);
    if (username) {
      emailPhoneInput.style.setProperty(
        "--before-content",
        '"Your Mobile number or Email is Wrong"'
      );
    }
    return;
  } else if (!validationField(password, "password").valid) {
    document
      .querySelector(".register-password")
      .classList.add(`show-register-password`);
    if (password) {
      passWordInput.style.setProperty(
        "--before-content",
        `"${validators.password(password)[0]}"`
      );
    }
    return;
  }

  const users = JSON.parse(localStorage.getItem("userDB") || "[]");
  if (users.find((u) => u.username === username)) {
    showFieldError(document.getElementById("username"), [
      "Username already exists",
    ]);
    emailPhoneInput.classList.add(`show-username`);
    emailPhoneInput.style.setProperty(
      "--before-content",
      '"Username already exists. Please Enter another one?"'
    );
    return;
  }

  if (
    !firstname ||
    !lastname ||
    !gender ||
    !validationField(username, "emailOrPhone").valid ||
    !validationField(password, "password").valid ||
    Number(year) + 10 >= new Date().getFullYear()
  )
    return;

  e.target.reset();

  const newUser = {
    firstname,
    lastname,
    birthDate,
    gender,
    username,
    password,
  };

  users.push(newUser);

  saveUsers(users);

  window.location.href = "#welcome";
});

// ------------------------------------------------------------------------------
// --------------------------Color All Required Fields--------------------------
function colorRequireFields() {
  if (!firstname)
    document.getElementById("firstname").classList.add("required");
  if (!lastname) document.getElementById("lastname").classList.add("required");
  if (!username) document.getElementById("username").classList.add("required");
  if (!password)
    document.getElementById("register-password").classList.add("required");
  if (!gender)
    document
      .querySelectorAll(".gender .options label")
      .forEach((ele) => ele.classList.add(`required`));
  if (Number(year) + 10 >= new Date().getFullYear())
    document
      .querySelectorAll(".birth .options select")
      .forEach((ele) => ele.classList.add("required"));
}
// -------------------------------------------------------------------------------
// ------------------------Remove Toasts in Click everywhere in page--------------
document.addEventListener("click", (e) => {
  if (
    e.target.type === "text" ||
    e.target.type === "password" ||
    e.target.type === "select-one"
  )
    return;

  if (e.target.type === "radio") {
    document.querySelectorAll(".gender label").forEach((ele) => {
      ele.classList.remove("required");
    });
  }
  document.querySelector(".firstname").classList.remove(`show-firstname`);
  document.querySelector(".lastname").classList.remove(`show-lastname`);
  document.querySelector(".birth .options").classList.remove(`show-options`);
  document.querySelector(".gender .options").classList.remove(`show-options`);
  document.querySelector(".username").classList.remove(`show-username`);
  document
    .querySelector(".register-password")
    .classList.remove(`show-register-password`);
});

// ------------------------------------------------------------------------------
// ------------------------------------Handle Login------------------------------
const emailLoginInput = document.getElementById("login-user");
const pwdLoginInput = document.getElementById("login-password");
pwdLoginInput.style.color = "#b00000";

handlePwdColor(pwdLoginInput);

document.querySelector(`.login-form`).addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validationField(emailLoginInput.value, "emailOrPhone").valid) {
    console.log(validationField(emailLoginInput.value, "emailOrPhone").errors[0]);
    return;
  } else if(!validationField(pwdLoginInput.value, "password").valid) {
    console.log(validationField(pwdLoginInput.value, "password").errors[0]);
    return;
  }

  //----------------Compare UserEmail or Mobile number and password------------
  const userDB = loadUsers();

  const findUser = userDB.find(
    (user) => user.username === emailLoginInput.value
  );
  const comparePWD = findUser?.password === pwdLoginInput.value;

  if (findUser && comparePWD) console.log("You are Login!");
  if (!findUser || !comparePWD) {
    console.log("User name or PassWord is Wrong");
    return;
  }

  e.target.reset();

  location.href = "#hello";
});
// -------------------------------------------------------------------------------
// ---------------------------------Handle Logout---------------------------------
document.getElementById("logout").onclick = () => {
  location.href = "#login";
};
