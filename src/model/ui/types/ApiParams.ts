export interface ApiParams {
    page?: number;
    size?: number;
    sort?: string;
    [x: string] : number | string | boolean | undefined;
}