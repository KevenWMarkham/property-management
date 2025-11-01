'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Tenant } from '@/types/tenant';

export default function TenantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchTenant() {
      try {
        const res = await fetch(`/api/admin/tenants/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setTenant(data);
        } else {
          console.error('Failed to fetch tenant');
        }
      } catch (error) {
        console.error('Error fetching tenant:', error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchTenant();
    }
  }, [params.id]);

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this tenant?')) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/tenants/${params.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/tenants');
      } else {
        alert('Failed to delete tenant');
      }
    } catch (error) {
      console.error('Error deleting tenant:', error);
      alert('Failed to delete tenant');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <div className="px-4 sm:px-6 lg:px-8">Loading...</div>;
  }

  if (!tenant) {
    return <div className="px-4 sm:px-6 lg:px-8">Tenant not found</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {tenant.firstName} {tenant.lastName}
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <Link
            href={`/tenants/${tenant.id}/edit`}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Email</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <a href={`mailto:${tenant.email}`} className="text-blue-600 hover:text-blue-900">
                {tenant.email}
              </a>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Phone</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <a href={`tel:${tenant.phone}`} className="text-blue-600 hover:text-blue-900">
                {tenant.phone}
              </a>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Emergency Contact</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {tenant.emergencyContact ? (
                <div>
                  <div className="font-medium">{tenant.emergencyContact}</div>
                  {tenant.emergencyPhone && (
                    <a href={`tel:${tenant.emergencyPhone}`} className="text-blue-600 hover:text-blue-900">
                      {tenant.emergencyPhone}
                    </a>
                  )}
                </div>
              ) : (
                <span className="text-gray-400">Not provided</span>
              )}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Created</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {new Date(tenant.createdAt).toLocaleDateString()}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Last Updated</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {new Date(tenant.updatedAt).toLocaleDateString()}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
