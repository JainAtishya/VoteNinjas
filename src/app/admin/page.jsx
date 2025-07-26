export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p>Welcome to the admin panel. From here you can manage all aspects of the voting application.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold mb-2">Events</h2>
          <p>Create, edit, and manage all voting events.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold mb-2">Users</h2>
          <p>View and manage registered users.</p>
        </div>
      </div>
    </div>
  );
}
