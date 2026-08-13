import { redirect } from 'next/navigation';

export default function ShortAdminRoutePage() {
  redirect('/secret-admin-gate');
}
