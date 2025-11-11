import { container, injectable, singleton } from "tsyringe";

const selectorMetaSymbol = Symbol("selector");
const templateMetaSymbol = Symbol("template");

export async function loadComponent<T extends ComponentBase>(
  anchor: HTMLElement,
  type: { new (...args: any[]): T },
  model?: any,
  clean: boolean = false,
): Promise<T> {
  if (anchor === null)
    throw new Error(`Uninitialized anchor element for: ${type.name}`);

  const component = container.resolve(type);
  await component.initialize(anchor, model);
  component.loadInto(anchor, clean);

  return component;
}

export abstract class ComponentBase {
  protected _element: HTMLElement;
  protected _template: string;

  protected constructor(childType: { new (...args: any[]): ComponentBase }) {
    const root = document.createElement("div");

    this._template = Reflect.getMetadata(templateMetaSymbol, childType);
    this.selector = Reflect.getMetadata(selectorMetaSymbol, childType);

    this._element = root;
    root.innerHTML = this._template;
  }

  public accessor selector: string;

  public abstract initialize(anchor?: HTMLElement, model?: any): Promise<void>;

  public loadInto(anchor: HTMLElement, clean: boolean = false): void {
    if (clean) anchor.innerHTML = "";
    anchor.append(...this._element.childNodes);
  }

  public async loadComponent<T extends ComponentBase>(
    type: { new (...args: any[]): T },
    model?: any,
    clean: boolean = false,
  ): Promise<T> {
    const selector = Reflect.getMetadata(selectorMetaSymbol, type) as string;
    const element = this.getElement(selector);
    return await loadComponent(element, type, model, clean);
  }

  protected getElement<T extends HTMLElement>(selector: string) {
    const element = this._element.querySelector<T>(selector);
    if (element === null)
      throw new Error(`Element wasn't found with the selector ${selector}`);
    return element as T;
  }

  protected modelIsDefined<T>(model?: T) {
    if (model === undefined) throw new Error(`Component model is undefined.`);
    return model as T;
  }
}

export function component<T extends ComponentBase>(
  selector: string,
  template: string,
  scoped: boolean = false,
) {
  return function (target: { new (...args: any[]): T }) {
    Reflect.defineMetadata(selectorMetaSymbol, selector, target);
    Reflect.defineMetadata(templateMetaSymbol, template, target);

    if (scoped) injectable()(target);
    else singleton()(target);
  };
}
