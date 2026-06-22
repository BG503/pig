/* ============================================
   聪明小猪指数 — 核心逻辑
   ============================================ */

// ===== DOM 引用 =====
const $inputPage   = document.getElementById('input-page');
const $loadingPage = document.getElementById('loading-page');
const $resultPage  = document.getElementById('result-page');

const $qqInput     = document.getElementById('qq-input');
const $btnTest     = document.getElementById('btn-test');
const $inputHint   = document.getElementById('input-hint');

const $loadingText = document.getElementById('loading-text');
const $loadingSub  = document.getElementById('loading-sub');
const $progressFill = document.getElementById('progress-fill');
const $progressLabel = document.getElementById('progress-label');

const $resultPig   = document.getElementById('result-pig');
const $scoreNumber = document.getElementById('score-number');
const $resultTitle = document.getElementById('result-title');
const $resultDesc  = document.getElementById('result-desc');
const $resultTags  = document.getElementById('result-tags');
const $resultQQ    = document.getElementById('result-qq');
const $resultUser  = document.getElementById('result-user');
const $resultAvatar = document.getElementById('result-avatar');
const $resultNick   = document.getElementById('result-nickname');

const $btnRetry    = document.getElementById('btn-retry');
const $btnShare    = document.getElementById('btn-share');
const $toast       = document.getElementById('toast');
const $particles   = document.getElementById('particles');
const $shareOverlay = document.getElementById('share-overlay');
const $shareImage  = document.getElementById('share-image');
const $shareClose  = document.getElementById('share-close');
const $btnCopyText = document.getElementById('btn-copy-text');

// ===== 配置 =====

/** 加载时轮播的趣味文案 */
const LOADING_MESSAGES = [
    '正在读取猪脑电波......',
    '正在计算猪猪体脂率......',
    '正在分析泥坑打滚频率......',
    '正在检测猪尾巴卷曲度......',
    '正在测量小猪哼哼分贝......',
    '正在扫描猪猪零食库存......',
    '正在评估尾巴旋转速度......',
    '正在核对鼻孔对称性......',
    '正在追溯猪族谱系......',
    '正在研究猪蹄花纹......',
    '正在检测猪耳朵弹性......',
    '正在量化猪猪可爱值......',
    '正在计算每日进食效率......',
    '正在评估午睡质量指数......',
];

// ===== 小猪图片映射 =====

const PIG_IMAGES = {
    home:     'home.png',
    loading:  'loading.jpg',
    sleeping: 'sleeping.jpg',
    dazed:    'dazed.jpg',
    normal:   'normal.jpg',
    clever:   'clever.jpg',
    smart:    'smart.jpeg',
    genius:   'genius.jpg',
    derpy:    'derpy.jpg',
    cosmic:   'cosmic.jpg',
};

function pigImg(type) {
    return `<img src="${PIG_IMAGES[type]}" alt="小猪" class="pig-img">`;
}

/** 分数档位 */
const TIERS = [
    {
        range: [0, 15],
        title: '呼呼大睡小猪',
        imgType: 'sleeping',
        desc: '这只小猪的大脑正处于深度休眠模式。它今天唯一思考过的问题是：「刚才那个屁是我放的吗？」看来聪明不是它的强项，但可爱绝对是满分！',
        tags: ['💤 睡眠达人', '🍼 干饭优先', '🛌 能躺绝不坐'],
        color: '#90a4ae',
    },
    {
        range: [16, 35],
        title: '迷糊小猪',
        imgType: 'dazed',
        desc: '迷糊小猪上线！它的智商大概被枕头吃掉了一半。虽然经常找不到自己的尾巴，但它有一颗纯真的心。迷糊也是一种天赋，不是吗？',
        tags: ['🌀 日常迷糊', '🤔 我是谁', '🍞 面包脑袋'],
        color: '#a1887f',
    },
    {
        range: [36, 50],
        title: '普通小猪',
        imgType: 'normal',
        desc: '一只中规中矩的普通小猪。不算特别聪明，但也不至于把食槽当成床。平安是福，猪猪知足！在这个内卷的世界里，做一只平凡小猪也挺好。',
        tags: ['⭐ 中规中矩', '🧘 心态平和', '🍚 知足常乐'],
        color: '#66bb6a',
    },
    {
        range: [51, 70],
        title: '机灵小猪',
        imgType: 'clever',
        desc: '哦？这只小猪有点东西！它不仅能准确找到零食藏匿处，还能数清楚自己有几只蹄子。在同辈中已经算是「别人家的猪」了，前途无量！',
        tags: ['💡 有点聪明', '🍪 零食雷达', '📚 可造之材'],
        color: '#42a5f5',
    },
    {
        range: [71, 90],
        title: '聪明小猪',
        imgType: 'smart',
        desc: '猪中龙凤！这只小猪不仅会拱白菜，据说还能在梦里解二元一次方程。它的智商在猪圈里属于天花板级别，其他小猪纷纷表示：「大佬带带我！」',
        tags: ['🎓 猪圈学霸', '🏆 出类拔萃', '🌟 明日之星'],
        color: '#7e57c2',
    },
    {
        range: [91, 100],
        title: '天才小猪',
        imgType: 'genius',
        desc: '天才小猪降临！据传它是猪因斯坦的转世，能用鼻子写出微积分公式，用尾巴打出摩斯密码。别的小猪还在学拱泥，它已经在研究量子力学了。跪下叫猪哥！',
        tags: ['🧬 猪因斯坦', '👑 王者风范', '🚀 降维打击'],
        color: '#ff6f00',
    },
];

