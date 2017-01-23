/**
 * Created by FIXCFNJ on 23.01.2017.
 */

import fs = require('fs');
import path = require('path');
import { BehaviorSubject,Subject } from '@reactivex/rxjs';
import { Service, Resource } from "./viwiPlugin";


export class SchemaPlugin implements Service {


    name:string;
    private _resources:Array<Resource> = [];
    protected _id:string = "";

    elements: Array<any> = [];
    elementKeyMap: any = {};
    model: any = {};
    schema: any = {};
    data: any = {};


    constructor() {
        this.readData();
        this.readSchema();
    }

    public get resources() {
        return this._resources;
    }

    public get id() {
        return this._id;
    }

    readData() {
        const dataPath: string = path.join(__dirname, this.constructor.name.toLowerCase(), 'data.json');
        var d: string = <string>fs.readFileSync(dataPath);
        this.data = JSON.parse(d);
    }

    readSchema() {
        const schemaPath: string = path.join(__dirname, this.constructor.name.toLowerCase(), 'schema.json');

        var d: string = <string>fs.readFileSync(schemaPath);
        let content = JSON.parse(d);

        for (var resourceDef in content.resources) {
            let data:any = this.data[resourceDef] || [];
            let resource:SchemaResource = new SchemaResource(this, resourceDef,data);
            this._resources.push(resource);
        }
    }

}




class SchemaResource implements Resource {
    private _name:string;
    private _elements:BehaviorSubject<{}>[] = [];
    private _change:Subject<string> = new Subject();

    constructor(private service:Service, public name:string, rawElements:Array<any>) {
        this._elements = rawElements.map(x=>new BehaviorSubject<any>(x));
        this._change.next("add");
    }

    get elementSubscribable():Boolean {
        return true;
    };

    get change():Subject<string> {
        return this._change;
    }

    getElement(elementId:string):BehaviorSubject<{}> {
        // find the element requested by the client
        return this._elements.find((element:BehaviorSubject<{}>) => {
            return (<{id:string}>element.getValue()).id === elementId;
        });
    };

    getResource(offset?:string|number, limit?:string|number):BehaviorSubject<{}>[]{
        // retriev all element
        let resp:BehaviorSubject<{}>[];

        if((typeof offset === "number" && typeof limit === "number") || (typeof limit === "number" && !offset) || (typeof offset === "number" && !limit) || (!offset && !limit)) {
            resp = this._elements.slice(<number>offset, <number>limit);
        }

        return resp;
    };

    updateElement(elementId:string, difference:any):Boolean {
        let element = this.getElement(elementId);
        let clone = Object.assign({}, element);
        let update = Object.assign(clone, difference);
        element.next(update); //@TODO: check diffs bevor updating without a need
        return true;
    }
}
