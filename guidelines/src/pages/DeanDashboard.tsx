import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { Check, Edit2, Trash2 } from "lucide-react";

export function DeanDashboard() {
  const { logout, method } = useAuth();
  const { announcements, addAnnouncement, deleteById, updateById } = useAnnouncements();
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<any>({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    author: "Dean",
    category: "Dean",
    hasDocument: false,
  });

  const handleCreate = () => {
    if (!form.title || !form.date) return;
    addAnnouncement(form);
    setForm({ title: "", date: "", time: "", location: "", description: "", author: "Dean", category: "Dean", hasDocument: false });
    setCreating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Dean Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">{method === "google" ? "Google" : "Emergency"}</span>
            <button onClick={logout} className="px-4 py-2 bg-gray-200 rounded-lg">Logout</button>
          </div>
        </div>

        <div className="mb-6">
          <button onClick={() => setCreating(!creating)} className="px-4 py-2 bg-primary text-white rounded-lg">New Announcement</button>
        </div>

        {creating && (
          <div className="bg-white p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="p-2 border" />
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="p-2 border" />
            </div>
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-2 border mb-2" />
            <div className="flex gap-2">
              <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"><Check /> Create</button>
              <button onClick={() => setCreating(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className="bg-white p-4 rounded-lg flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-500">{a.category}</div>
                <h3 className="font-bold text-lg">{a.title}</h3>
                <div className="text-sm text-gray-600">{a.description}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => deleteById(a.id)} className="p-2 text-red-600"><Trash2 /></button>
                {/* edit would open inline editor - omitted for brevity */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
