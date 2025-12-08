import { PrettyList, PrettyListItem, PrimaryCard } from "../common";

export function InfoSection() {
  return (
    <PrimaryCard>
      <div className="my-4 mr-auto mb-4 ml-8 text-4xl font-bold text-gray-800">
        Select your <span className="text-purple-900 italic">Waifu</span> with
        style!
      </div>
      <div className="grid w-full grid-cols-1 items-center gap-12 text-lg text-gray-700 md:grid-cols-2">
        <div>
          There may be many choices, but only one{" "}
          <span className="font-bold italic">true Waifu</span>! This app may
          help you pick your ideal Waifu using{" "}
          <span className="font-bold italic">several features</span>. Since this
          is a port from plain Typescript some of them may not be available
          yet...
        </div>
        <PrettyList>
          <PrettyListItem>
            <span className="font-bold">Character catalogue</span> - browse
            through all of the available characters, maybe some will catch your
            eye!
            <div className="font-semibold">[Status: Pending...]</div>
          </PrettyListItem>
          <PrettyListItem>
            <span className="font-bold">Top Waifu polling</span> - synchronized
            voting for your favorite Waifus, now with sockets... maybe.
            <div className="font-semibold">[Status: Pending...]</div>
          </PrettyListItem>
        </PrettyList>
      </div>
    </PrimaryCard>
  );
}
