import { OrganizationList } from "@clerk/nextjs";

function CreateOrganizationPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-4xl">
                <OrganizationList
                    hidePersonal
                    afterSelectOrganizationUrl={'/organization/:id'}
                    afterCreateOrganizationUrl={'/organization/:id'}
                />
            </div>
        </div>
    );
}

export default CreateOrganizationPage;



