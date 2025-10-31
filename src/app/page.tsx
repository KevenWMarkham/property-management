export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Property Management System</h1>
        <p className="text-lg mb-4">
          Welcome to your property management system. Get started by exploring
          the features below.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Properties</h2>
            <p className="text-gray-600">
              Manage your property portfolio and units.
            </p>
          </div>
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Tenants</h2>
            <p className="text-gray-600">
              Track tenant information and lease agreements.
            </p>
          </div>
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Payments</h2>
            <p className="text-gray-600">
              Monitor rent payments and financial records.
            </p>
          </div>
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Maintenance</h2>
            <p className="text-gray-600">
              Handle maintenance requests and work orders.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
