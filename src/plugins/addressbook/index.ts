
import { Service, Resource } from "../viwiPlugin";
import { SchemaPlugin } from '../schemaPlugin';

/**
 * Created by FIXCFNJ on 23.01.2017.
 */



class Addressbook extends SchemaPlugin {

    constructor() {
        super();
        this._id = "f9a1073f-e90c-4c56-8368-f4c6bd1d8c97"; //random id
    }

    get name() {
        return this.constructor.name;
    }

    get id() {
        return this._id;
    }

}


export = Addressbook;