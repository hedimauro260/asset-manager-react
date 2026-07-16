import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../ui/button';

export interface WalletsHeaderProps {
    onAddWallet?: () => void;
}

export const WalletsHeader: React.FC<WalletsHeaderProps> = ({
    onAddWallet
}) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-2xl font-bold text-text-primary">
                    Wallets
                </h1>
                <p className="text-sm text-text-secondary mt-1">
                    Manage all your wallets and track their performance
                </p>
            </div>

            <Button
                variant="primary"
                icon={Plus}
                onClick={onAddWallet}
            >
                Add Wallet
            </Button>
        </div>
    );
};