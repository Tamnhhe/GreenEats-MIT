// Lưu trữ blogs trong mảng tạm
let blogs = [];

// Load Blogs (Read)
function loadBlogs() {
    const storedBlogs = localStorage.getItem('blogs');
    if (storedBlogs) {
        blogs = JSON.parse(storedBlogs);
        renderBlogs();
    } else {
        fetch('../data/blogs.json')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                blogs = data;
                localStorage.setItem('blogs', JSON.stringify(blogs));
                renderBlogs();
            })
            .catch(error => {
                console.error('Error loading blogs:', error);
                const blogGrid = document.getElementById('blogGrid');
                if (blogGrid) blogGrid.innerHTML = '<p>Sorry, unable to load blog posts.</p>';
            });
    }
}

// Render Blogs lên giao diện
function renderBlogs() {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) return;

    blogGrid.innerHTML = '';
    blogs.forEach(post => {
        const blogPost = document.createElement('div');
        blogPost.className = 'blog-post';
        blogPost.innerHTML = `
            <img src="${post.image}" alt="${post.title}" loading="lazy">
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <a href="blog-details.html?id=${post.id}" class="read-more">Read More</a>
            <button onclick="editBlogPost(${post.id})" class="edit-btn">Edit</button>
            <button onclick="deleteBlogPost(${post.id})" class="delete-btn">Delete</button>
        `;
        blogGrid.appendChild(blogPost);
    });
}

// Create or Update Blog Post (Create/Update)
function createOrUpdateBlogPost() {
    const id = document.getElementById('postId').value;
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;

    if (!title || !content) {
        alert('Please fill in both title and content.');
        return;
    }

    if (id) {
        const postIndex = blogs.findIndex(post => post.id == id);
        if (postIndex !== -1) {
            blogs[postIndex] = { ...blogs[postIndex], title, content };
        }
    } else {
        const newId = blogs.length ? Math.max(...blogs.map(p => p.id)) + 1 : 1;
        blogs.push({
            id: newId,
            title,
            content,
            image: '../assets/images/default-blog.jpg'
        });
    }

    localStorage.setItem('blogs', JSON.stringify(blogs));
    renderBlogs();

    document.getElementById('postId').value = '';
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
}

// Edit Blog Post
function editBlogPost(id) {
    const post = blogs.find(post => post.id === id);
    if (post) {
        document.getElementById('postId').value = post.id;
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postContent').value = post.content;
    }
}

// Delete Blog Post
function deleteBlogPost(id) {
    if (confirm('Are you sure you want to delete this post?')) {
        blogs = blogs.filter(post => post.id !== id);
        localStorage.setItem('blogs', JSON.stringify(blogs));
        renderBlogs();
    }
}

// Load Blog Details
function loadBlogDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    const storedBlogs = localStorage.getItem('blogs');
    if (storedBlogs) {
        blogs = JSON.parse(storedBlogs);
        const blog = blogs.find(post => post.id == blogId);
        if (blog) {
            document.getElementById('blogTitle').textContent = blog.title;
            document.getElementById('blogImage').src = blog.image;
            document.getElementById('blogContent').textContent = blog.content;
        } else {
            document.querySelector('.blog-details').innerHTML = '<p>Blog post not found.</p>';
        }
    } else {
        document.querySelector('.blog-details').innerHTML = '<p>Unable to load blog details.</p>';
    }
}
// Biến toàn cục để lưu trữ danh sách recipes
let recipes = [];

// Load Recipes
function loadRecipes() {
    fetch('../data/recipes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            recipes = data; // Lưu dữ liệu vào biến toàn cục
            renderRecipes(recipes); // Hiển thị tất cả công thức ban đầu
        })
        .catch(error => {
            console.error('Error loading recipes:', error);
            const recipeList = document.getElementById('recipeList');
            if (recipeList) {
                recipeList.innerHTML = '<p>Sorry, unable to load recipes at this time.</p>';
            }
        });
}

// Render Recipes lên giao diện
function renderRecipes(recipeArray) {
    const recipeList = document.getElementById('recipeList');
    if (!recipeList) {
        console.error('Recipe list element not found');
        return;
    }
    recipeList.innerHTML = ''; // Xóa nội dung hiện tại

    if (recipeArray.length === 0) {
        recipeList.innerHTML = '<p>No recipes found for this filter.</p>';
        return;
    }

    recipeArray.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
            <h2>${recipe.title}</h2>
            <p>Ingredients: ${recipe.ingredients}</p>
            <p>Steps: ${recipe.steps}</p>
            <p>Sustainability Score: ${recipe.sustainabilityScore}</p>
        `;
        recipeList.appendChild(recipeCard);
    });
}

// Filter Recipes
function filterRecipes(category) {
    let filteredRecipes;
    if (category === 'all') {
        filteredRecipes = recipes; // Hiển thị tất cả
    } else {
        filteredRecipes = recipes.filter(recipe => recipe.category === category);
    }
    renderRecipes(filteredRecipes); // Render lại danh sách đã lọc
}
// Xử lý submit form liên hệ
function handleContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Ngăn submit mặc định
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            console.log('Contact Form Submitted:', { name, email, message });

            // Hiển thị thông báo thành công (có thể thay bằng alert hoặc giao diện khác)
            alert('Thank you for your message! We will get back to you soon.');

            // Reset form
            form.reset();
        });
    }
}

// Load content based on page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('recipeList')) {
        loadRecipes();
    }
    if (document.getElementById('blogGrid')) {
        loadBlogs();
    }
    if (document.getElementById('blogTitle')) {
        loadBlogDetails();
    }
    if (document.getElementById('contactForm')) {
        handleContactForm();
    }
});

// Gữi các hàm khác như loadRecipes, loadBlogs, loadBlogDetails, filterRecipes, CRUD blogs ở đây...
// Load content when page is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('recipeList')) {
        loadRecipes();
    }
});
// Load content based on page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('blogGrid')) {
        loadBlogs();
    }
    if (document.getElementById('blogTitle')) {
        loadBlogDetails();
    }
});