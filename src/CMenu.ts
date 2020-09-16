import { Context } from 'vk-io';
import catcherKitStorage from './catcher-kit-storage';
import { HandlerFunction, ICatcherKitType, ICatcherKitStorage } from './types';

/**
 * Class CustomMenu element
 */
export class CMenu {
    public name: string;
    public regex: RegExp;
    public handler: HandlerFunction = () => true;
    public catcherKitType?:
        | ICatcherKitStorage['types']
        | ICatcherKitStorage['stickers'];

    public cmd: string;

    /**
     * Создание элемента меню
     * @param name Название элемента меню
     * @param regex Выражение для захвата
     * @param handler Дополнительная проверка
     * @param catcherKitType Массив из строк или/и чисел - Тип из набора стикеров или его ID...
     *
     * Example:
     * ```ts
     * const MMenu = [
     *  Close: new CMenu('Close'),
     *  Start: new CMenu('Start', [ 'start', 'старт', 'начать' ], null, ['start', 'go']),
     *  Confirm_Yes: new CMenu('Confirm_Yes', ['y', 'yes', 'true', 'да'], null, 'yes'),
     * ];
     * ```
     */
    constructor(
        name: string,
        regex?: RegExp | string[] | null,
        handler?: ICatcherKitType | HandlerFunction | null,
        catcherKitType?: ICatcherKitType | null
    ) {
        this.name = name;
        const lowerName = name.toLocaleLowerCase();
        this.cmd = `!cmd_${lowerName}`;

        regex =
            !regex || (Array.isArray(regex) && !regex.length)
                ? new RegExp(`^(${lowerName}|\/${lowerName})$`, 'i')
                : regex;
        this.regex =
            regex instanceof RegExp
                ? regex
                : new RegExp(
                      `^(${regex.join('|')}|\/${regex.join(`|\/`)})$`,
                      'i'
                  );

        this.handler = typeof handler === 'function' ? handler : () => true;

        this.catcherKitType = catcherKitType
            ? Array.isArray(catcherKitType)
                ? catcherKitType
                : ([catcherKitType] as
                      | ICatcherKitStorage['types']
                      | ICatcherKitStorage['stickers'])
            : typeof handler !== 'function' && Array.isArray(handler)
            ? handler
            : [];
    }

    /**
     * Test string `str`
     */
    public test(str: string): boolean {
        return this.regex.test(str);
    }

    /**
     * Match string `str`
     */
    public match(str: string): RegExpMatchArray | null {
        return str.match(this.regex);
    }

    /**
     * isHere
     */
    public isHere(context: Context): boolean {
        return this.regex.test(context.text!) && this.handler(context);
    }

    /**
     * Есть ли свзяь со стикером
     * @param id Sticker ID
     */
    public isSticker(id: number): boolean {
        let passed =
            this.catcherKitType &&
            catcherKitStorage.find((e: ICatcherKitStorage) => {
                for (const typeOrId of this.catcherKitType!) {
                    if (typeOrId === id) {
                        return true;
                    }

                    if (
                        e.types.includes(typeOrId as string) &&
                        e.stickers.includes(id)
                    ) {
                        return true;
                    }
                }
                return false;
            });
        return Boolean(passed);
    }

    /**
     * Returns custom tag
     */
    public get [Symbol.toStringTag](): string {
        return `Menu_${this.name}`;
    }
}

export const cmdMenu = (menu: CMenu): string => menu.cmd;

export const checkMenu = (menu: CMenu, context: Context) =>
    (context.text && menu.isHere(context)) ||
    (context.state && context.state.command === cmdMenu(menu)) ||
    (context.hasAttachments('sticker') && menu.isSticker(context.getAttachments('sticker')[0].id));
