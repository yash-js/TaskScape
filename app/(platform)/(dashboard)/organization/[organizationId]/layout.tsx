import { auth } from "@clerk/nextjs/server";
import { OrgControl } from "./_components/org-control";
import { startCase } from "lodash";

import Progress from "@/components/progress-bar";

export async function generateMetadata() {
    const { orgSlug } = await auth()

    return {
        title: startCase(orgSlug || 'Organization'),
    }
}

function OrganizationIdLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <>
            <Progress />
            <OrgControl />
            {children}
        </>

    );
}

export default OrganizationIdLayout;