// 获取图片展示项的容器
const imgItemsContainer = document.querySelector('.img-display-page__img-item-container')
// 获取页面中的图片展示项模板
const imgItemTemplate = document.querySelectorAll('.img-item')[0]

// 图片展示项最大数量
const imgItemMaxCnt = 4
// 每次生成的图片展示项个数
const imgItemCreateCntPer = 1
// 图片宽高所允许的范围
const imgSizeMin = 1080
const imgSizeMax = 1920

/**
 * 生成指定范围的随机整数，随机数的生成区间为 [min, max]
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
const genRandInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 生成随机的图片大小
 * 
 * @param {*} min 图片大小范围的最小值
 * @param {*} max 图片大小范围的最大值
 * @return 图片的宽高组成的对象
 */
const genRandImgSize = (min, max) => {
    return {
        width: genRandInt(min, max),
        height: genRandInt(min, max)
    }
}

// 当前是否可以调用处理函数 —— genImgItems
let isInvoke = true

// 图片加载中
const imgLoading = document.querySelector('.img-display-page__loading')
// 没有更多
const notMore = document.querySelector('.img-display-page__not-more')

/**
 * 生成图片展示项
 */
const genImgItems = () => {
    // 获取页面中图片展示项的个数
    let imgItemCnt = document.querySelectorAll('.img-item').length
    // 如果超过指定的页面中允许的最大个数
    if (imgItemCnt >= imgItemMaxCnt) {
        notMore.style.display = 'flex'
        return
    } else {
        notMore.style.display = 'none'
    }
    // 显示图片加载中
    imgLoading.style.display = 'flex'
    // 记录新增的图片展示项是否全部图片访问完成
    let isShowImgCnt = { cnt: 0 }
    // 创建 isShowImgCnt 的代理，以达到能够监听其的目的
    const isShowImgCntProxy = new Proxy(isShowImgCnt, {
        // target-被代理的对象, property-修改属性, value-新属性值
        set(target, property, value) {
            target[property] = value
            // 所有的新增图片在页面中完成显示，允许再次调用 genImgItems
            if (isShowImgCnt.cnt === imgItemCreateCntPer) {
                // 隐藏图片加载中
                imgLoading.style.display = 'none'
                isInvoke = true
            }
        }
    })
    // 生成图片展示项


}

/**
 * 节流函数，执行要进行调用的函数要在上一次调用之后
 * 
 * @param {*} handler 
 * @param {*} delay 
 */
const throttle = (handler, delay) => {
    // 可以调用，才执行调用函数
    if (isInvoke) {
        // 标记当前不可继续调用
        isInvoke = false
        // 调用处理函数
        handler.apply(this)
    }
}

/**
 * 事件处理函数防抖，防止短时间内事件处理函数被重复调用执行。
 * 通过定时器控制事件处理函数段时间内的执行次数，只执行一次
 * 
 * @param {*} handler 事件处理函数
 * @param {*} delay 事件触发后执行事件处理的延时
 */
const debounce2 = (handler, delay) => {
    // 定时器(返回的所有函数共用)
    let timer = null
    return function () {
        // 已有定时器，就清除重新创建
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            // 调用事件处理函数
            handler.apply(this, arguments)
        }, delay)
    }
}

// 生成图片展示项
throttle(genImgItems)

// 绑定滚动事件
window.addEventListener('scroll', debounce2(() => {
    // 页面向上滚动的距离
    let docScrollTop = document.body.scrollTop || document.documentElement.scrollTop
    // document.documentElement.clientHeight 网页文档可视区域的高度
    // docVisibleMax 当前浏览器可视区域的底边在网页文档高度的什么位置
    let docVisibleMax = document.documentElement.clientHeight + docScrollTop
    // 如果要滚动到页面底部
    // document.body.clientHeight 网页文档高度
    if (docVisibleMax + 200 >= document.body.clientHeight) {
        // 生成图片展示项
        throttle(genImgItems)
    }
}, 100))

function add(i) {
    let imgItem_clone = imgItemTemplate.cloneNode(true);
    let imgSrc = `assets/页面${i + 6}背景图.jpg`;
    let img = imgItem_clone.querySelector('img');
    img.src = imgSrc;

    // 修改标题和描述（确保每个盒子不同）
    let title = imgItem_clone.querySelector('.title');
    let description = imgItem_clone.querySelector('.description');

    const contents = [
        { title: "软件构建数字神经网络", desc: "在物联网（IoT）时代，软件是连接亿万设备的数字神经网络。5G通信的高速率和低延时特性，依赖于协议栈软件的优化，确保数据高效传输。物联网平台（如华为OceanConnect、阿里云IoT）通过软件管理数十亿设备的接入、通信和数据交换，实现智能家居、智慧城市等场景的落地。工业互联网则借助数字孪生技术，用软件精确模拟物理世界的机器和流程，优化生产效率。据预测，2025年全球IoT连接设备将达750亿台，而这些设备的协同运作完全依赖软件支撑。从智能电表到自动驾驶汽车，从工厂机器人到农业传感器，软件让原本孤立的设备形成智能网络，推动社会迈向万物智联时代..." },
        { title: "软件替代实验室", desc: "物联网技术将物软件正在彻底改变科学研究的范式，许多传统实验室工作已被数字化模拟取代。在量子计算领域，Qiskit等开源软件框架让研究人员无需实际建造量子计算机，就能模拟和测试量子算法。生物医药行业利用分子动力学软件（如GROMACS）加速药物分子模拟，使新冠疫苗的研发周期从数年缩短至数月。天文探索则借助机器学习软件处理望远镜捕获的海量数据，自动识别系外行星或宇宙现象。典型案例是NASA的毅力号火星车，其90%的功能由超过50万行代码控制，从导航到样本分析，软件让深空探测成为可能。未来，随着计算能力的提升，更多科学实验将在数字实验室中完成，软件将成为科研创新的核心工具。" },
        { title: "软件定义新边疆", desc: "软件正在定义未来科技的边界，推动人类探索全新领域。在脑机接口领域，Neuralink等公司依赖先进的神经信号解码软件，实现大脑与机器的直接交互，为医疗康复和人机融合提供可能。元宇宙的构建离不开Unity、Unreal等3D引擎软件，它们为虚拟世界提供物理模拟、光影渲染和交互逻辑。自动驾驶技术的核心是一套完整的感知-决策-控制软件系统，让车辆能够理解环境并安全行驶。在能源领域，智能电网通过软件优化电力调度，平衡供需，提高可再生能源利用率。从虚拟现实到太空探索，从基因编辑到气候建模，软件不仅是工具，更是未来科技发展的基石，不断拓展人类认知和能力的极限。" }
    ];

    title.textContent = contents[i].title;
    description.textContent = contents[i].desc;

    // 修改时间（可选）
    let time = imgItem_clone.querySelector('.time');
    time.textContent = ``;

    img.addEventListener('load', () => {
        imgItemsContainer.appendChild(imgItem_clone);
        isShowImgCntProxy.cnt++;
    });

    img.addEventListener('error', () => {
        console.log(imgSrc + '图片显示失败');
        img.src = './assets/img-01.jpg';
        imgItemsContainer.appendChild(imgItem_clone);
        isShowImgCntProxy.cnt++;
    });
}
add(0)
add(1)
add(2)



