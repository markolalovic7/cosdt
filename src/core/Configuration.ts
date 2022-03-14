import moment from 'moment';
import 'moment/locale/sr';

moment.locale('sr');

export class Configuration {
    static baseUrl = "https://cosdt.datumsolutions.me";
    static apiUrl = `${Configuration.baseUrl}/api`
}
