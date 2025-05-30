// 获取要操作的元素
const nums = document.querySelectorAll('.nums span');
const counter = document.querySelector('.counter');
const final = document.querySelector('.final');
const replay = document.querySelector('.replay');

// 重置，重新开始
function reset() {
    counter.classList.remove('hide');
    final.classList.remove('show');
    nums.forEach(num => {
        num.className = '';
    });
    nums[0].classList.add('in');
}

// 开始倒计时
function run() {
    nums.forEach((num, index) => {
        // 遍历数字，为每一个数字添加动画结束监听事件
        num.addEventListener('animationend', e => {
            if (e.animationName === 'goIn' && index !== nums.length - 1) {
                // 判断当前动画名为goIn，并且当前数字不是最后一个数字
                num.classList.remove('in');
                num.classList.add('out');
            } else if (e.animationName === 'goOut' && num.nextElementSibling) {
                // 判断当前动画名为goOut，并且存在下一个兄弟元素（即下一个数字）
                // 为下一个数字添加in样式
                num.nextElementSibling.classList.add('in');
            } else {
                // 到这里，说明倒计时结束
                counter.classList.add('hide');
                final.classList.add('show');
            }
        })
    })
}

// 为'开始'按钮绑定点击事件
replay.addEventListener('click', function () {
    // 添加点击效果
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 100);

    // 添加过渡效果
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '0';

    setTimeout(() => {
        window.location.href = '../网站界面/index.html';
    }, 500);
})

// 添加页面加载效果
window.addEventListener('load', function () {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // 默认开启倒计时
    run();
});