"strict"

const listOfUrls = [];
const form = document.querySelector("#form-url-in");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const urlInput = form.querySelector("input");
  const newUrlValue = urlInput.value;

  if (!newUrlValue) {
    return;
  }

  if (listOfUrls.includes(newUrlValue)) {
    return
  }

  listOfUrls.push(newUrlValue);

  renderUrls();
});

function renderUrls() {
  const urlListContainer = document.querySelector("#linksList");
  urlListContainer.innerHTML = "";

  if (listOfUrls.length === 0) {
    urlListContainer.innerHTML = "<span>..vacía </span>";
    return;
  }

  listOfUrls.forEach((url, index) => {
    urlListContainer.innerHTML += `<li data-id="${index}" onClick="removeUrl(${index})">${url}</li>`
  });
}

function removeUrl(id) {
  listOfUrls.splice(id, 1);
  renderUrls();
}

const initDownloadComponent = document.querySelector("#initDownload");
