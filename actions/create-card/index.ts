"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { cardService } from "@/lib/db-service";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateCard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, boardId, listId } = data;
  let card;
  try {
    // Use optimized service
    card = await cardService.createCard({ title, listId, boardId, orgId });

    // Create audit log asynchronously (don't wait for it)
    createAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.CREATE,
    }).catch(console.error); // Log error but don't fail the request
    
  } catch (error) {
    console.error("Failed to create card:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to Create!",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: card,
  };
};

export const createCard = createSafeAction(CreateCard, handler);