/** 稀有结局 */
const SECRET_ENDINGS = {
    '-infinity': {
        title: '宇宙级笨蛋小猪',
        imgType: 'derpy',
        desc: '⚠️ 警告！检测仪器无法读取！这只小猪的智商已经跌破了宇宙的底线。它可能连自己的鼻子和尾巴都分不清，但这正是它无可替代的魅力所在——笨蛋也是一种稀有属性！恭喜你，你是万中无一的「天选笨猪」！',
        tags: ['🌌 宇宙稀有', '💫 笨蛋光环', '🎪 天选之猪'],
        color: '#78909c',
        displayScore: '-∞',
    },
    'infinity': {
        title: '超越维度小猪',
        imgType: 'cosmic',
        desc: '🚨 检测仪器已爆表！！！这只小猪的智商超越了现有维度的测量上限。据推测，它可能正在用猪脑思考宇宙的终极答案（42）。凡人的测试已经无法衡量它的智慧——它已经不只是猪了，它是一种境界。',
        tags: ['🌠 超凡入圣', '🔮 维度突破', '📐 智商溢出'],
        color: '#ffd600',
        displayScore: '∞',
    },
};

// ===== 当前测试的 QQ 号 =====
let currentQQ = '';
let currentNickname = '';

// ===== QQ 昵称获取 =====

async function fetchNickname(qq) {
    try {
        const resp = await fetch(
            `https://apis.kit9.cn/api/qq_material/api.php?qq=${qq}`,
            { signal: AbortSignal.timeout(5000) }
        );
        const data = await resp.json();
        if (data.code === 200 && data.data && data.data.name) {
            return data.data.name;
        }
    } catch (e) {
        // 获取失败静默处理
    }
    return '';
}

// ===== 工具函数 =====

/** DJB2 哈希 */
function hash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
}

/** 获取指定区间的档位 */
function getTier(score) {
    return TIERS.find(t => score >= t.range[0] && score <= t.range[1]);
}

/** 根据 QQ 号生成完整结果 */
function computeResult(qq) {
    // 调试号码
    if (qq === '00000000000') {
        return { type: 'secret', key: '-infinity', ...SECRET_ENDINGS['-infinity'] };
    }
    if (qq === '99999999999') {
        return { type: 'secret', key: 'infinity', ...SECRET_ENDINGS['infinity'] };
    }

    const h1 = hash(qq + '🐷salt1');
    const h2 = hash(qq + '🐷salt2');

    // 稀有结局检测 (~1% each)
    if (h2 % 200 < 2) {
        return { type: 'secret', key: '-infinity', ...SECRET_ENDINGS['-infinity'] };
    }
    if (h2 % 200 > 197) {
        return { type: 'secret', key: 'infinity', ...SECRET_ENDINGS['infinity'] };
    }

    // 正常分数
    const score = h1 % 101;
    const tier = getTier(score);
    return {
        type: 'normal',
        score,
        ...tier,
    };
}

// ===== 页面切换 =====

function showPage(page) {
    [$inputPage, $loadingPage, $resultPage].forEach(p => p.classList.remove('active'));
    page.classList.add('active');
    // 重新触发入场动画
    page.style.animation = 'none';
    page.offsetHeight;
    page.style.animation = '';
}

// ===== 阶段1: 输入校验 =====

$qqInput.addEventListener('input', () => {
    const val = $qqInput.value.replace(/\D/g, '');
    $qqInput.value = val;

    const valid = val.length >= 5 && val.length <= 11;
    $btnTest.disabled = !valid;

    if (val.length === 0) {
        $inputHint.textContent = '输入 5-11 位数字开始测试';
        $inputHint.classList.remove('error');
    } else if (val.length < 5) {
        $inputHint.textContent = `还差 ${5 - val.length} 位数字～`;
        $inputHint.classList.add('error');
    } else if (valid) {
        $inputHint.textContent = '准备好了吗？点击开始测试吧！🐷';
        $inputHint.classList.remove('error');
    }
});

$qqInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !$btnTest.disabled) {
        startTest();
    }
});

$btnTest.addEventListener('click', () => {
    if (!$btnTest.disabled) {
        startTest();
    }
});

// ===== 阶段2: 加载动画 =====

function startTest() {
    const qq = $qqInput.value.trim();
    if (qq.length < 5 || qq.length > 11) return;

    currentQQ = qq;
    currentNickname = '';

    // 异步获取昵称（不阻塞加载动画）
    fetchNickname(qq).then(nick => { currentNickname = nick; });

    showPage($loadingPage);
    $progressFill.style.width = '0%';
    $progressLabel.textContent = '0%';
    $loadingText.textContent = LOADING_MESSAGES[0];

    const result = computeResult(qq);
    simulateLoading(result);
}

function simulateLoading(result) {
    const totalDuration = 3500; // 总时长 ms
    const startTime = performance.now();
    let lastMsgIdx = 0;

    // 文字轮播定时器
    const msgInterval = setInterval(() => {
        let idx;
        do {
            idx = Math.floor(Math.random() * LOADING_MESSAGES.length);
        } while (idx === lastMsgIdx && LOADING_MESSAGES.length > 1);
        lastMsgIdx = idx;
        $loadingText.style.opacity = '0';
        setTimeout(() => {
            $loadingText.textContent = LOADING_MESSAGES[idx];
            $loadingText.style.opacity = '1';
        }, 200);
    }, 1000 + Math.random() * 400);

    // 进度模拟 — 不均匀增长
    function tick() {
        const elapsed = performance.now() - startTime;
        const rawProgress = Math.min(elapsed / totalDuration, 1);

        // 使用缓动曲线模拟不均匀速度：先快后慢再冲刺
        // 在 80% 处故意放慢
        let eased;
        if (rawProgress < 0.6) {
            // 前段较快 (0→55%)
            eased = rawProgress * 0.92;
        } else if (rawProgress < 0.85) {
            // 中段放慢 (55%→75%)
            eased = 0.55 + (rawProgress - 0.6) * 0.8;
        } else {
            // 末段冲刺 (75%→100%)
            eased = 0.75 + (rawProgress - 0.85) * 1.67;
        }

        const percent = Math.min(Math.round(eased * 100), 100);
        $progressFill.style.width = percent + '%';
        $progressLabel.textContent = percent + '%';

        if (rawProgress < 1) {
            // 动态间隔：快的时候短间隔，慢的时候长间隔
            const interval = rawProgress < 0.6 ? 80 :
                             rawProgress < 0.85 ? 180 : 60;
            setTimeout(tick, interval);
        } else {
            // 加载完成
            clearInterval(msgInterval);
            $progressFill.style.width = '100%';
            $progressLabel.textContent = '100%';
            $loadingText.textContent = '分析完成！正在生成报告......';
            $loadingSub.textContent = '✅ 猪脑数据已成功解析';

            setTimeout(() => showResult(result), 600);
        }
    }

    // 初始延迟
    setTimeout(tick, 300);
}

// ===== 阶段3: 结果展示 =====

function showResult(result) {
    showPage($resultPage);

    // 重置样式
    $scoreNumber.classList.remove('secret');
    document.body.classList.remove('secret-infinity');
    $resultPig.innerHTML = pigImg(result.imgType);
    $resultTitle.textContent = result.title;
    $resultDesc.textContent = result.desc;

    // 渲染标签
    $resultTags.innerHTML = result.tags
        .map(t => `<span class="result-tag">${t}</span>`)
        .join('');

    // 渲染 QQ 用户信息
    if (currentNickname) {
        $resultAvatar.src = `https://q1.qlogo.cn/g?b=qq&nk=${currentQQ}&s=640`;
        $resultAvatar.style.display = '';
        $resultNick.textContent = currentNickname;
        $resultUser.style.display = '';
        $resultQQ.textContent = `QQ：${currentQQ}`;
    } else {
        $resultUser.style.display = 'none';
        $resultQQ.textContent = `测试账号：${currentQQ}`;
    }

    // 渲染分数
    if (result.type === 'secret') {
        // 稀有结局
        $scoreNumber.textContent = result.displayScore;
        $scoreNumber.classList.add('secret');
        $scoreNumber.style.color = result.color;

        // 全屏特效
        document.body.classList.add('secret-infinity');
        burstStars();
        setTimeout(() => document.body.classList.remove('secret-infinity'), 600);
    } else {
        // 正常分数 — 数字滚动动画
        $scoreNumber.style.color = '';
        animateScore(result.score);
    }

    // 结果卡片颜色点缀
    $resultTitle.style.color = result.color;
}

