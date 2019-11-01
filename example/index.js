const { VK, Keyboard } = require('vk-io');
const { SessionManager } = require('@vk-io/session');
const { CMenu, cmdMenu, CreateHearCMenu, CreateSetMenu } = require("..");

const vk = new VK();
const { updates } = vk;

vk.token = '__YOUR_TOKEN__';

const sessionManager = new SessionManager();

const MMenu = {
    /** Скрыть клавиатуру */
	Close: new CMenu("Close"),
    /** Не изменять лавиатуру */
    None: new CMenu("None"),
    
	Start: new CMenu("Start", [ "start", "старт", "начать" ], null, "start"),

    Help: new CMenu("Help", [ "help", "помощь" ], null, 'help'),
    
	ResetMe: new CMenu("ResetMe", [ "resetme", "rsme" ]),
};

const hearCMenu = CreateHearCMenu(updates);
const setMenu = CreateSetMenu({ vk, getMenu });


function getMenu(context, oneTime, menuID) {
    return menuConstruct(context, (menuID || context.session.menuState || cmdMenu(MMenu.None)), oneTime);
}
// Пример с генерацией клавиатуры взят из старого проекта. Обновлю позже
function menuConstruct(context, menuID = cmdMenu(MMenu.Start), oneTime = false) {
	if(menuID == cmdMenu(MMenu.None)) {
		return undefined;
	}

	if(menuID == cmdMenu(MMenu.Close)) {
		const KB = Keyboard.keyboard([]);
		KB.oneTime = true;
		return KB;
	}

	// const { session: { player } } = context;

	let menuArr = [];

	if(menuID == cmdMenu(MMenu.Start)) {
        menuArr.push(
            Keyboard.textButton({
                label: 'Reset',
                payload: {
                    command: cmdMenu(MMenu.ResetMe),
                },
                color: Keyboard.NEGATIVE_COLOR
            }),
        );
		
		menuArr.push(
			Keyboard.textButton({
				label: 'Помощь',
				payload: {
					command: cmdMenu(MMenu.Help),
				},
				color: Keyboard.SECONDARY_COLOR
			}),
		);
	}
	// else if(menuID == cmdMenu(MMenu.TMPL_Cancel)) {
	// 	menuArr.push(Keyboard.textButton({
	// 		label: 'Отмена',
	// 		payload: {
	// 			command: cmdMenu(MMenu.Confirm_Cancel),
	// 		},
	// 		color: Keyboard.SECONDARY_COLOR
	// 	}));
    // }
    // ...

	const KB = Keyboard.keyboard(menuArr);
	KB.oneTime = oneTime;
	return KB;
}


function setDefaultSessionMiddleware() {
	return async (context, next) => {
		const { session } = context;

		if (!('menuState' in session)) {
			session.menuState = cmdMenu(MMenu.None);
		}

		await next();
	}
}

function setHears() {

	hearCMenu(MMenu.Start, async (context, next) => {
		setMenu(context, MMenu.Start, "Start PAGE");
		await next();
    });
    
	hearCMenu(MMenu.Help, async (context) => {
        await context.send("Ahmm... Use start", {
            keyboard: getMenu(context, true, cmdMenu(MMenu.Close)),
            attachment: [ "doc191039467_523329920" ]
        });
    });
    
	hearCMenu(MMenu.ResetMe, async (context) => {
		context.session = {};
		setMenu(context, MMenu.None, "Reset user.");
    });
    
}

(async function run() {
    // Skip outbox message and handle errors
    updates.use(async (context, next) => {
        if (context.is('message') && context.isOutbox) {
            return;
        }

        try {
            await next();
        } catch (error) {
            console.error('Error:', error);
        }
    })
	// Init memoryStore player
	.on('message', sessionManager.middleware)
	// Set default session
	.on('message', setDefaultSessionMiddleware());
    
    setHears();


    await vk.updates.start();
    console.log('Polling started');
})();