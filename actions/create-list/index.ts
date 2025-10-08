"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { listService } from "@/lib/db-service";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateList } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, boardId } = data;
  let list;
  try {
    // Use optimized service
    list = await listService.createList({ title, boardId, orgId });

    // Create audit log asynchronously (don't wait for it)
    createAuditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.CREATE,
    }).catch(console.error); // Log error but don't fail the request

  } catch (error) {
    console.error("Failed to create list:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to Create!",
    };
  }

  revalidatePath(`/board/${boardId}`);
  
  // Emit real-time update (this will be handled by the client)
  return {
    data: list,
  };
};

export const createList = createSafeAction(CreateList, handler);
