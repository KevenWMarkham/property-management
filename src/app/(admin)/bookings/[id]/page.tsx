'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Booking } from '@/types/booking';
import { formatCurrency } from '@/lib/utils';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await fetch(`/api/admin/bookings/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setBooking(data);
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchBooking();
    }
  }, [params.id]);

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/bookings/${params.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/bookings');
      } else {
        alert('Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <div className="px-4 sm:px-6 lg:px-8">Loading...</div>;
  }

  if (!booking) {
    return <div className="px-4 sm:px-6 lg:px-8">Booking not found</div>;
  }

  // Calculate nights
  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'checked-in':
        return 'bg-blue-100 text-blue-800';
      case 'checked-out':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Booking #{booking.id}</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage booking details
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
          <Link
            href={`/bookings/${booking.id}/edit`}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="mt-8 bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">
            Booking Information
          </h3>

          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Property ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{booking.propertyId}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Guest ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{booking.guestId}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Check-In Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {checkIn.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Check-Out Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {checkOut.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Number of Nights</dt>
              <dd className="mt-1 text-sm text-gray-900">{nights}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Nightly Rate</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatCurrency(booking.nightlyRate)}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Cleaning Fee</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatCurrency(booking.cleaningFee || 0)}</dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
              <dd className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(booking.totalAmount)}</dd>
            </div>

            {booking.specialRequests && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Special Requests</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{booking.specialRequests}</dd>
              </div>
            )}

            <div className="sm:col-span-2 border-t border-gray-200 pt-4">
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(booking.createdAt).toLocaleString()}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(booking.updatedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/bookings"
          className="text-sm font-semibold text-blue-600 hover:text-blue-500"
        >
          ← Back to Bookings
        </Link>
      </div>
    </div>
  );
}
