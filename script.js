window.addEventListener('DOMContentLoaded', () => {
  
  let bookmarks = [];
  
  const content = document.querySelector('.content');
  const inputNameSites = document.querySelector('.input-sites');
  const inputUrlSites = document.querySelector('.input-url');
  const modal = document.querySelector('.modal-title');
  
  window.addEventListener('click', event => {
    if (event.target.classList.contains('btn-modal')) {
      const type = event.target.dataset.type.toLowerCase();
      modal.textContent = `Modal ${type} data`;
      if (modal.textContent.includes('add')) clearForm();
    }
  });
  
  function clearForm() {
    const form = document.querySelector('.form');
    form.reset();
  }
  
  const btnSubmit = document.querySelector('.btn-submit');
  btnSubmit.addEventListener('click', addBookmark);
  
  function addBookmark() {
    if (modal.textContent.includes('add')) {
      const nameSites = inputNameSites.value.trim();
      const urlSites = inputUrlSites.value.trim();
      if (validate(nameSites, urlSites) == true) {
        const data = {name: nameSites, url: urlSites};
        bookmarks.unshift(data);
        saveBookmark();
        showUI(data);
        alerts('success', 'Bookmark has been added!');
        loadBookmark();
        clearForm();
      }
    }
  }
  
  const regexURL = /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
  
  function validate(name, url) {
    if (!name && !url) return alerts('error', 'All input is empty!');
    if (!name || !url) return alerts('error', 'Input is empty!');
    if (name.length > 20) return alerts('error', 'input name sites must be less then 20 character!');
    if (url.length > 30) return alerts('error', 'input URL must be less then 30 character!');
    if (!url.match(regexURL)) return alerts('error', 'URL is invalid!');
    return true;
  }
  
  function saveBookmark() {
    localStorage.setItem('bookmark-app', JSON.stringify(bookmarks));
  }
  
  function showUI(data, index = 0) {
    const result = elementUI(data, index);
    content.insertAdjacentHTML('beforeend', result);
  }
  
  function elementUI({name, url}, index) {
    return `
    <div class="bg-white p-3 px-4 shadow rounded-2 my-2">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-block">
          <h5 class="fw-normal m-0">
            <a href="${setURL(url)}" class="text-decoration-none text-black">
              ${name}
            </a>
          </h5>
          <span class="fw-light text-black-50">${setURL(url, true)}</span>
        </div>
        <div class="btn-group dropup">
          <button 
            class="btn rounded-1" 
            data-bs-toggle="dropdown" 
            aria-expanded="false">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>
          <ul class="dropdown-menu">
            <li 
              class="dropdown-item btn-edit btn-modal"
              data-type="edit"
              data-index="${index}"
              data-bs-toggle="modal" 
              data-bs-target="#modalBox">
              edit
            </li>
            <li class="dropdown-item btn-delete" data-index="${index}">delete</li>
          </ul>
        </div>
      </div>
    </div>
    `;
  }
  
  function setURL(url, hide = false) {
    return (hide == true) ? url : 'https://' + url;  
  }
  
  function alerts(type, text) {
    swal.fire ({
      icon: type,
      title: 'Alert',
      text: text
    });
  }
  
  function loadBookmark() {
    content.innerHTML = '';
    const data = localStorage.getItem('bookmark-app');
    bookmarks = (data) ? JSON.parse(data) : [];
    bookmarks.forEach((bookmark, index) => showUI(bookmark, index));
  }
  
  loadBookmark();
  
  window.addEventListener('click', event => {
    if (event.target.classList.contains('btn-edit')) {
      const index = event.target.dataset.index;
      setValueInput(index);
      editData(index);
    }
  });
  
  function setValueInput(index) {
    inputNameSites.value = bookmarks[index].name;
    inputUrlSites.value = bookmarks[index].url;
  }
  
  function editData(index) {
    btnSubmit.addEventListener('click', () => {
      if (modal.textContent.includes('edit')) {
        const nameSites = inputNameSites.value.trim();
        const urlSites = inputUrlSites.value.trim();
        if (validate(nameSites, urlSites) == true) {
          bookmarks[index].name = nameSites;
          bookmarks[index].url = urlSites;
          saveBookmark();
          alerts('success', 'Bookmark has been updated!');
          bookmarks = null, index = null;
          loadBookmark();
        }
      }
    });
  }
  
  window.addEventListener('click', event => {
    if (event.target.classList.contains('btn-delete')) {
      const index = event.target.dataset.index;
      deleteData(index);
    }
  });
  
  function deleteData(index) {
    swal.fire ({
      icon: 'info',
      title: 'Are you sure?',
      text: 'do you want to delete this bookmark?',
      showCancelButton: true
    })
    .then(response => {
      if (response.isConfirmed) {
        bookmarks.splice(index, 1);
        saveBookmark();
        alerts('success', 'Bookmark has been deleted!');
        loadBookmark();
      }
    });
  }
  
});