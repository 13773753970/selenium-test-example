const {Builder, By, Key, until} = require('selenium-webdriver');
const assert = require('chai').assert;

describe('meijupan website test', () => {
    let driver;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    })

    after(async () => {
        await driver.quit();
    });

    it('should login success', async () => {
        const user = {
            username: 'daniel01',
            password: '1234qwer',
        }
        // 打开登录页
        await driver.get('https://www.meijupan.com/index.php/user/login.html');
        // 输入账号密码
        await driver.findElement(By.css('input#user_name')).sendKeys(user.username);
        await driver.findElement(By.css('input#user_pwd')).sendKeys(user.password);
        // 点击“立即登录”
        await driver.findElement(By.css('input#btn_submit')).click();
        await driver.wait(until.titleContains('会员中心'), 3000);
        // 检查是否登录成功
        const name = await driver.findElement(By.css('#member #left .tou .name-tit')).getText();
        assert.equal(name, user.username);
        // 退出登录
        await driver.findElement(By.css('ul.nav li:last-child a')).click();
        await driver.wait(until.titleContains('用户登录'), 3000);
        // 检查是否退回到登录页
        const title = await driver.findElement(By.css('.reg-w form h4')).getText();
        assert.equal(title, '会员登录');
    })

    it('should search and play videos', async () => {
        // 打开美剧盘
        await driver.get('https://www.meijupan.com/');
        // 搜索“西部世界”
        await driver.findElement(By.id('txt')).sendKeys('西部世界', Key.RETURN);
        await driver.wait(until.titleContains('西部世界', 3000));
        // 检查搜索结果
        const videosEle = await driver.findElements(By.css('.vodlist .searchlist_item'));
        assert(videosEle.length >= 1, '搜索结果必须大于等于1');
        // 点击西部世界第一季
        await driver.findElement(By.css('.vodlist .searchlist_item .searchlist_img')).click();
        await driver.wait(until.elementsLocated(By.css('div.playbtn.o_play')), 3000);
        // 点击立即播放
        await driver.findElement(By.css('div.playbtn.o_play')).click();
        // 等待播放器的iframe加载完成
        await driver.wait(until.elementsLocated(By.css('#playleft iframe')), 3000);
        // 将上下文转向播放器的iframe
        const videoFrame = await driver.findElement(By.css('#playleft iframe'));
        await driver.switchTo().frame(videoFrame);
        // 检查视频是否加载成功
        const videoPlayer = await driver.findElement(By.css('video.dplayer-video'));
        assert.isNotEmpty(videoPlayer);
    });

    it('should toggle theme background', async () => {
        // 打开美剧盘
        await driver.get('https://www.meijupan.com/');
        // 查看当前颜色
        const color_1 = await driver.findElement(By.css('body')).getCssValue('background');
        // 切换背景色
        await driver.findElement(By.css('ul.extra li:nth-child(2)')).click();
        // 检查背景色是否变化
        const color_2 = await driver.findElement(By.css('body')).getCssValue('background');
        assert.notEqual(color_1, color_2);
    });

    it('should change theme color', async () => {
        // 打开美剧盘
        await driver.get('https://www.meijupan.com/');
        // 点击主题色图标
        await driver.findElement(By.css('ul.extra li:nth-child(3)')).click();
        // 点击蓝色
        await driver.findElement(By.css('ul#themes #blue')).click();
        // 检查主题色是否变化
        await delay(1000);
        const color = await driver.findElement(By.css('.head_menu_a li.active a')).getCssValue('color');
        assert.equal(color, 'rgba(24, 144, 255, 1)');
    });
})

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}