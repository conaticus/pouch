import { ElementProperties, ElementProperty, ElementPropertyType, ElementPropertyTypes, ElementSave, ElementType } from "../../types";
import CustomElement from "../CustomElement";
import TextboxElement from "./Text/TextboxElement";

export default abstract class Element extends CustomElement {
    public properties: ElementProperties;

    constructor(type: string = "div", public propertyTypes: ElementPropertyTypes) {
        super(type);
        this.properties = {};
        this.propertyTypes.identifier = { type: ElementPropertyType.TEXT_SHORT, category: { label: "Element Settings", priority: 1 } };

        this.initialiseProperties();

        this.properties.identifier.handleInspectorChange = (value: string) => this.properties.identifier.value = value;
    }

    static generateFromSave(elementSave: ElementSave): Element {
        let element: Element;
        switch (elementSave.type) {
            case ElementType.TextBox:
                element = new TextboxElement();
                break;
            default:
                throw new Error(`Could not find element with given type '${elementSave.type}'.`);
        }

        for (const propertyKey in elementSave.properties) {
            const property = elementSave.properties[propertyKey];
            element.properties[propertyKey].value = property;
        }

        element.propertyTypes = elementSave.propertyTypes;

        return element;
    }

    public disableProperty(propertyKey: string): void {
        this.properties[propertyKey].disabled = true;
        const disableEvent = new CustomEvent("property-disabled", { detail: { propertyKey } })
        this.htmlElement.dispatchEvent(disableEvent);
    }

    public enableProperty(propertyKey: string): void {
        this.properties[propertyKey].disabled = false;
        const disableEvent = new CustomEvent("property-enabled", { detail: { propertyKey } })
        this.htmlElement.dispatchEvent(disableEvent);
    }

    private initialiseProperties(): void {
        for (const propertyKey in this.propertyTypes) {
            const propertyType = this.propertyTypes[propertyKey];

            const property: ElementProperty<any> = {
                disabled: false,
                category: propertyType.category,
            }

            if (propertyType.type === ElementPropertyType.CHOICE) {
                if (!propertyType.choiceEnum)
                    throw new Error("Choice property has no choice enum.");

                property.value = { choiceEnum: propertyType.choiceEnum };
            }

            this.properties[propertyKey] = property;
        }
    }

    public abstract loadProperties(): void;
}