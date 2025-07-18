let dataItems;
let dataCategories;
let itemsPerPage = 15;
let totalPages = 0;
let pageNo = 1;
const itemsContainer = document.querySelector('.content');

async function fetchItems() {
    try {
        let response = await fetch('http://43.205.110.71:8000/items');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        dataItems = await response.json();

        let response2 = await fetch('http://43.205.110.71:8000/categories');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        dataCategories = await response2.json();
        SetUp();
    } catch (error) {
        console.error('Fetch error:', error);
    }
}


function displayItems(categorySelected = 'all', tagSelected = 'all') 
{ 
  let filteredItems = dataItems.filter(item => {
    if (categorySelected !== 'all' && item.category !== categorySelected) {
      return false;
    }
    if (tagSelected !== 'all' && !item.tags.includes(tagSelected)) {
      return false;
    }
    return true;
  });
  
  let page = document.querySelector('.page.selected');
  if (!page) {
      let NoOfItems = filteredItems.length;
      const pagesContainer = document.querySelector('.pages');
      totalPages = Math.ceil(NoOfItems / itemsPerPage);
      for (let i = 1; i <= totalPages; i++) {
        const page = document.createElement('button');
        page.className = 'page';
        page.id = i;
        page.textContent = i;
        if (i === pageNo) {
          page.classList.add('selected');
        }
        pagesContainer.appendChild(page);
      }
      pageNo = 1; 
      let AllPages = document.querySelectorAll('.page');
  const AddEventToPages = () => {
    AllPages.forEach((page) => {

      page.addEventListener('click', function() {
         
        pageNo = this.id;
        AllPages.forEach((p) => p.classList.remove('selected'));
        this.classList.add('selected');
        itemsContainer.innerHTML = '';
        displayItems(categorySelected, tagSelected);
      });
    })
  }
  AddEventToPages();

    }else{
    pageNo = parseInt(page.id);
    }

  const startIndex = (pageNo - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = dataItems.slice(startIndex, endIndex);
  itemsContainer.innerHTML = '';

  paginatedItems.forEach((item) => {
    const container = document.createElement('div');
        container.className = 'elements';
        container.innerHTML = `
          <div class="image"><img src="https://picsum.photos/id/${Math.floor(Math.random() * 10)}/200/300"  alt="Image"></div>
          <div class="name">${item.name}</div>
          <div class="description">description: ${item.description}</div>
          <div class="price">price:${item.price}</div>
          <div class="categoryInItem">category:${item.category}</div>
        `;
        itemsContainer.appendChild(container);
  });
}

fetchItems();






function SetUp() {
  const tags = document.querySelector("#tags");
  const uniqueTags = new Set();
   

  dataItems.forEach((item) => {
  // Populate tags dropdown
  dataItems.forEach((item) => {
    item.tags.split('|').forEach(tag => uniqueTags.add(tag));
  });
  });
  uniqueTags.forEach(tag => {
    tags.innerHTML += `<option value="${tag}">${tag}</option>`;
  });

  // Populate categories dropdown

  const categoriesContainer = document.querySelector('#category');

  dataCategories.forEach((item) => {
    categoriesContainer.innerHTML += `<option value="${item.category}">${item.category}</option>`;
  });

  
  let NoOfItems = dataItems.length;
  const pagesContainer = document.querySelector('.pages');
  totalPages = Math.ceil(NoOfItems / itemsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const page = document.createElement('button');
    page.className = 'page';
    page.id = i;
    page.textContent = i;
    if (i === pageNo) {
      page.classList.add('selected');
    }
    pagesContainer.appendChild(page);
  }  

  displayItems();

  let AllPages = document.querySelectorAll('.page');
  const AddEventToPages = () => {
    AllPages.forEach((page) => {

      page.addEventListener('click', function() {
        let tagSelected = tags.value;
        let categorySelected = categoriesContainer.value;
        pageNo = this.id;
        AllPages.forEach((p) => p.classList.remove('selected'));
        this.classList.add('selected');
        itemsContainer.innerHTML = '';
        displayItems(categorySelected, tagSelected);
      });
    })
  }
  AddEventToPages();
  tags.addEventListener('change', function() {

    tagSelected = tags.value;
    categorySelected = categoriesContainer.value;
    itemsContainer.innerHTML = '';
    pagesContainer.innerHTML = '';
    pageNo = 1; // Reset to first page when tag changes
    AllPages.forEach((p) => p.classList.remove('selected'));
    displayItems(categorySelected, tagSelected);

  });


  categoriesContainer.addEventListener('change', function() {
    let tagSelected = tags.value;
    let categorySelected = categoriesContainer.value;
    itemsContainer.innerHTML = '';
    pagesContainer.innerHTML = '';
    pageNo = 1; // Reset to first page when category changes
    AllPages.forEach((p) => p.classList.remove('selected'));
    displayItems(categorySelected, tagSelected);
  });
}

