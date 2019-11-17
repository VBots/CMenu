import stickersStorage, { IStickerStorage } from "./stickersStorage";
import { MessageContext } from './types';

export default class CMenu {

    public name: string;
    public regex: RegExp;
    public handler: Function = (() => true);
    public stickersType: IStickerStorage['types'] | IStickerStorage['ids'];

    public cmd: string;

    /**
     * Создание элемента меню
	 * @param name Название элемента меню
	 * @param regex Выражение для захвата
	 * @param handler Дополнительная проверка
	 * @param stickersType Массив из строк или/и чисел - Тип из набора стикеров или его ID...
	 * 
	 * ```ts
	 * const MMenu = [
	 * 	Start: new CMenu("Start", [ "start", "старт", "начать" ], null, ['start', 'go']),
	 * 	Confirm_Yes: new CMenu("Confirm_Yes", ['y', 'yes', 'true', 'да'], null, "yes"),
	 * ];
	 * ```
     */
    constructor(
        name: string,
        regex?: RegExp | string[],
        handler: Function | null = (() => true),
        stickersType: IStickerStorage['types'] | IStickerStorage['ids'] | string | number | null = null
    ) {
        this.name = name;
        const lowerName = name.toLocaleLowerCase();
        this.cmd = `!cmd_${lowerName}`;

        regex = (!regex || Array.isArray(regex) && !regex.length) ? new RegExp(`^(${lowerName}|\/${lowerName})$`, "i") : regex;
        this.regex = (regex instanceof RegExp) ? regex : new RegExp(`^(${regex.join('|')}|\/${regex.join(`|\/`)})$`, "i");

        this.handler = typeof handler === "function" ? handler : (() => true);

        // @ts-ignore
        this.stickersType =
          stickersType &&
          (Array.isArray(stickersType) ? stickersType : [stickersType]) || [];
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
    public isHere(str: string): boolean {
        return this.regex.test(str) && this.handler(str);
    }

	/**
	 * Есть ли свзяь со стикером
	 * @param id Sticker ID
	 */
	public isSticker(id: number): boolean {
		let passed = this.stickersType && stickersStorage.find((e: IStickerStorage) => {
			for(const typeName of this.stickersType) {
				if(typeName == id) {
					return true;
				}

                // @ts-ignore
				if(e.types.includes(typeName) && e.ids.includes(id)) {
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
export const checkMenu = (menu: CMenu, context: MessageContext) => (
	(context.text && menu.isHere(context.text))
	|| context.state.command === cmdMenu(menu)
	|| (context.hasAttachments('sticker') && menu.isSticker(context.getAttachments('sticker')[0].id) )
);