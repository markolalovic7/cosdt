
export class ClassLectureDiary {
    classAttendeesId: number = 0;
    classLectureId?: number = 0;
    firstName?: string;
    lastName?: string;
    metodologija?: string;
    motivisanost?: string;
    napomena?: string;
    nastavniMaterijal?: string;
    obrazlozenje?: string;
    ocjena?: string;
    pokazanoZnanjeIzOblasti?: string;
    prisutan: boolean = false;
    razumijevanjeUloge?: string;
    sposobnostLogZakljucivanja?: string;
    ukljucivanjeUdiskusiju?: string;
    lecturerId1: number = 0;
    lecturerId2: number = 0;
    lecturerId3: number = 0;
    lecturerOcjena1?: string;
    lecturerOcjena2?: string;
    lecturerOcjena3?: string;
    lecturerOpis1?: string;
    lecturerOpis2?: string;
    lecturerOpis3?: string;

    //data grid mandatory id
    id!: number;
}
