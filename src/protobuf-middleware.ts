import { IMessageType } from "@protobuf-ts/runtime";
import { Context, Next } from "hono";

export const protobufMiddleware = <T extends object>(
  messageType: IMessageType<T>,
) => {
  return async (c: Context, next: Next) => {
    const contentType = c.req.header("content-type");
    if (contentType === "application/protobuf") {
      const arrayBuffer = await c.req.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const message = messageType.fromBinary(uint8Array);
      c.set("protobuf", message);
    }
    await next();
  };
};

export const formatResponse = <T extends object>(
  c: Context,
  data: T,
  messageType: IMessageType<T>,
) => {
  const acceptHeader = c.req.header("accept");
  if (acceptHeader === "application/protobuf") {
    const binary = messageType.toBinary(data);
    return c.body(binary, 200, { "Content-Type": "application/protobuf" });
  } else {
    return c.json(data);
  }
};

export const getRequestData = async <T extends object>(
  c: Context,
  messageType: IMessageType<T>,
): Promise<T> => {
  if (c.get("protobuf")) {
    return c.get("protobuf") as T;
  } else {
    const json = await c.req.json();
    return messageType.create(json);
  }
};
