import { CMenu, checkMenu } from '../src';
import { AttachmentTypeString, MessageContext } from 'vk-io';

// @ts-ignore
const createContext = ({
    text,
    command,
    sticker,
}: {
    text?: string;
    command?: string;
    sticker?: number;
} = {}): MessageContext => ({
    text,
    state: {
        command,
    },
    hasAttachments(e: AttachmentTypeString = 'sticker'): boolean {
        return Boolean(sticker && sticker > 0);
    },
    // @ts-ignore
    getAttachments(e: string = 'sticker'): [{ id: number }] {
        return !sticker ? [{ id: 0 }] : [{ id: sticker }];
    },
});

describe('CMenuZ', (): void => {
    describe('CMenu "Help"', (): void => {
        const menu = new CMenu("Help", ['help']);
       
        it("simulate sms sending", () => {
            const context = createContext({ text: "help" });
            expect(checkMenu(menu, context)).toBe(true); 
        });
       
        it("simulate sms sending with slash", () => {
            const context = createContext({ text: "/help" });
            expect(checkMenu(menu, context)).toBe(true); 
        });

        it("simulate click button", () => {
            const context = createContext({ text: "Help me pls", command: "!cmd_help" });
            expect(checkMenu(menu, context)).toBe(true); 
        });
    });

    describe('CMenu "Start" with Sticker', (): void => {
        const menu = new CMenu("Start", ['start'], null, "start");
       
        it("simulate sms sending", () => {
            const context = createContext({ text: "start" });
            expect(checkMenu(menu, context)).toBe(true); 
        });

        it("simulate click button", () => {
            const context = createContext({ text: "qqq", command: "!cmd_start" });
            expect(checkMenu(menu, context)).toBe(true); 
        });

        it("simulate sticker sending", () => {
        const context = createContext({ sticker: 12467 });
            expect(checkMenu(menu, context)).toBe(true); 
        });
    });
});
