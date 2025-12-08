import { injectable } from "inversify";
import { StaticConfig } from "../static-config";

@injectable("Singleton")
export class ConfigService {
  private _options: Record<string, any> = {};

  private _optionsContainer?: Record<string, any> | null = null;
  private readonly _optionsPersistenceKey = "WPOptions";

  public getOption<T>(key: string): T | undefined {
    return this._options[key] as T;
  }

  public setOption<T>(key: string, value: T): void {
    this._options[key] = value;
    if (this._optionsContainer) {
      this._optionsContainer[this._optionsPersistenceKey] = JSON.stringify(
        this._options,
      );
    }
  }

  public setOptions(options: Record<string, any>): void {
    this._options = { ...this._options, ...options };
    if (this._optionsContainer) {
      this._optionsContainer[this._optionsPersistenceKey] = JSON.stringify(
        this._options,
      );
    }
  }

  public clearOptions(): void {
    this._options = {};
  }

  public enableOptionsPersistence(container: Record<string, any>): void {
    if (container[this._optionsPersistenceKey]) {
      this._options = JSON.parse(container[this._optionsPersistenceKey]);
    } else {
      container[this._optionsPersistenceKey] = JSON.stringify(this._options);
    }
    this._optionsContainer = container;
    StaticConfig.setOptionsPersistence(true);
  }

  public disableOptionsPersistence(): void {
    if (this._optionsContainer) {
      delete this._optionsContainer[this._optionsPersistenceKey];
    }
    this._optionsContainer = null;
    StaticConfig.setOptionsPersistence(false);
  }
}
