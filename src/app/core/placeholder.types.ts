import { I18nModule } from 'app/core/i18n/i18n.module';

export class Placeholders {
    userType: string;
    state: string;
    constructor() {
        this.userType = I18nModule.translate('UserType');
        this.state = I18nModule.translate('state');
    }
}
