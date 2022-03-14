import {Moment} from "moment";
import {Mentor} from "./Mentor";

export class ClassAttendeeMentorDiary {
    id!: number;
    date?: string;
    metodologija?: string;
    napomena?: string;
    nastavniMaterijal?: string;
    osjecajEticnosti?: string;
    osjecajOdgovornosti?: string;
    periodPrakticneObuke?: string|Array<Moment>|undefined;
    prisutan: boolean = false;
    sposobnostZaDonosenjeOdluka?: string;
    sposobnostZaVodjenjePostupka?: string;
    zainteresovanost?: string;
    aktivnost?: string;
    aktivnostiPrakticnogDijelaObuke?: string;
    atendeeMentor?: Mentor;
}
