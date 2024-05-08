import { Swap } from "../types";
import { SorobanEvent } from "@subql/types-stellar";

export async function handleEvent(event: SorobanEvent): Promise<void> {
  logger.warn(event.transaction.hash.toString());
  if (event.type.toString() == "contract") {
    logger.warn(JSON.stringify(event.value));
    const swap = Swap.create({
      id: event.transaction.hash,
      to: "coderipper",
    });
    await swap.save();
  }
}
