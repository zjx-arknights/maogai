// 要操作的元素
const container = document.querySelector('.container');
const topLayer = container.querySelector('.top');
const handle = container.querySelector('.handle');
const bottomBody = document.querySelector('.bottom .body h1');
const topBody = document.querySelector('.top .body h1');
const bottomImg = document.querySelector('.bottom img');
const topImg = document.querySelector('.top img');
const nextButton = document.getElementById('nextButton');

let skew = 0;
let animationId = null;
let currentState = 0;
let isAnimating = false;
let cycleCount = 0;

// 四种状态的内容配置
const states = [
    {
        bottomText: "罗翔",
        topText: "这是谁？",
        img: "1.png"
    },
    {
        bottomText: "宋浩",
        topText: "这是谁？",
        img: "2.png"
    },
    {
        bottomText: "李子柒",
        topText: "这是谁？",
        img: "3.png"
    },
    {
        bottomText: "刘晓燕",
        topText: "这是谁？",
        img: "4.png"
    }
];

// 判断container的class中是否包含'skewed'
if (container.className.indexOf('skewed') > -1) {
    skew = 1000;
}

// 初始化元素位置（完全覆盖状态）
function initCoverState() {
    handle.style.left = window.innerWidth + 'px';
    topLayer.style.width = (window.innerWidth + skew) + 'px';
    topLayer.style.display = '';
    handle.style.display = '';
}

// 初始化元素位置（完全消失状态）
function initUncoverState() {
    handle.style.left = (-skew) + 'px';
    topLayer.style.width = '0px';
}

// 更新内容
function updateContent() {
    const state = states[currentState];
    bottomBody.textContent = state.bottomText;
    topBody.textContent = state.topText;
    bottomImg.src = state.img;
    topImg.src = state.img;
}

// 显示跳转按钮
function showNextButton() {
    nextButton.classList.add('show');
}

// 隐藏跳转按钮
function hideNextButton() {
    nextButton.classList.remove('show');
}

// 动画函数（direction: 1=消失动画，-1=覆盖动画）
function animateLayer(direction, callback) {
    isAnimating = true;

    const duration = 1000;
    const startTime = performance.now();
    const startX = direction === 1 ? window.innerWidth : -skew;
    const endX = direction === 1 ? -skew : window.innerWidth;

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 使用缓动函数使动画更平滑
        const easeProgress = easeInOutQuad(progress);
        const currentX = startX + (endX - startX) * easeProgress;

        handle.style.left = currentX + 'px';
        topLayer.style.width = (currentX + skew) + 'px';

        if (progress < 1) {
            animationId = requestAnimationFrame(animate);
        } else {
            animationId = null;
            isAnimating = false;
            if (callback) callback();
        }
    }

    animationId = requestAnimationFrame(animate);
}

// 缓动函数
function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// 点击容器时触发完整动画序列
container.addEventListener('click', function () {
    if (isAnimating) return;

    // 第一步：白色遮罩向左滑动消失
    animateLayer(1, function () {
        // 第二步：白色遮罩从右侧重新滑入覆盖
        setTimeout(() => {
            initUncoverState();
            animateLayer(-1, function () {
                // 第三步：完全覆盖后更新内容
                currentState = (currentState + 1) % states.length;
                updateContent();

                // 每次完整循环后增加计数
                if (currentState === 0) {
                    cycleCount++;
                    // 完成一轮循环后显示按钮
                    if (cycleCount === 1) {
                        showNextButton();
                    }
                }
            });
        }, 300);
    });
});

// 跳转按钮点击事件
nextButton.addEventListener('click', function () {
    // 这里可以添加跳转逻辑
    nextButton.addEventListener('click', () => {
        // console.log('998')
        window.location.href = '../../part4/35.html'
    })
});

// 初始化
window.addEventListener('load', function () {
    initCoverState();
    updateContent();
    hideNextButton();
});

window.addEventListener('resize', function () {
    if (!isAnimating) {
        if (parseInt(topLayer.style.width) >= window.innerWidth ||
            topLayer.style.width === '') {
            initCoverState();
        } else {
            initUncoverState();
        }
    }
});