const BASE_URL = "http://localhost:3000/posts";
let currentPostId = null;


function displayPosts() {
  fetch(BASE_URL)
    .then((res) => res.json())
    .then((posts) => {
      const list = document.getElementById("post-list");
      list.innerHTML = "";

      posts.forEach((post, index) => {
        const div = document.createElement("div");
        div.textContent = post.title;
        div.classList.add("post-title");
        div.addEventListener("click", () => handlePostClick(post.id));
        list.appendChild(div);

        
        if (index === 0) {
          handlePostClick(post.id);
        }
      });
    });
}


function handlePostClick(postId) {
  fetch(`${BASE_URL}/${postId}`)
    .then((res) => res.json())
    .then((post) => {
      currentPostId = post.id;
      const detail = document.getElementById("post-detail");
      detail.innerHTML = `
        <h2>${post.title}</h2>
        <img src="${post.image}" width="150" />
        <p>${post.content}</p>
        <p><strong>Author:</strong> ${post.author}</p>
        <button id="edit-btn">Edit</button>
        <button id="delete-btn">Delete</button>
      `;

      document.getElementById("edit-btn").addEventListener("click", () => {
        document.getElementById("edit-title").value = post.title;
        document.getElementById("edit-content").value = post.content;
        document.getElementById("edit-post-form").classList.remove("hidden");
      });

      document.getElementById("delete-btn").addEventListener("click", () => {
        fetch(`${BASE_URL}/${post.id}`, { method: "DELETE" })
          .then(() => {
            displayPosts();
            document.getElementById("post-detail").innerHTML = "<p>Post deleted.</p>";
          });
      });
    });
}


function addNewPostListener() {
  const form = document.getElementById("new-post-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newPost = {
      title: document.getElementById("new-title").value,
      content: document.getElementById("new-content").value,
      author: document.getElementById("new-author").value,
      image: document.getElementById("new-image").value,
    };

    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    })
      .then((res) => res.json())
      .then(() => {
        displayPosts();
        form.reset();
      });
  });
}


function addEditPostListener() {
  const form = document.getElementById("edit-post-form");
  const cancelBtn = document.getElementById("cancel-edit");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const updatedPost = {
      title: document.getElementById("edit-title").value,
      content: document.getElementById("edit-content").value,
    };

    fetch(`${BASE_URL}/${currentPostId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost),
    })
      .then((res) => res.json())
      .then(() => {
        form.classList.add("hidden");
        displayPosts();
        handlePostClick(currentPostId);
      });
  });

  cancelBtn.addEventListener("click", () => {
    form.classList.add("hidden");
  });
}


function main() {
  displayPosts();
  addNewPostListener();
  addEditPostListener();
}

document.addEventListener("DOMContentLoaded", main);
