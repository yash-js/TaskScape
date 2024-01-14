
import { Info } from '../_components/info'
import { Separator } from '@/components/ui/separator'
import { ActivityList } from './_components/activity-list'
import { Suspense } from 'react'
import { checkSubscription } from '@/lib/subscription'

const ActivtyPage = async () => {
    const isPro = await checkSubscription()

    return <div className='w-full'>
        <Info
            isPro={isPro}
        />
        <Separator />
        <Suspense fallback={<ActivityList.Skeleton />}>
            <ActivityList />
        </Suspense>
    </div>
}

export default ActivtyPage