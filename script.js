const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteUrlEl = document.getElementById("website-url");
const bookmarkContainer = document.getElementById("bookmarks-container");

let bookmarks = [];

// Show modal, Focus on Input

function showModal() {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
}

// Modal event listiner

modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () =>
  modal.classList.remove("show-modal")
);
window.addEventListener("click", (e) =>
  e.target === modal ? modal.classList.remove("show-modal") : false
);

// Validate Form
function validate(nameValue, urlValue) {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert("Please Submite Values for Both Fields");
    return false;
  }
  if (!urlValue.match(regex)) {
    alert("Please Provide a valid web address");
    return false;
  }
  //   Valid
  return true;
}

// Builld Bookmark
function buildBookmarks() {
  // Remmove bookmarks container
  bookmarkContainer.textContent = "";
  // build items
  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;
    // console.log(name, url, 'heyo');
    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    // close Icon
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);
    // favicon/ Link Container
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");
    // favicon
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");
    // Link
    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;
    // append to bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarkContainer.appendChild(item);
    // console.log(name, url);
  });
}

// Fetch bookmark from local storage
function fetchBookmarks() {
  // Get bm if avialable
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    bookmarks = [
      {
        name: "heiscostly",
        url: "costly.com",
      },
    ];
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  console.log(bookmarks);
  buildBookmarks();
}

// Deletebookmark
function deleteBookmark(url) {
  bookmarks.forEach((bookmark, i) => {
    if (bookmark.url === url) {
      bookmarks.splice(i, 1);
    }
  });
  // Update bookmarks array in local storage, re-populate DOM
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
}

// Handle data from form
function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!urlValue.includes("http://, https://")) {
    urlValue = `https://${urlValue}`;
  }
  if (!validate(nameValue, urlValue)) {
    return false;
  }

  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks.push(bookmark);

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
}

//Event Listener
bookmarkForm.addEventListener("submit", storeBookmark);

// On load
fetchBookmarks();
