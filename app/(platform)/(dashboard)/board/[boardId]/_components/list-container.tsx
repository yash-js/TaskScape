"use client"
import { ListWithCards } from "@/types";
import ListForm from "./list-form";
import { useEffect, useState } from "react";
import ListItem from "./list-item";
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";
interface ListContainerProps {
    data: ListWithCards[];
    boardId: string;
}
function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    if (removed) {
        result.splice(endIndex, 0, removed);
    }

    return result;
};


function ListContainer({ data, boardId }: ListContainerProps) {
    const [orderedData, setOrderedData] = useState(data)

    const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
        onSuccess: () => {
            toast.success("List reordered");
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
        onSuccess: () => {
            toast.success("Card reordered");
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onDragEnd = (result: any) => {
        const { destination, source, type } = result;

        if (!destination) {
            return;
        }

        // if dropped in the same position
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // User moves a list
        if (type === "list") {
            const items = reorder(
                orderedData,
                source.index,
                destination.index,
            ).map((item, index) => ({ ...item, order: index }));

            setOrderedData(items);
            executeUpdateListOrder({ items, boardId });
        }
        // User Moves Card
        if (type == 'card') {
            let newOrderedData = [...orderedData]
            //Source and Destination List
            const sourceList = newOrderedData.find(list => list.id == source?.droppableId)

            const destList = newOrderedData.find(list => list.id == destination.droppableId)

            if (!sourceList || !destList) {
                return
            }

            // Check if card exists on sourcelist
            if (!sourceList?.cards) {
                sourceList.cards = []
            }

            // Check if card exists on destList
            if (!destList.cards) {
                destList.cards = []
            }

            // Moving Card to same list

            if (source?.droppableId == destination?.droppableId) {
                const reorderedCards = reorder(sourceList.cards, source.index, destination.index)

                reorderedCards.forEach((card, idx) => card.order = idx
                )

                sourceList.cards = reorderedCards
                setOrderedData(newOrderedData)

                // Server Action
                executeUpdateCardOrder({
                    boardId, items: reorderedCards
                })

            }

            // Moving Card to Another list
            else {
                // Remove card from source
                const [movedCard] = sourceList.cards.splice(source.index, 1)
                if (movedCard) {
                    // Assign the new list id to moved card
                    movedCard.listId = destination.droppableId

                    // Add Card to Destination List
                    destList.cards.splice(destination.index, 0, movedCard)
                }

                sourceList.cards.forEach((card, idx) => card.order = idx)
            }

            // Update the order for each card in destination list
            destList.cards.forEach((card, idx) => card.order = idx)

            setOrderedData(newOrderedData)
            executeUpdateCardOrder({
                boardId, items: destList.cards
            })

        }


    }

    useEffect(() => {
        setOrderedData(data)
    }, [data])

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="list" type="list" direction="horizontal">
                {(provided) => (
                    <ol
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex gap-x-3 h-full"
                    >
                        {orderedData?.map((list, index) => {
                            return <ListItem
                                key={list?.id}
                                index={index}
                                data={list}
                            />
                        })}
                        {provided.placeholder}
                        <ListForm />
                        <div
                            className="flex-shrink-0 w-1"
                        />
                    </ol>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default ListContainer;