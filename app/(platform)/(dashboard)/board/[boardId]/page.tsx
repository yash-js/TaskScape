import { boardService } from '@/lib/db-service'
import { auth } from '@clerk/nextjs/server'
import { NextPage } from 'next'
import { redirect } from 'next/navigation'
import ListContainer from './_components/list-container'
import { BoardLoadingSkeleton } from '@/components/loading'
import { Suspense } from 'react'
import { RealtimeDnD } from '@/components/realtime-dnd'

interface Props {
  params: {
    boardId: string
  }
}

const BoardIdPage: NextPage<Props> = async ({ params }) => {
  const {
    orgId
  } = await auth()

  if (!orgId) return redirect('/select-org')

  // Use optimized service with caching
  const lists = await boardService.getBoardWithLists(params.boardId, orgId)

  return (
    <div className='p-4 h-full overflow-x-auto'>
      <RealtimeDnD boardId={params.boardId}>
        <Suspense fallback={<BoardLoadingSkeleton />}>
          <ListContainer
            boardId={params.boardId}
            data={lists}
          />
        </Suspense>
      </RealtimeDnD>
    </div>
  )
}

export default BoardIdPage