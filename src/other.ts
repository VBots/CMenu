import { MessageContext, VKUpdates, UploadSource } from './types';
import CMenu, { checkMenu, cmdMenu } from './CMenu';
// import VK from 'vk-io/lib/vk';


export const CreateHearCMenu = (updates: VKUpdates): Function => {
    return (menu: CMenu, handle: Function) => {
        if (!(menu instanceof CMenu)) {
            throw "[Wrong CMenu] " + menu;
        }

        updates.hear(
            [
                (text: string | null, context: MessageContext): boolean => {
                    const passed = checkMenu(menu, context);

                    if (text && menu.isHere(context)) {
                        context.$match = menu.match(text!)!;
                    }

                    return passed;
                }
            ],
            // @ts-ignore
            handle
        );
    };
}

export interface ICreateSetMenu {
    getMenu: ((context: MessageContext, oneTime: boolean, menuID?: string | null, inLine?: boolean) => object);
    // vk?: VK;
    // cdpw?: CDPW;
};

export const CreateSetMenu = ({ getMenu/* , vk, cdpw */ }: ICreateSetMenu): Function => {

    return async function setMenu(context: MessageContext, menu?: CMenu, message: string = "", oneTime: boolean = false, photo?: UploadSource | null, inLine: boolean = false): Promise<number> {
        // @ts-ignore
        const { session } = context;
    
        if (menu) {
            session.menuState = cmdMenu(menu);
        }

        if (message) {
            try {
                const params = {
                    message,
                    keyboard: getMenu(context, oneTime, null, inLine)
                };

                // await context[photo ? "sendPhotos" : "send"]((photo ? photo : payLoad), (photo ? payLoad : undefined));
                if (photo) {
                    return await context.sendPhotos(photo, params);
                }
                else {
                    return await context.send(params);
                }
            } catch (e) {
                // Code №121 - Invalid hash
                if (e.message && e.message.indexOf("Invalid hash") !== -1) {
                    // Попытка повторно отправить сообщение без фото
                    if (photo) {
                        setMenu(context, menu, message, oneTime);
                    }
                }
                else {
                    throw e;
                }
            }
        }

        return 0;
    }
}