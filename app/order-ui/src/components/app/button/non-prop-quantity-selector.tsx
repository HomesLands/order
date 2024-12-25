import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui';

interface NonPropQuantitySelectorProps {
    onChange?: (quantity: number) => void;
}

export default function NonPropQuantitySelector({ onChange }: NonPropQuantitySelectorProps) {
    const [quantity, setQuantity] = useState(1);

    const handleIncrement = () => {
        setQuantity((prev) => {
            const newQuantity = prev + 1;
            onChange?.(newQuantity);
            return newQuantity;
        });
    };

    const handleDecrement = () => {
        setQuantity((prev) => {
            const newQuantity = Math.max(prev - 1, 1);
            onChange?.(newQuantity);
            return newQuantity;
        });
    };

    return (
        <div className="flex items-center gap-1.5">
            <Button
                variant="ghost"
                size="icon"
                onClick={handleDecrement}
                className="p-1 border rounded-full h-fit w-fit hover:bg-gray-100"
            >
                <Minus size={12} />
            </Button>
            <span className="w-4 text-xs text-center">{quantity}</span>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleIncrement}
                className="p-1 border rounded-full h-fit w-fit hover:bg-gray-100"
            >
                <Plus size={12} />
            </Button>
        </div>
    );
}
