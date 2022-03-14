import Axios from "axios";
import { BookCategory } from "../../model/domain/classes/BookCategory";
import { Configuration } from "../Configuration";

class BookCategoryAPI {
    url: string = `${Configuration.apiUrl}/book-categories`;

    getAll(): Promise<Array<BookCategory>> {
        return Axios.get(`${this.url}`);
    }

    get(id: number): Promise<BookCategory> {
        return Axios.get(`${this.url}/${id}`);
    }

    create(resource: BookCategory) : Promise<BookCategory> {
        return Axios.post(`${this.url}`, resource);
    }

    update(resource: BookCategory) : Promise<BookCategory> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number) : Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }
}

export default BookCategoryAPI;