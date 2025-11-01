'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Property } from '@/types/property';
import type { Guest } from '@/types/guest';

export default function NewBookingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [formData, setFormData] = useState({
    propertyId: '',
    guestId: '',
    checkInDate: '',
    checkOutDate: '',
    status: 'pending',
    nightlyRate: '',
    cleaningFee: '',
    specialRequests: '',
  });

  useEffect(() => {
    // Fetch properties and guests
    async function fetchData() {
      try {
        const [propsRes, guestsRes] = await Promise.all([
          fetch('/api/admin/properties'),
          fetch('/api/admin/guests'),
        ]);

        if (propsRes.ok) {
          const propsData = await propsRes.json();
          setProperties(propsData.properties || []);
        }

        if (guestsRes.ok) {
          const guestsData = await guestsRes.json();
          setGuests(guestsData.guests || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  // Calculate total amount when dates or rates change
  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate && formData.nightlyRate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

      if (nights > 0) {
        const nightlyTotal = nights * parseFloat(formData.nightlyRate);
        const cleaning = formData.cleaningFee ? parseFloat(formData.cleaningFee) : 0;
        const total = nightlyTotal + cleaning;
        // Total is calculated but not stored in state, we'll send it in the submission
      }
    }
  }, [formData.checkInDate, formData.checkOutDate, formData.nightlyRate, formData.cleaningFee]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate total amount
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      const nightlyTotal = nights * parseFloat(formData.nightlyRate);
      const cleaning = formData.cleaningFee ? parseFloat(formData.cleaningFee) : 0;
      const totalAmount = nightlyTotal + cleaning;

      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: parseInt(formData.propertyId),
          guestId: parseInt(formData.guestId),
          checkInDate: new Date(formData.checkInDate),
          checkOutDate: new Date(formData.checkOutDate),
          status: formData.status,
          nightlyRate: Math.round(parseFloat(formData.nightlyRate) * 100), // Convert to cents
          cleaningFee: formData.cleaningFee ? Math.round(parseFloat(formData.cleaningFee) * 100) : 0,
          totalAmount: Math.round(totalAmount * 100), // Convert to cents
          specialRequests: formData.specialRequests || null,
        }),
      });

      if (res.ok) {
        router.push('/bookings');
      } else {
        const errorData = await res.json();
        alert(`Failed to create booking: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking');
    } finally {
      setLoading(false);
    }
  }

  // Calculate nights and total for display
  const calculateTotal = () => {
    if (!formData.checkInDate || !formData.checkOutDate || !formData.nightlyRate) {
      return null;
    }

    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    if (nights <= 0) return null;

    const nightlyTotal = nights * parseFloat(formData.nightlyRate);
    const cleaning = formData.cleaningFee ? parseFloat(formData.cleaningFee) : 0;
    const total = nightlyTotal + cleaning;

    return { nights, nightlyTotal, cleaning, total };
  };

  const totalInfo = calculateTotal();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h2 className="text-lg font-medium text-gray-900">Create New Booking</h2>
          <p className="mt-1 text-sm text-gray-600">
            Create a new short-term rental booking
          </p>
        </div>

        <div className="mt-5 md:col-span-2 md:mt-0">
          <form onSubmit={handleSubmit}>
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                {/* Property Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Property *
                  </label>
                  <select
                    required
                    value={formData.propertyId}
                    onChange={(e) => {
                      const propertyId = e.target.value;
                      setFormData({ ...formData, propertyId });

                      // Auto-fill nightly rate and cleaning fee from property
                      const property = properties.find(p => p.id === parseInt(propertyId));
                      if (property && property.nightlyRate) {
                        setFormData(prev => ({
                          ...prev,
                          propertyId,
                          nightlyRate: (property.nightlyRate! / 100).toString(),
                          cleaningFee: property.cleaningFee ? (property.cleaningFee / 100).toString() : '',
                        }));
                      }
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="">Select a property</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.name} - {property.address}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Guest Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Guest *
                  </label>
                  <select
                    required
                    value={formData.guestId}
                    onChange={(e) => setFormData({ ...formData, guestId: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="">Select a guest</option>
                    {guests.map((guest) => (
                      <option key={guest.id} value={guest.id}>
                        {guest.firstName} {guest.lastName} - {guest.email}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Don't see the guest? You'll need to create a guest record first.
                  </p>
                </div>

                {/* Check-in Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Check-In Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.checkInDate}
                    onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                {/* Check-out Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Check-Out Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.checkOutDate}
                    onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked-in">Checked In</option>
                    <option value="checked-out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Nightly Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nightly Rate ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.nightlyRate}
                    onChange={(e) => setFormData({ ...formData, nightlyRate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                {/* Cleaning Fee */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cleaning Fee ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cleaningFee}
                    onChange={(e) => setFormData({ ...formData, cleaningFee: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                {/* Total Calculation Display */}
                {totalInfo && (
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-blue-800">Booking Summary</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>{totalInfo.nights} night{totalInfo.nights !== 1 ? 's' : ''} × ${formData.nightlyRate} = ${totalInfo.nightlyTotal.toFixed(2)}</p>
                          {totalInfo.cleaning > 0 && <p>Cleaning fee: ${totalInfo.cleaning.toFixed(2)}</p>}
                          <p className="mt-2 font-semibold">Total: ${totalInfo.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Special Requests
                  </label>
                  <textarea
                    rows={3}
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                    placeholder="Any special requests or notes..."
                  />
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Booking'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
