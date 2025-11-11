export class MapSerializationFixes {
  public static replacer(key: any, value: any): any {
    if (value instanceof Map) {
      return {
        dataType: "Map",
        value: [...value],
      };
    }
    return value;
  }

  public static reviver(key: any, value: any): any {
    if (typeof value === "object" && value !== null) {
      if (value.dataType === "Map") {
        return new Map(value.value);
      }
    }
    return value;
  }
}
