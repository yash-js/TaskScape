import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextPage } from 'next'
import { redirect } from 'next/navigation'
import ListContainer from './_components/list-container'

interface Props {
  params: {
    boardId: string
  }
}

const BoardIdPage: NextPage<Props> = async ({ params }) => {
  const {
    orgId
  } = auth()

  if (!orgId) return redirect('/select-org')

  const lists = await db.list.findMany({
    where: {
      boardId: params.boardId,
      board: {
        orgId
      }
    },
    include: {
      cards: {
        orderBy: {
          order: 'asc' // This order represents current position of card
        }
      }
    },
    orderBy: {
      order: 'asc'
    }
  })

  return <div className='p-4 h-full overflow-x-auto'>

    <ListContainer
      boardId={params.boardId}
      data={lists}
    />
  </div>
}

export default BoardIdPage