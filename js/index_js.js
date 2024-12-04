var siteName = document.getElementById("bookmarkName");
var siteURL = document.getElementById("bookmarkURL");
var submitBtn = document.getElementById("submitBtn");
var tableContent = document.getElementById("tableContent");
var deleteBtns;
var visitBtns;
var closeBtn = document.getElementById("closeBtn");
var boxModal = document.querySelector(".box-info");
var bookmarks = [];

if (localStorage.getItem("bookmarksList")) {
  bookmarks = JSON.parse(localStorage.getItem("bookmarksList"));
  for (var x = 0; x < bookmarks.length; x++) {
    displayBookmark(x);
  }
}

// Function to display bookmark
function displayBookmark(indexOfWebsite) {
  var newBookmark = `
      <tr>
        <td>${indexOfWebsite + 1}</td>
        <td>${bookmarks[indexOfWebsite].siteName}</td>
        <td>
          <button class="btn btn-visit" data-index="${indexOfWebsite}">
            <i class="fa-solid fa-eye pe-2"></i>Visit
          </button>
        </td>
        <td>
          <button class="btn btn-delete pe-2" data-index="${indexOfWebsite}">
            <i class="fa-solid fa-trash-can"></i> Delete
          </button>
        </td>
      </tr>
  `;
  tableContent.innerHTML += newBookmark;

  // Adding click event to delete button
  deleteBtns = document.querySelectorAll(".btn-delete");
  for (var j = 0; j < deleteBtns.length; j++) {
    deleteBtns[j].addEventListener("click", function (e) {
      deleteBookmark(e);
    });
  }

  // Adding click event to visit button
  visitBtns = document.querySelectorAll(".btn-visit");
  for (var l = 0; l < visitBtns.length; l++) {
    visitBtns[l].addEventListener("click", function (e) {
      visitWebsite(e);
    });
  }
}

// Clear input fields
function clearInput() {
  siteName.value = "";
  siteURL.value = "";
}

// Capitalize the first letter of the site name
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Validate name and URL
var nameRegex = /^\w{3,20}$/; // Name should be between 3 and 20 characters
var urlRegex =
  /^(https?:\/\/|www\.)[\w.-]+\.(com|net|org|info|io|gov|edu|[a-z]{2,})$/i; // URL should end with .com, .net, .org

// Handle submit button click
submitBtn.addEventListener("click", function () {
  if (
    siteName.classList.contains("is-valid") &&
    siteURL.classList.contains("is-valid")
  ) {
    var bookmark = {
      siteName: capitalize(siteName.value),
      siteURL: siteURL.value,
    };

    // Check for duplicate name or URL
    var isDuplicate = bookmarks.some(function (existingBookmark) {
      return (
        existingBookmark.siteName === bookmark.siteName ||
        existingBookmark.siteURL === bookmark.siteURL
      );
    });

    if (isDuplicate) {
      showDuplicateError("This name or URL already exists.");
    } else {
      bookmarks.push(bookmark);
      localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
      displayBookmark(bookmarks.length - 1);
      clearInput();
      siteName.classList.remove("is-valid");
      siteURL.classList.remove("is-valid");
    }
  } else {
    // Invalid data will show the general error modal
    boxModal.classList.remove("d-none");
  }
});

// delete Bookmark
function deleteBookmark(e) {
  var deletedIndex = e.target.getAttribute("data-index"); // Using getAttribute instead of dataset
  bookmarks.splice(deletedIndex, 1);
  localStorage.setItem("bookmarksList", JSON.stringify(bookmarks));
  tableContent.innerHTML = "";
  for (var k = 0; k < bookmarks.length; k++) {
    displayBookmark(k);
  }
}

// Visit website
function visitWebsite(e) {
  var websiteIndex = e.target.getAttribute("data-index");

  var url = bookmarks[websiteIndex].siteURL;

  if (!/^https?:\/\//.test(url)) {
    url = "https://" + url;
  }

  window.open(url);
}

// Validate function
function validate(element, regex) {
  if (regex.test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
  }
}

// Name and URL validation on input
siteName.addEventListener("input", function () {
  validate(siteName, nameRegex);
});

siteURL.addEventListener("input", function () {
  validate(siteURL, urlRegex);
});

// Show duplicate error message
function showDuplicateError(message) {
  var errorMessage = document.createElement("p");
  errorMessage.textContent = message;
  errorMessage.style.color = "red";
  var boxContent = document.querySelector(".box-content");
  boxContent.appendChild(errorMessage);
  boxModal.classList.remove("d-none");
}

 // Close modal when clicking the close button
closeBtn.addEventListener("click", closeModal);

// Close modal function
function closeModal() {
  boxModal.classList.add("d-none");
  var errorMessage = document.querySelector(".box-content p");
  if (errorMessage) {
    errorMessage.remove();
  }
}

// Close modal when pressing ESC key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal();
  }
});

// Close modal when clicking outside the modal content
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("box-info")) {
    closeModal();
  }
});
