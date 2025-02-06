import * as React from 'react'
import moment from 'moment'
import { CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import {
    Button,
    Calendar,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui'

interface ISimpleDatePickerProps {
    defaultValue?: string
    onChange: (date: string) => void
}

export default function SimpleDatePicker({
    defaultValue,
    onChange,
}: ISimpleDatePickerProps) {
    const { t } = useTranslation('menu')
    const [date, setDate] = React.useState<string>('')

    React.useEffect(() => {
        if (defaultValue) {
            const dateOnly = defaultValue.split('T')[0]
            setDate(dateOnly)
        }
    }, [defaultValue])

    const handleDateChange = (selectedDate?: Date) => {
        if (selectedDate) {
            const formattedDate = moment(selectedDate, 'DD/MM/YYYY').format(
                'DD/MM/YYYY',
            )
            setDate(formattedDate)
            onChange(formattedDate)
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground',
                    )}
                >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {date ? date : <span>{t('menu.chooseDate')}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date ? new Date(date) : undefined}
                    onSelect={handleDateChange}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
