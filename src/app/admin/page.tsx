import { redirect } from 'next/navigation';

export default function AdminIndexPage() {
  redirect('/secret-admin-gate');
}
