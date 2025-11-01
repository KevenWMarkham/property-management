'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    type: 'long-term',
    propertyType: 'house',
    units: 1,
    nightlyRate: '',
    cleaningFee: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          nightlyRate: formData.nightlyRate ? parseFloat(formData.nightlyRate) * 100 : null,
          cleaningFee: formData.cleaningFee ? parseFloat(formData.cleaningFee) * 100 : null,
        }),
      });

      if (res.ok) {
        router.push('/properties');
      } else {
        alert('Failed to create property');
      }
    } catch (error) {
      console.error('Error creating property:', error);
      alert('Failed to create property');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h2 className="text-lg font-medium text-gray-900">Add New Property</h2>
          <p className="mt-1 text-sm text-gray-600">
            Create a new property in your portfolio
          </p>
        </div>

        <div className="mt-5 md:col-span-2 md:mt-0">
          <form onSubmit={handleSubmit}>
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                {/* Property Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Property Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                {/* City, State, Zip */}
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Zip *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rental Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="long-term">Long-term (Traditional Lease)</option>
                    <option value="short-term">Short-term (Vacation Rental)</option>
                    <option value="hybrid">Hybrid (Both)</option>
                  </select>
                </div>

                {/* Nightly Rate (if short-term) */}
                {(formData.type === 'short-term' || formData.type === 'hybrid') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nightly Rate ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.nightlyRate}
                        onChange={(e) => setFormData({ ...formData, nightlyRate: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                      />
                    </div>

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
                  </>
                )}
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
                  {loading ? 'Creating...' : 'Create Property'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
