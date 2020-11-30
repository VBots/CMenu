import { CMenu } from '.';

export class KitMenu {
    public static Get() {
        return {
            None: new CMenu('None'),
            Close: new CMenu('Close'),
            NotSupportedBtn: new CMenu('NotSupportedBtn'),

            Start: new CMenu('Start', null, null, ['start', 'go']),

            // Шаблон кнопок "Да, Нет, Отмена" для сцен
            TMPL_YesNo: new CMenu('TMPL_YesNo'),
            TMPL_YesCancel: new CMenu('TMPL_YesCancel'),
            TMPL_Cancel: new CMenu('TMPL_Cancel'),

            // Результаты подтверждений
            Confirm_Yes: new CMenu(
                'Confirm_Yes',
                ['y', 'yea', 'yes', 'true', 'da', 'да'],
                null,
                'yes'
            ),
            Confirm_No: new CMenu(
                'Confirm_No',
                ['n', 'no', 'not', 'false', 'net', 'не', 'нет'],
                null,
                'no'
            ),
            Confirm_Cancel: new CMenu(
                'Confirm_Cancel',
                ['cancel', 'отмена'],
                null,
                'cancel'
            ),
        };
    }
}