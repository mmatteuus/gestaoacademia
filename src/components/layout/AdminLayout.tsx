import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';
import { SidebarProvider } from '@/components/ui/sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
          <AppTopbar />
          <main className="flex-1 overflow-auto animate-fade-in p-4 pb-24 md:p-6 md:pb-24 lg:p-8 lg:pb-24">
            {children}
          </main>
          <AppFooter />
        </div>
      </div>
    </SidebarProvider>
  );
}
