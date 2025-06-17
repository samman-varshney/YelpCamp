// ---- START of bootstrapformValidate.js content ----
(function () {
  'use strict'

  const forms = document.querySelectorAll('.validate-form');

  Array.from(forms).forEach(function (form) {
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  });
})();
// ---- END of bootstrapformValidate.js content ----



// ---- START of fileValidation.js content ----
function showCustomAlert(message) {
  const alertBox = document.getElementById("custom-alert-box");
  const alertMsg = document.getElementById("custom-alert-msg");

  alertMsg.textContent = message;
  alertBox.classList.remove("d-none");
  alertBox.classList.add("show");

  setTimeout(() => {
    hideCustomAlert();
  }, 4000);
}

function hideCustomAlert() {
  const alertBox = document.getElementById("custom-alert-box");
  alertBox.classList.remove("show");
  setTimeout(() => {
    alertBox.classList.add("d-none");
  }, 300);
}

function validateFiles(len, element) {
  const files = element.files;
  const maxFiles = (10 - len) >= 4 ? 4 : (10 - len);
  const maxSizeMB = 2;

  if (files.length > maxFiles) {
    showCustomAlert(`You can upload up to ${maxFiles} more images only.`);
    element.value = null;
    return false;
  }

  for (let file of files) {
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      showCustomAlert(`File "${file.name}" is too large. Max size is ${maxSizeMB} MB.`);
      element.value = null;
      return false;
    }
  }

  return true;
}
// ---- END of fileValidation.js content ----
