import { createContext, ReactNode, useContext } from "react";
import { Container, Newable } from "inversify";

type ProviderProps = {
  services: Container;
  children: ReactNode;
};

export const ServicesContext = createContext<Container | null>(null);

export function ServiceProvider({ services, children }: ProviderProps) {
  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useService<T>(serviceId: Newable<T> | string): T {
  const service = useContext(ServicesContext)?.get(serviceId);
  if (service) return service as T;
  else throw new Error(`Failed to load service with identifier: ${serviceId}`);
}

export function useServiceProvider(): Container {
  const container = useContext(ServicesContext);
  if (!container) throw Error("Failed to load DI container!");
  return container;
}

export function bindService<T>(
  serviceId: Newable<T> | string,
  bindable?: Newable<T>,
): void {
  const container = useContext(ServicesContext);
  if (!container) throw Error("Failed to load DI container!");
  if (container.isBound(serviceId)) container.unbindSync(serviceId);

  if (bindable) container.bind(serviceId).to(bindable).inSingletonScope();
  else container.bind(serviceId).toSelf().inSingletonScope();
}
