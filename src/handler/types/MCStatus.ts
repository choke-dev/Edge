import { UUID } from "crypto";

type TextColors = "black" | "dark_blue" | "dark_green" | "dark_aqua" | "dark_red" | "dark_purple" | "gold" | "gray" | "dark_gray" | "blue" | "green" | "aqua" | "red" | "light_purple" | "yellow" | "white" | `#${string}`
interface TextComponent {
  text: string;
  color?: TextColors;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  obfuscated?: boolean;
}

interface JavaResponse {
  version: { 
    protocol: number,
    name: string 
  };
  players: { 
    max: number,
    online: number,
    /**
    * Omitted if there are no players on the server, or `hide-online-players` is set to `true` in `server.properties`
    */
    sample?: [] | {
      id: UUID,
      name: string
    }[]
  };
  /**
   * The server's MOTD, If the server does not have a MOTD, this field is omitted.
   */
  description?: string | TextComponent | { 
    text: string,
    extra: TextComponent[] 
  };
  favicon: `data:image/png;base64,${string}`;
  /**
    * Omitted if `enforce-secure-profile` is set to `false` in `server.properties`
    */
  enforcesSecureChat?: boolean;
  /**
    * Only exists in 1.19 - 1.19.2 servers.
    */
  previewsChat?: boolean;
  /**
    * An additional field added when the server has "No Chat Reports" installed and has not disabled
    */
  preventsChatReports?: boolean;
  /**
   * Present when the server being pinged is a Forge server.
   */
  forgeData?: {
    channels: {
      res: string;
      version: number;
      required: boolean;
    }[];
    mods: {
      modId: string;
      modMarker: string;
    }[];
    truncated: boolean;
    fmlNetworkVersion: number;
    d: unknown;
  };
}

export interface ServerStatus {
  status?: JavaResponse;
  /**
   * Stringified property of `status`, useful if `status` fails to parse, or if `disableJSONParse` is set to true
   */
  statusRaw: string;
  /**
   * The time it takes to receive back a response after sending a small payload to a server, in milliseconds. Will be null if the `ping` option is false.
   */
  latency: number | null;
}