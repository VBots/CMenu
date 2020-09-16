import {
    IMessageContextSendOptions,
    IUploadSourceMedia,
    MessageContext,
} from 'vk-io';
import { CMenu, checkMenu, cmdMenu } from './cmenu';
import { CMenuManager } from './cmenu-manager';
import { AllowArray, ICustomContext, IKeyboardGeneratorOptions } from './types';

// Modificators

export const ModifiyContext = <C extends MessageContext>(
    manager: CMenuManager<C>,
    context: C & ICustomContext
) => {
    const Keyboard2Params = Keyboard2ParamsBuilder(manager, context);
    const menuSet = (menu: CMenu) => {
        if (menu && context.session) {
            context.session.menuState = cmdMenu(menu);
        }
    };

    context.checkMenu = (menu: CMenu) => checkMenu(menu, context);

    context.sendCM = async (
        menu: CMenu,
        menuParams: IKeyboardGeneratorOptions = {},
        text: string | IMessageContextSendOptions,
        params?: IMessageContextSendOptions
    ) => (
        menuSet(menu),
        await context.send(
            text,
            Keyboard2Params<IMessageContextSendOptions>(params, menuParams)
        )
    );

    context.replyCM = async (
        menu: CMenu,
        menuParams: IKeyboardGeneratorOptions = {},
		text: string | IMessageContextSendOptions,
		params?: IMessageContextSendOptions
    ) => (
        menuSet(menu),
        await context.reply(
            text,
            Keyboard2Params<IMessageContextSendOptions>(params, menuParams)
        )
    );

    context.sendPhotosCM = async (
        menu: CMenu,
        menuParams: IKeyboardGeneratorOptions = {},
        rawSources: AllowArray<IUploadSourceMedia>,
        params: IMessageContextSendOptions = {}
    ) => (
        menuSet(menu),
        await context.sendPhotos(
            rawSources,
            Keyboard2Params<IMessageContextSendOptions>(params, menuParams)
        )
    );

    context.sendDocumentsCM = async (
        menu: CMenu,
        menuParams: IKeyboardGeneratorOptions = {},
        rawSources: AllowArray<IUploadSourceMedia>,
        params: IMessageContextSendOptions = {}
    ) => (
        menuSet(menu),
        await context.sendDocuments(
            rawSources,
            Keyboard2Params<IMessageContextSendOptions>(params, menuParams)
        )
    );

    context.sendAudioMessageCM = async (
        menu: CMenu,
        menuParams: IKeyboardGeneratorOptions = {},
        source: IUploadSourceMedia,
        params: IMessageContextSendOptions = {}
    ) => (
        menuSet(menu),
        await context.sendAudioMessage(
            source,
            Keyboard2Params<IMessageContextSendOptions>(params, menuParams)
        )
    );
};

const Keyboard2ParamsBuilder = <C extends MessageContext>(
    manager: CMenuManager<C>,
    context: C & ICustomContext
) => <P>(
    params?: P,
    menuParams: IKeyboardGeneratorOptions = {
        isOneTime: false,
        isInline: false,
    }
) => ({
    keyboard: manager.menuGenerator(context, null, menuParams),
    ...params
}) as P;
