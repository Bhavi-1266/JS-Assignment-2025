let dataItems;
let dataCategories;
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
        displayItems();
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

fetchItems();
function displayItems() {
  const itemsContainer = document.querySelector('.content');
  const tags = document.querySelector("#tags");
  const uniqueTags = new Set();

  dataItems.forEach((item) => {
    const container = document.createElement('div');
    container.className = 'elements';
    container.innerHTML = `
      <div class="image"><img src="https://picsum.photos/id/${Math.floor(Math.random() * 10)}/200/300" alt="Image"></div>
      <div class="name">${item.name}</div>
      <div class="description">description: ${item.description}</div>
      <div class="price">price:${item.price}</div>
      <div class="categoryInItem">category:${item.category}</div>
    `;
    itemsContainer.appendChild(container);
  // Populate tags dropdown

  dataItems.forEach((item) => {
    item.tags.split('|').forEach(tag => uniqueTags.add(tag));
  });
  });

  uniqueTags.forEach(tag => {
    tags.innerHTML += `<option value="${tag}">${tag}</option>`;
  });


      
  
  const categoriesContainer = document.querySelector('#category');

  dataCategories.forEach((item) => {
    categoriesContainer.innerHTML += `<option value="${item.category}">${item.category}</option>`;
  });


  tags.addEventListener('change', function() {
    let tagSelected = tags.value;
    let categorySelected = categoriesContainer.value;
    itemsContainer.innerHTML = '';
    dataItems.forEach((item) => {
      if (categorySelected === 'all' && item.tags.includes(tagSelected)) {
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
      }
      if (categorySelected !== 'all' && tagSelected === 'all' && item.category === categorySelected) {
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
      }
      if (categorySelected !== 'all' && tagSelected !== 'all' && item.category === categorySelected && item.tags.includes(tagSelected)) {
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
      }
      if (categorySelected === 'all' && tagSelected === 'all') {
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
      }
    });
  });


  categoriesContainer.addEventListener('change', function() {
    let tagSelected = tags.value;
    let categorySelected = categoriesContainer.value;
    itemsContainer.innerHTML = '';
    dataItems.forEach((item) => {
      if (categorySelected === 'all' && item.tags.includes(tagSelected)) {
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
      }
      if (categorySelected !== 'all' && tagSelected === 'all' && item.category === categorySelected) {
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
      }
      if (categorySelected !== 'all' && tagSelected !== 'all' && item.category === categorySelected && item.tags.includes(tagSelected)) {
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
      }
      if (categorySelected === 'all' && tagSelected === 'all') {
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
      }
    });
  });
}
