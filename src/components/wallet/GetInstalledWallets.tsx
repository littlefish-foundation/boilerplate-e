import { getWalletIcon } from '@cardano-foundation/cardano-connect-with-wallet-core';

function getInstalledWallets() {
    const wallets = [
        'nami',
        'eternl',
        'yoroi',
        "flint",
        'typhon',
        'gerowallet',
        'nufi',
        'lace'
    ];
    const walletsIcons = wallets.map(wallet => ({
        name: wallet,
        icon: getWalletIcon(wallet.toUpperCase())
    }))

    if (typeof window.cardano !== 'undefined') {
        const installedWallets = Object.keys(window.cardano);
        const matchedWallets = walletsIcons.filter(wallet => installedWallets.includes(wallet.name));
        return matchedWallets;
    } else {
        return [];
    }
}

export default getInstalledWallets;