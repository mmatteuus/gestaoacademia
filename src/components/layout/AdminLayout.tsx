import { ReactNode } from 'react';
import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';
import { BottomNav } from './BottomNav';
import { SheetsPrefetcher } from './SheetsPrefetcher';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SheetsPrefetcher />
      <AppTopbar />
      {/* pb deixa espaço para o BottomNav (~64px) + AppFooter (~44px) sem sobrepor conteúdo */}
      <main className="flex-1 overflow-x-hidden animate-fade-in p-4 pb-[110px] md:p-6 md:pb-[110px] lg:p-8 lg:pb-[110px]">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
      <BottomNav />
      <AppFooter />
    </div>
  );
}
