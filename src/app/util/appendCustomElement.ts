/**
 * Append `customElement.element` as a child of `destination`
 * @param destination Destination HTMLElement
 * @param customElement Custom pouch element
 */
const appendCustomElement = (destination: HTMLElement, customElement: any): void => {
   destination.appendChild(customElement.element); 
}

export default appendCustomElement;