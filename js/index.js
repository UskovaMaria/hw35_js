const baseUrl = 'http://localhost:3000/';
const resources = {
  posts: 'posts',
  comments: 'comments',
  profile: 'profile'
};

const doc = document;
const showPosts = doc.querySelector('.show__btn');
const createPost = doc.querySelector('.create__btn');
const deletePostButton = doc.querySelector('.delete__btn');
const editPostButton = doc.querySelector('.editing__btn');

deletePostButton.onclick = () => {
  const activeListItem = doc.querySelector('.post-list__items li.active');

  if (activeListItem) {
    const postId = activeListItem.dataset.postId;

    fetch(`${baseUrl}${resources.posts}/${postId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(deletedPost => {
        console.log('Deleted Post:', deletedPost);
        removePost(postId);
      })
  } else {
    console.log('Please select a post to delete.');
  }
};

function removePost(postId) {
  const postList = doc.querySelector('.post-list__items');
  const deletedListItem = doc.querySelector(`.post-list__items li[data-post-id="${postId}"]`);

  if (deletedListItem) {
    postList.removeChild(deletedListItem);
  }
}

createPost.onclick = () => {
  fetch(baseUrl + resources.posts, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ title: 'this is new post', content: 'Content for new post', img: 'img/img5.jpg' }),
  })
    .then(res => res.json())
    .then(createdPost => {
      console.log('New Post:', createdPost);
      updateNewPost(createdPost);
      fetchPosts();
    })
}    

function updateNewPost(newPost) {
  const postList = document.querySelector('.post-list__items');

  const listItem = document.createElement('li');

  const postTitle = document.createElement('span');
  postTitle.textContent = newPost.title;

  const openButton = document.createElement('button');
  openButton.textContent = 'Open';
  openButton.addEventListener('click', () => showPost(newPost.id));

  listItem.appendChild(postTitle);
  listItem.appendChild(openButton);

  postList.appendChild(listItem);
} 

function fetchPosts() {
  fetch(baseUrl + resources.posts)
    .then(response => response.json())
    .then(posts => {
      const postList = document.querySelector('.post-list__items');
      postList.innerHTML = ''; 
      posts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.dataset.postId = post.id;
        const postTitle = document.createElement('span');
        postTitle.textContent = post.title;

        const openButton = document.createElement('button');
        openButton.textContent = 'Open';
        openButton.addEventListener('click', () => showPost(post.id));

        listItem.appendChild(postTitle);
        listItem.appendChild(openButton);
        
        postList.appendChild(listItem);

        listItem.addEventListener('click', () => {
          const allListItems = document.querySelectorAll('.post-list__items li');
          allListItems.forEach(item => item.classList.remove('active'));
          listItem.classList.add('active');
        });
      });
    });
}

showPosts.onclick = () => {
  fetchPosts();
}

function showPost(postsId) {
  const overlay = document.querySelector('.overlay');
  const popup = document.querySelector('.popup');

  overlay.style.display = 'flex';
  
  fetch(`${baseUrl}${resources.posts}/${postsId}`)
    .then((response) => response.json())
    .then((posts) => {
      const popupTitle = document.querySelector('.popup__title');
      const popupContent = document.querySelector('.popup__content');
      const popupImg = document.querySelector('.popup__img');
      
      popupTitle.textContent = posts.title;
      popupContent.textContent = posts.content;
      popupImg.src = posts.img;

      popup.style.display = 'block';
    });
}

function closePopup() {
  const overlay = document.querySelector('.overlay');
  const popup = document.querySelector('.popup');

  overlay.style.display = 'none';
  popup.style.display = 'none';
}

editPostButton.onclick = () => {
  const activeListItem = doc.querySelector('.post-list__items li.active');

  if (activeListItem) {
    const postId = activeListItem.dataset.postId;

    fetch(`${baseUrl}${resources.posts}/${postId}`)
      .then(response => response.json())
      .then(post => {
        editPost(post);
      });
  } else {
    console.log('Please select a post to edit.');
  }
}; 

function editPost(post) {
  const overlay = document.querySelector('.overlay');
  const popup = document.querySelector('.popup');
  const popupTitle = document.querySelector('.popup__title');
  const popupContent = document.querySelector('.popup__content');
  const popupImg = document.querySelector('.popup__img');
  const popupCloseBtn = document.querySelector('.popup__close');

  popupTitle.textContent = 'Edit Post';
  popupContent.innerHTML = `
    <label for="editTitle">Title:</label>
    <input type="text" id="editTitle" value="${post.title}">
    <label for="editContent">Content:</label>
    <textarea id="editContent">${post.content}</textarea>
    <label for="editImg">Image URL:</label>
    <input type="text" id="editImg" value="${post.img}">
  `;
  popupImg.src = post.img;

  overlay.style.display = 'flex';
  popup.style.display = 'block';

  popupCloseBtn.textContent = 'Save Changes';
  popupCloseBtn.onclick = () => saveChanges(post.id);
}

function saveChanges(postId) {
  const editTitleInput = document.getElementById('editTitle');
  const editContentTextarea = document.getElementById('editContent');
  const editImgInput = document.getElementById('editImg');

  const editedPost = {
    title: editTitleInput.value,
    content: editContentTextarea.value,
    img: editImgInput.value,
  };

  fetch(`${baseUrl}${resources.posts}/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(editedPost),
  })
    .then(response => response.json())
    .then(updatedPost => {
      console.log('Updated Post:', updatedPost);

      updatePost(updatedPost);

      closePopup();
    });
}

function updatePost(editedPost) {
  const postId = editedPost.id;
  const postTitle = document.querySelector(`.post-list__items li[data-post-id="${postId}"] span`);
  
  if (postTitle) {
    postTitle.textContent = editedPost.title;
  }
}

