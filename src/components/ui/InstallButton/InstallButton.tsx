import { useEffect, useState } from 'react';
import { DownloadCloud } from 'lucide-react';

type BeforeInstallPromptChoice = {
  outcome: 'accepted' | 'dismissed';
  platform: string;
};

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<BeforeInstallPromptChoice>;
}

export interface InstallButtonProps {
  className?: string;
}

const isStandalone = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    navigatorWithStandalone.standalone === true
  );
};

export const InstallButton: React.FC<InstallButtonProps> = ({
  className = ''
}) => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(isStandalone);
  const [isPrompting, setIsPrompting] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();

      if (!isStandalone()) {
        setDeferredPrompt(event as BeforeInstallPromptEvent);
      }
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
      setIsPrompting(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt || isPrompting) {
      return;
    }

    try {
      setIsPrompting(true);
      await deferredPrompt.prompt();

      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
    } finally {
      setDeferredPrompt(null);
      setIsPrompting(false);
    }
  };

  if (isInstalled || !deferredPrompt) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleInstall}
      disabled={isPrompting}
      aria-label="Install portfolio manager app"
      className={`group w-full inline-flex items-center justify-center gap-2 rounded-lg border border-primary/25 bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary transition-all duration-150 hover:border-primary/40 hover:bg-primary/15 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      <DownloadCloud
        size={17}
        aria-hidden="true"
        className="transition-transform duration-150 group-hover:-translate-y-0.5"
      />
      <span>{isPrompting ? 'Installing...' : 'Install App'}</span>
    </button>
  );
};

export default InstallButton;
