const {test, expect} = require('@playwright/test');


test('Page Playwright test', async ({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();

    const loginLink = await page.locator('.xs-user-menu-log-in');

    await page.goto("https://tv-test.allente.no/home");

    // logowanie
    await page.locator('#onetrust-accept-btn-handler').click();
    await page.locator('.xs-user-menu-log-in').click();

    const[email] = await Promise.all([
        context.waitForEvent('page'),
        loginLink.click(),
    ])
    await email.waitForLoadState('networkidle');
    await email.locator('#usernameControl').type("apple@cd.no", {delay: 100});
    await email.locator('.btn').click();
    await email.locator('#passwordControl').type("xxxxx", {delay: 100});

    await Promise.all([
        email.locator('#loginButton').click(),
        page.waitForSelector('.xs-user-menu-username-text'),
    ])
    // popup - nowa apka
    await page.locator('.close').click();


    // przejście do zakładki filmy i zaznaczenie opcji 'tylko dostępne'
    await page.locator('.xs-category-menu-list-element').nth(3).click();
    await page.waitForLoadState('networkidle');
    await page.locator('[ng-change*="Availability"]').click();
    await expect(page.locator('[ng-change*="Availability"]')).toBeChecked;
    
    await page.pause();

// uruchamianie 4 filmów

 var lista = []
    for (let i=0; i<4; i++) {
        await page.waitForLoadState('domcontentloaded');
        var nowyTytul = await page.locator(".tile-infoTitle a").nth(i).textContent();
        lista.push(nowyTytul);
        await page.locator('.tile-img').nth(i).click();
        await page.locator('.asset-icon.m-play').click();
        await page.waitForTimeout(8000);
        await page.mouse.click(10, 10);

    }



})
