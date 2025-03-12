// Store posts and comments in localStorage
let posts = JSON.parse(localStorage.getItem('forum_posts') || '[]');
let comments = JSON.parse(localStorage.getItem('forum_comments') || '[]');

// Function 
function savePosts() {
    localStorage.setItem('forum_posts', JSON.stringify(posts));
}

// Function 
function saveComments() {
    localStorage.setItem('forum_comments', JSON.stringify(comments));
}

// Function 
function createPost(title, content, category) {
    const post = {
        id: Date.now().toString(),
        title,
        content,
        category,
        votes: 0,
        createdAt: new Date().toISOString(),
    };
    posts.unshift(post);
    savePosts();
    renderPosts();
}

// Function 
function createComment(postId, content) {
    const comment = {
        id: Date.now().toString(),
        postId,
        content,
        createdAt: new Date().toISOString(),
    };
    comments.push(comment);
    saveComments();
    renderPostDetail(postId);
}

// Function 
function updateVotes(postId, increment) {
    posts = posts.map(post => {
        if (post.id === postId) {
            return { ...post, votes: post.votes + increment };
        }
        return post;
    });
    savePosts();
    renderPosts();
    if (document.getElementById('postDetail').style.display === 'block') {
        renderPostDetail(postId);
    }
}

// Function 
function renderPosts() {
    const postsContainer = document.getElementById('postsList');
    postsContainer.innerHTML = posts.map(post => `
        <div class="post" onclick="showPostDetail('${post.id}')">
            <div class="post-header">
                <h3 class="post-title">${post.title}</h3>
                <span class="post-category">${post.category}</span>
            </div>
            <p class="post-content">${post.content.substring(0, 150)}${post.content.length > 150 ? '...' : ''}</p>
            <div class="post-footer">
                <div class="votes">
                    <button class="vote-btn" onclick="updateVotes('${post.id}', 1); event.stopPropagation();">👍</button>
                    <span class="vote-count">${post.votes}</span>
                    <button class="vote-btn" onclick="updateVotes('${post.id}', -1); event.stopPropagation();">👎</button>
                </div>
                <span class="post-date">${new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');
}

// Function 
function renderPostDetail(postId) {
    const post = posts.find(p => p.id === postId);
    const postComments = comments.filter(c => c.postId === postId);
    
    const detailContent = document.getElementById('postDetailContent');
    detailContent.innerHTML = `
        <div class="post">
            <div class="post-header">
                <h3 class="post-title">${post.title}</h3>
                <span class="post-category">${post.category}</span>
            </div>
            <p class="post-content">${post.content}</p>
            <div class="post-footer">
                <div class="votes">
                    <button class="vote-btn" onclick="updateVotes('${post.id}', 1)">👍</button>
                    <span class="vote-count">${post.votes}</span>
                    <button class="vote-btn" onclick="updateVotes('${post.id}', -1)">👎</button>
                </div>
                <span class="post-date">${new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    `;

    const commentsContainer = document.getElementById('commentsList');
    commentsContainer.innerHTML = postComments.map(comment => `
        <div class="comment">
            <p class="comment-content">${comment.content}</p>
            <div class="comment-meta">
                Posted on ${new Date(comment.createdAt).toLocaleDateString()}
            </div>
        </div>
    `).join('');

    // Update comment form
    const commentForm = document.getElementById('commentForm');
    commentForm.onsubmit = (e) => {
        e.preventDefault();
        const content = document.getElementById('commentContent').value;
        createComment(postId, content);
        e.target.reset();
    };
}

// Function 
function showPostDetail(postId) {
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('postDetail').style.display = 'block';
    renderPostDetail(postId);
}

// Function 
function showMainPage() {
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('postDetail').style.display = 'none';
    renderPosts();
}


document.getElementById('postForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const category = document.getElementById('postCategory').value;
    
    createPost(title, content, category);
    
    
    e.target.reset();
});


document.getElementById('backButton').addEventListener('click', showMainPage);


document.getElementById('forumTitle').addEventListener('click', showMainPage);

renderPosts();