/** 分数滚动动画 */
function animateScore(target) {
    const duration = 1200;
    const startTime = performance.now();
    const startVal = 0;

    function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(startVal + (target - startVal) * eased);

        $scoreNumber.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            $scoreNumber.textContent = target;
        }
    }

    requestAnimationFrame(tick);
}

/** 稀有结局的星星爆破特效 */
function burstStars() {
    const emojis = ['✨', '🌟', '💫', '⭐', '🎉', '🔥', '💥', '🌈', '🪐', '💖'];
    const count = 30;

    for (let i = 0; i < count; i++) {
        const star = document.createElement('span');
        star.className = 'star-burst';
        star.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        star.style.left = '50%';
        star.style.top = '45%';
        star.style.setProperty('--dx', (Math.random() - 0.5) * 400 + 'px');
        star.style.setProperty('--dy', (Math.random() - 0.5) * 400 + 'px');
        star.style.animationDuration = (0.8 + Math.random() * 1.4) + 's';
        star.style.animationDelay = Math.random() * 0.3 + 's';
        document.body.appendChild(star);

        setTimeout(() => star.remove(), 2000);
    }
}

// ===== 背景漂浮小猪粒子 =====

function spawnParticle() {
    const emojis = ['🐷', '🐽', '💖', '🌸', '✨', '🍀', '💤', '🌟'];
    const el = document.createElement('span');
    el.className = 'particle';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.bottom = '-40px';
    el.style.animationDuration = (6 + Math.random() * 10) + 's';
    el.style.fontSize = (16 + Math.random() * 20) + 'px';
    $particles.appendChild(el);

    el.addEventListener('animationend', () => el.remove());
}

setInterval(spawnParticle, 2500);
// 初始生成一些
for (let i = 0; i < 6; i++) {
    setTimeout(spawnParticle, i * 400);
}

// ===== 重新测试 =====

$btnRetry.addEventListener('click', () => {
    showPage($inputPage);
    $qqInput.value = '';
    $btnTest.disabled = true;
    $inputHint.textContent = '输入 5-11 位数字开始测试';
    $inputHint.classList.remove('error');
    $qqInput.focus();
});

// ===== Canvas 分享图生成 =====

/**
 * 加载图片
 */
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

/**
 * 生成分享卡片 Canvas
 */
