type IpResponse = {
  ip: string;
};

export async function fetchCurrentIp(): Promise<string> {
  const res = await fetch("https://ipinfo.io/json");
  return ((await res.json()) as IpResponse).ip;
}
