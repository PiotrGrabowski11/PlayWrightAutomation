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
    await email.locator('#passwordControl').type("xxxxxx", {delay: 100});

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
    page.waitForSelector('.xs-user-menu-username-text');
    
    // Dodawanie 4 filmów do listy ulubionych
    var lista = []
    for (let i=0; i<4; i++) {
        await page.waitForLoadState('domcontentloaded');
        var nowyTytul = await page.locator(".tile-infoTitle a").nth(i).textContent();
        lista.push(nowyTytul);
        await page.locator('.tile-img').nth(i).click();
        await page.waitForSelector('.asset-actionsItemLink');
        await page.locator('.asset-actionsItemLink').click();
        await page.mouse.click(10, 10);
    }
    
    // przejście do zakładki favourites
    await page.waitForLoadState('domcontentloaded');
    await page.mouse.wheel(0,-1800);
    await page.locator('.xs-category-menu-list-element').last().click();
  
    // sprawdzanie czy lista favourites jest wyświetlana według kolejności dodania
    for (let i=0; i<4; i++) {
    await page.waitForSelector('.tile-infoTitle-link', { text: lista[3-i] });
    const title = await page.locator('.tile-infoTitle-link').nth(i).textContent();
    await expect(title).toEqual(lista[3-i]);
    }

    // usuwanie filmów z listy ulubionych
    for (let i=0; i<4; i++) {
        await page.waitForLoadState('networkidle');
        await page.locator('.m-asset').nth(0).click();
        await page.waitForSelector('.asset-actionsItemLink');
        await page.locator('.asset-actionsItemLink').click();  
        await page.mouse.click(10, 10);  
    }

    // sprawdzanie prawidłowego wyświetlenia komunikatu
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('.xsEmptyContent-header');
    await expect(page.locator('.xsEmptyContent-header')).toContainText('Beklager, vi fant ikke noe innhold.');

   //przejście do zakładki Seriale
    await page.mouse.wheel(0,-1800);
    await page.waitForLoadState('domcontentloaded');
    await page.locator('.xs-category-menu-list-element').nth(2).click();
    await page.locator('[ng-change*="Availability"]').click();
    await expect(page.locator('[ng-change*="Availability"]')).toBeChecked;


    // dodanie 4 seriali do listy ulubionych
    await page.waitForLoadState('networkidle');
    var lista2 = []
    for (let i=0; i<4; i++) {
        var nowyTytulSeriale = await page.locator(".tile-infoTitle-link").nth(i).textContent()
        lista2.push(nowyTytulSeriale);
        await page.waitForLoadState('domcontentloaded');
        await page.locator('.m-asset').nth(i).click();
        // await page.waitForSelector('.asset-actionsItemLink');
        await page.locator('.asset-actionsItemLink').click();
        await page.mouse.click(10, 10);
    }

    // przejście do zakładki favourites
    await page.locator('.xs-category-menu-list-element').last().click();
    await page.waitForLoadState('networkidle');


    // sprawdzanie czy lista favourites (seriale) jest wyświetlana według kolejności dodania
    for (let i=0; i<4; i++) {
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('.tile-infoTitle-link', { text: lista2[3-i] });
        const title = await page.locator('.tile-infoTitle-link').nth(i).textContent();
        await expect(title).toEqual(lista2[3-i]);
        }

        // usuwanie seriali z listy ulubionych
    for (let i=0; i<4; i++) {
        await page.waitForLoadState('networkidle');
        await page.locator('.m-asset').nth(0).click();
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('.asset-actionsItemLink', { timeout: 50000 });
        await page.locator('.asset-actionsItemLink').click();  
        await page.mouse.click(10, 10);  
    }

    // sprawdzanie prawidłowego wyświetlenia komunikatu
    await page.waitForSelector('.xsEmptyContent-header');
    await expect(page.locator('.xsEmptyContent-header')).toContainText('Beklager, vi fant ikke noe innhold.');
    
})   