async function generateShareCard() {
    const W = 600;
    const H = 800;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // 背景渐变
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#fce4ec');
    grad.addColorStop(0.5, '#f8bbd0');
    grad.addColorStop(1, '#f3e5f5');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // 顶部装饰波纹
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.arc(W / 2, 0, 280, 0, Math.PI);
    ctx.fill();

    // 底部装饰
    ctx.fillStyle = 'rgba(233,30,99,0.06)';
    ctx.beginPath();
    ctx.arc(W / 2, H, 320, Math.PI, 0);
    ctx.fill();

    // 加载并绘制小猪图片
    const score = $scoreNumber.textContent;
    const imgType = $resultPig.querySelector('img')?.src;
    if (!imgType) throw new Error('找不到图片');

    try {
        const pigImg = await loadImage(imgType);
        const imgSize = 260;
        const imgX = (W - imgSize) / 2;
        const imgY = 80;

        // 图片阴影
        ctx.save();
        ctx.shadowColor = 'rgba(233,30,99,0.25)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 8;
        ctx.fillStyle = '#fff';
        roundRect(ctx, imgX - 8, imgY - 8, imgSize + 16, imgSize + 16, 24);
        ctx.fill();
        ctx.restore();

        // 裁剪圆角绘制图片
        ctx.save();
        roundRect(ctx, imgX, imgY, imgSize, imgSize, 18);
        ctx.clip();
        ctx.drawImage(pigImg, imgX, imgY, imgSize, imgSize);
        ctx.restore();
    } catch (e) {
        // 图片加载失败，画个占位圆
        ctx.fillStyle = '#f8bbd0';
        ctx.beginPath();
        ctx.arc(W / 2, 210, 110, 0, Math.PI * 2);
        ctx.fill();
    }

    // 分数大字
    const yTitle = 400;
    ctx.fillStyle = '#c2185b';
    ctx.font = 'bold 28px "PingFang SC","Microsoft YaHei",sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('聪明小猪指数', W / 2, yTitle);

    // 分数数字
    const scoreText = score + ' 分';
    ctx.fillStyle = '#e91e63';
    ctx.font = 'bold 72px "PingFang SC","Microsoft YaHei",sans-serif';
    const scoreY = yTitle + 60;
    ctx.fillText(scoreText, W / 2, scoreY);

    // 称号
    const title = $resultTitle.textContent;
    ctx.fillStyle = '#4a3040';
    ctx.font = 'bold 26px "PingFang SC","Microsoft YaHei",sans-serif';
    const titleY = scoreY + 54;
    ctx.fillText('「' + title + '」', W / 2, titleY);

    // 分隔线
    ctx.strokeStyle = 'rgba(233,30,99,0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, titleY + 36);
    ctx.lineTo(500, titleY + 36);
    ctx.stroke();

    // 测试账号信息
    const qqLineY = titleY + 62;
    ctx.fillStyle = '#8d6e7a';
    ctx.font = '15px "PingFang SC","Microsoft YaHei",sans-serif';
    let qqLine = `测试账号：${currentQQ}`;
    if (currentNickname) qqLine += ` (${currentNickname})`;
    ctx.fillText(qqLine, W / 2, qqLineY);

    // 网址 + 二维码
    const url = location.href;
    const qrY = titleY + 82;

    try {
        // 加载二维码图片
        const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data='
            + encodeURIComponent(url);
        const qrImg = await loadImage(qrUrl);
        const qrSize = 100;
        const qrX = 140;
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
    } catch (e) {
        // 二维码加载失败，忽略
    }

    // 网址文字（二维码右侧）
    ctx.textAlign = 'left';
    ctx.fillStyle = '#8d6e7a';
    ctx.font = '15px "PingFang SC","Microsoft YaHei",sans-serif';
    ctx.fillText('扫码访问：', 260, qrY + 40);
    ctx.font = '12px "PingFang SC","Microsoft YaHei",sans-serif';
    ctx.fillText(url, 260, qrY + 64);

    // 底部标语
    ctx.fillStyle = '#c0a8b2';
    ctx.font = '14px "PingFang SC","Microsoft YaHei",sans-serif';
    ctx.fillText('🐷 来测测你的猪智力有多高！', W / 2, H - 42);

    // 水印
    ctx.fillStyle = 'rgba(150,100,120,0.5)';
    ctx.font = 'italic 18px "PingFang SC","Microsoft YaHei",sans-serif';
    ctx.fillText('——BG', W / 2, H - 18);

    return canvas;
}

/** 圆角矩形路径 */
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// ===== 分享 =====

$btnShare.addEventListener('click', async () => {
    $btnShare.textContent = '⏳ 生成中...';
    $btnShare.disabled = true;

    try {
        const canvas = await generateShareCard();
        $shareImage.src = canvas.toDataURL('image/png');
        $shareOverlay.classList.add('active');
    } catch (e) {
        // 兜底：纯文字复制
        const title = $resultTitle.textContent;
        const score = $scoreNumber.textContent;
        copyText(`🐷 我的聪明小猪指数是：${score} 分！\n称号：${title}\n${location.href}`);
        showToast('⚠️ 图片生成失败，已复制文字结果～');
    } finally {
        $btnShare.textContent = '📋 分享结果';
        $btnShare.disabled = false;
    }
});

// 关闭弹窗
$shareClose.addEventListener('click', () => {
    $shareOverlay.classList.remove('active');
});

$shareOverlay.addEventListener('click', (e) => {
    if (e.target === $shareOverlay) {
        $shareOverlay.classList.remove('active');
    }
});

// 弹窗内复制文字
$btnCopyText.addEventListener('click', () => {
    const title = $resultTitle.textContent;
    const score = $scoreNumber.textContent;
    copyText(`🐷 我的聪明小猪指数是：${score} 分！\n称号：${title}\n快来测测你的猪智力有多高！\n${location.href}`);
    showToast('✅ 文字已复制，去粘贴分享吧～');
});

function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
        document.execCommand('copy');
    } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
}

// ===== Toast =====

let toastTimer;

function showToast(msg) {
    clearTimeout(toastTimer);
    $toast.textContent = msg;
    $toast.classList.add('show');
    toastTimer = setTimeout(() => {
        $toast.classList.remove('show');
    }, 2500);
}

// ===== 初始聚焦 =====
$qqInput.focus();

// ===== 初始化 SVG 小猪 =====
document.getElementById('input-pig').innerHTML = pigImg('home');
document.getElementById('loading-pig').innerHTML = pigImg('loading');
