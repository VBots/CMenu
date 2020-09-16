const { VK, Keyboard } = require('vk-io');
const { HearManager } = require('@vk-io/hear');
const { SessionManager } = require('@vk-io/session');
const { cmdMenu, CMenu, CMenuManager, ICustomContext } = require('../../VBots/CMenu/lib');

require('dotenv').config();

const vk = new VK({
    token: process.env.TOKEN,
});

let MMenu = {
    /** Не изменять лавиатуру */
    None: new CMenu('None'),
    /** Скрыть клавиатуру */
    Close: new CMenu('Close'),

    Start: new CMenu('Start', null, null, ['start', 'go']),

    MainMenu: new CMenu('MainMenu', ['главное меню', 'main menu', 'menu', 'меню']),
    About: new CMenu('About', ['что это', 'о боте']),
    ResetMe: new CMenu('ResetMe', ['resetme', 'rsme']),

    CallbackMe: new CMenu('CallbackMe'),
};

function menuConstruct(context, menuID = cmdMenu(MMenu.None), { isOneTime = false, isInline = false }) {
    if (menuID === cmdMenu(MMenu.None)) {
        return undefined;
    }

    if (menuID === cmdMenu(MMenu.Close)) {
        return Keyboard.keyboard([]).oneTime();
    }
    const isMenu = (e) => menuID == cmdMenu(e);

    menuID = menuID || cmdMenu(MMenu.MainMenu);

    let menuArr = [];

    if (isMenu(MMenu.Start) || isMenu(MMenu.MainMenu)) {
        menuArr.push([
            Keyboard.textButton({
                label: 'О боте',
                payload: {
                    command: cmdMenu(MMenu.About),
                },
                color: Keyboard.SECONDARY_COLOR,
            }),
            Keyboard.callbackButton({
                label: 'Callback me',
                color: Keyboard.PRIMARY_COLOR,
                payload: {
                    command: cmdMenu(MMenu.CallbackMe),
                },
            }),
        ]);
    }

    return Keyboard.keyboard(menuArr).inline(isInline).oneTime(isOneTime);
}

const sessionManager = new SessionManager();
const hearManager = new HearManager();
const MenuMan = new CMenuManager(menuConstruct, hearManager);

function setDefaultSessionMiddleware() {
    return async (context, next) => {
        const { session } = context;

        if (!('menuState' in session)) {
            session.menuState = cmdMenu(MMenu.None);
        }

        await next();
    }
}

// Skip outbox message and handle errors
vk.updates.use(async (context, next) => {
    if (context.is('message') && context.isOutbox) {
        return;
    }

    try {
        await next();
    } catch (error) {
        console.error('Error:', error);
    }
});
// Init memoryStore player
vk.updates.on('message', sessionManager.middleware);
// Set default session
vk.updates.on('message', setDefaultSessionMiddleware());
vk.updates.on('message_new', MenuMan.middleware);
vk.updates.on('message_new', hearManager.middleware);

MenuMan.hear(MMenu.Start, async (context) => {
    context.sendCM(MMenu.MainMenu, {}, 'Main menu');
});

MenuMan.hear(MMenu.About, async (context) => {
    context.send('About me..');
});

MenuMan.hear(MMenu.CallbackMe, (context) => {
    context.send('Это работает с телефона');
});

MenuMan.hear(MMenu.Help, async (context) => {
    context.send('Ahmm... Use start', {
        keyboard: menuConstruct(context, cmdMenu(MMenu.Close)),
        attachment: ['doc191039467_523329920']
    });
});

MenuMan.hear(MMenu.ResetMe, async (context) => {
    context.session = {};
    context.sendCM(MMenu.None, {}, 'Reset user.');
});

// Не будет вызвано, т.к. используется `hearManager` и он передан в `CMenuManager`
MenuMan.onFallback(async (context) => {
    context.sendCM(MMenu.Start, {}, 'no menu');
});

hearManager.hear(/^qq$/i, async (context) => {
    context.sendCM(MMenu.Start, {}, 'HelloW');
});

hearManager.onFallback(async (context) => {
    context.sendCM(MMenu.Start, {}, '?what');
});

vk.updates.on('message_event', async (context) => {
    let result = null;
    console.log(context);

    switch (context.eventPayload.command) {
        case cmdMenu(MMenu.CallbackMe):
            result = await context.answer({
                type: 'show_snackbar',
                text: 'Qqq',
            });
            break;

        default:
            result = await context.answer({
                type: 'show_snackbar',
                text: '🤔 Zzh...',
            });
            break;
    }

    console.log(result);
});

vk.updates
    .start()
    .then(() => console.log('Started'))
    .catch(console.error);
