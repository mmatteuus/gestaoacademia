import { ReactNode } from 'react';
import { AppTopbar } from './AppTopbar';
import { BottomNav } from './BottomNav';
import { SheetsPrefetcher } from './SheetsPrefetcher';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <SheetsPrefetcher />
      <AppTopbar />
      {/* pb deixa espaço para o BottomNav (~64px) + AppFooter (~28px) + safe-area sem sobrepor conteúdo */}
      <main className="flex-1 overflow-x-hidden animate-fade-in p-4 pb-[calc(80px+env(safe-area-inset-bottom))] md:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
