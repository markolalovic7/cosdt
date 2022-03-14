import Axios from "axios";
import { BookSubcategory } from "../../model/domain/classes/BookSubcategory";
import { Configuration } from "../Configuration";

class BookSubcategoryAPI {
    url: string = `${Configuration.apiUrl}/book-sub-categories`;

    getAll(): Promise<Array<BookSubcategory>> {
        return Axios.get(`${this.url}`);
    }

    getAllbyParentId(id: number): Promise<Array<BookSubcategory>> {
        return Axios.get(`${this.url}`, {params: {
            [`parentCategoryId.equals`]: id
        }});
    }

    get(id: number): Promise<BookSubcategory> {
        return Axios.get(`${this.url}/${id}`);
    }

    create(resource: BookSubcategory) : Promise<BookSubcategory> {
        return Axios.post(`${this.url}`, resource);
    }

    update(resource: BookSubcategory) : Promise<BookSubcategory> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number) : Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }
}

export default BookSubcategoryAPI;