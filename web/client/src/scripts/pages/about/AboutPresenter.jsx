import { AboutModel } from './AboutModel';

export class AboutPresenter {
    constructor() {
        this.model = new AboutModel({});
    }

    getInfo() {
        return {
            description: this.model.description,
            contact: this.model.contact,
        };
    }
}