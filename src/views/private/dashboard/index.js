import React from 'react';
import { PageLayout, PageTitle } from '@/components';

export default function Dashboard () {
  return (
    <PageLayout>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <PageTitle>Dashboard</PageTitle>
      </div>
    </PageLayout>
  );
}
