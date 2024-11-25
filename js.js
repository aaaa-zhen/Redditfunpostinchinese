// 主题切换功能
function initThemeSwitch() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    
    // 设置初始主题
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // 主题切换事件监听
    document.querySelector('.theme-toggle').addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    // 监听系统主题变化
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
        }
    });
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 搜索功能
const searchHandler = debounce(function(e) {
    const searchText = e.target.value.toLowerCase();
    const posts = document.querySelectorAll('.post');
    
    posts.forEach(post => {
        const title = post.querySelector('.post-title').textContent.toLowerCase();
        const content = post.querySelector('.post-content').textContent.toLowerCase();
        
        if (title.includes(searchText) || content.includes(searchText)) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
}, 300);

// 分类按钮点击效果和筛选
function initializeFilterButtons() {
    document.querySelectorAll('.filter button').forEach(button => {
        button.addEventListener('click', function() {
            // 移除其他按钮的active类
            document.querySelectorAll('.filter button').forEach(btn => {
                btn.classList.remove('active');
            });
            // 添加当前按钮的active类
            this.classList.add('active');

            const category = this.textContent;
            const posts = document.querySelectorAll('.post');

            posts.forEach(post => {
                if (category === '全部') {
                    post.style.display = 'block';
                } else {
                    const postCategory = post.dataset.category;
                    post.style.display = postCategory === category ? 'block' : 'none';
                }
            });
        });
    });
}

// 展开/收起逻辑
function togglePost(post, detail) {
    const isExpanding = !post.classList.contains('expanded');
    
    if (isExpanding) {
        // 展开
        detail.style.display = 'block';
        const height = detail.scrollHeight;
        detail.style.maxHeight = '0px';
        detail.style.opacity = '0';
        
        // 触发重排以使过渡生效
        detail.offsetHeight;
        
        detail.style.maxHeight = height + 'px';
        detail.style.opacity = '1';
    } else {
        // 收起
        detail.style.maxHeight = '0px';
        detail.style.opacity = '0';
        
        // 等待过渡完成后隐藏
        setTimeout(() => {
            if (!post.classList.contains('expanded')) {
                detail.style.display = 'none';
            }
        }, 500);
    }
    
    post.classList.toggle('expanded');
}

// 初始化帖子展开/收起功能
function initializePostExpansion() {
    document.querySelectorAll('.post').forEach(post => {
        const header = post.querySelector('.post-header');
        const expandBtn = post.querySelector('.expand-btn');
        const detail = post.querySelector('.post-detail');

        // 展开按钮点击事件
        expandBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            togglePost(post, detail);
        });

        // header点击事件
        header.addEventListener('click', function(e) {
            if (!e.target.closest('.expand-btn') && !e.target.closest('.comments-section')) {
                togglePost(post, detail);
            }
        });
    });
}

// 初始化收起按钮功能
function initializeCollapseBtns() {
    document.querySelectorAll('.post').forEach(post => {
        const collapseBtn = post.querySelector('.collapse-btn');
        if (collapseBtn) {
            collapseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const post = this.closest('.post');
                const detail = post.querySelector('.post-detail');
                togglePost(post, detail);
                
                // 滚动到帖子顶部
                post.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    });
}

// 初始化评论功能
function initializeComments() {
    // 点赞功能
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const likeCount = parseInt(e.target.textContent.split(' ')[1]);
            e.target.textContent = `👍 ${likeCount + 1}`;
        });
    });

    // 提交评论功能
    document.querySelectorAll('.comment-input').forEach(input => {
        const textarea = input.querySelector('textarea');
        const submitBtn = input.querySelector('.submit-comment');

        submitBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const commentText = textarea.value.trim();
            if (commentText) {
                // 创建新评论
                const newComment = document.createElement('div');
                newComment.className = 'comment';
                newComment.innerHTML = `
                    ${commentText}
                    <div class="comment-meta">
                        <span class="comment-time">刚刚</span>
                        <button class="like-btn">👍 0</button>
                        <button class="reply-btn">回复</button>
                    </div>
                `;
                
                // 添加新评论到列表
                const commentsList = input.closest('.comments-section').querySelector('.comments-list');
                commentsList.insertBefore(newComment, commentsList.firstChild);
                
                // 清空输入框
                textarea.value = '';
                
                // 为新的点赞按钮添加事件监听
                newComment.querySelector('.like-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const likeCount = parseInt(e.target.textContent.split(' ')[1]);
                    e.target.textContent = `👍 ${likeCount + 1}`;
                });
            }
        });
    });
}

// 初始化搜索功能
function initializeSearch() {
    const searchInput = document.querySelector('.search');
    if (searchInput) {
        searchInput.addEventListener('input', searchHandler);
    }
}

// 主初始化函数
function init() {
    initThemeSwitch();
    initializeFilterButtons();
    initializePostExpansion();
    initializeCollapseBtns();
    initializeComments();
    initializeSearch();
}

// 当DOM加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', init);