'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { PasscodeGateModal } from '@/components/admin/PasscodeGateModal';
import { AdminDashboardContent } from '@/components/admin/AdminDashboardContent';

export default function AdminDashboardPage() {
  const { isAdminLoggedIn } = useStore();

  if (!isAdminLoggedIn) {
    return <PasscodeGateModal onSuccess={() => {}} />;
  }

  return <AdminDashboardContent />;
}
