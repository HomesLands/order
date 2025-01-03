import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'

import { DataTable } from '@/components/ui'
import { useBranch } from '@/hooks'
import { useBranchesColumns } from './DataTable/columns'
import { BranchActionOptions } from './DataTable/actions'

export default function BranchManagementPage() {
    const { t } = useTranslation(['branch'])
    const { data, isLoading } = useBranch()

    return (
        <div className={`transition-all duration-300 ease-in-out`}>
            <div className="sticky top-0 z-10 flex flex-col items-center gap-2 pb-4">
                <span className="flex items-center justify-start w-full gap-1 text-lg">
                    <SquareMenu />
                    {t('branch.title')}
                </span>
                <div className="grid w-full h-full grid-cols-1">
                    <DataTable
                        columns={useBranchesColumns()}
                        data={data?.result || []}
                        isLoading={isLoading}
                        pages={1}
                        onPageChange={() => { }}
                        onPageSizeChange={() => { }}
                        actionOptions={BranchActionOptions}
                    // filterOptions={IsTemplateFilter}
                    />
                </div>
            </div>
        </div>
    )
}
