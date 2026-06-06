import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { Check, Edit2, Trash2, Plus, X } from "lucide-react";
import { useNavigate } from "react-router";
import {
  addDoc,
  collection,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Announcement } from "../data/announcements";

const CATEGORIES = ["Dean", "Department", "Timetable", "Venue"] as const;

export function DeanDashboard() {
  const { logout, method } = useAuth();
  const { announcements } = useAnnouncements();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Announcement, "id">>({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    author: "Dean",
    category: "Dean",
    hasDocument: false,
  });

  const handleCreate = async () => {
    if (!form.title.trim() || !form.date || !form.description.trim()) {
      setError("Title, date and description are required");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await addDoc(collection(db, "announcements"), {
        title: form.title,
        description: form.description,
        date: form.date,
        time: form.time || "",
        location: form.location || "",
        category: form.category,
        author: "Dean",
        hasDocument: form.hasDocument || false,
        documentUrl: null,
        createdAt: serverTimestamp(),
      });
      setForm({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        author: "Dean",
        category: "Dean",
        hasDocument: false,
      });
      setCreating(false);
    } catch (err) {
      console.error("Error creating announcement:", err);
      setError("Failed to create announcement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Delete this announcement?")) return;
    setIsLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, "announcements", String(id)));
    } catch (err) {
      console.error("Error deleting:", err);
      setError("Failed to delete announcement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = (announcement: Announcement) => {
    setEditingId(String(announcement.id));
    setEditForm(announcement);
  };

  const handleSaveEdit = async () => {
    if (!editForm) return;
    setIsLoading(true);
    setError(null);
    try {
      const docRef = doc(db, "announcements", String(editForm.id));
      const existing = await getDoc(docRef);
      const hasCreatedAt = existing.exists() && existing.data()?.createdAt;

      await updateDoc(docRef, {
        title: editForm.title,
        description: editForm.description,
        date: editForm.date,
        time: editForm.time || "",
        location: editForm.location || "",
        category: editForm.category,
        hasDocument: editForm.hasDocument || false,
        updatedAt: serverTimestamp(),
        ...(!hasCreatedAt ? { createdAt: serverTimestamp() } : {}),
      });
      setEditingId(null);
      setEditForm(null);
    } catch (err) {
      console.error("Error updating:", err);
      setError("Failed to update announcement");
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dean Dashboard</h1>
            <div className="w-16 h-1 bg-primary mt-2"></div>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {method === "google" ? "Google" : "Emergency"}
            </span>

<button
  onClick={async () => {
    await logout();
    navigate("/sipannouncements/secretlogin", { replace: true });
  }}
  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
>
  Logout
</button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* New Announcement Button */}
        <div className="mb-6">
          <button
            onClick={() => setCreating(!creating)}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            <Plus size={18} />
            New Announcement
          </button>
        </div>

        {/* Create Form */}
        {creating && (
          <div className="bg-white p-6 rounded-xl shadow-md border-2 border-primary/20 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create Announcement</h2>
            <div className="space-y-3">
              <input
                placeholder="Title *"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                disabled={isLoading}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="p-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  disabled={isLoading}
                />
                <input
                  placeholder="Time (e.g. 10:00 AM)"
                  value={form.time || ""}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="p-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  disabled={isLoading}
                />
              </div>
              <input
                placeholder="Location (optional)"
                value={form.location || ""}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                disabled={isLoading}
              />
              <textarea
                placeholder="Description *"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none"
                rows={3}
                disabled={isLoading}
              />
              <div className="flex items-center gap-4">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                  className="p-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  disabled={isLoading}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.hasDocument || false}
                    onChange={(e) => setForm({ ...form, hasDocument: e.target.checked })}
                    className="w-4 h-4"
                    disabled={isLoading}
                  />
                  <span className="text-sm font-medium text-gray-700">Has PDF</span>
                </label>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleCreate}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Check size={16} />
                  {isLoading ? "Creating..." : "Create"}
                </button>
                <button
                  onClick={() => setCreating(false)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Announcements List */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Announcements ({announcements.length})
        </h2>
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500">
              No announcements yet. Create one to get started!
            </div>
          ) : (
            announcements.map((a) =>
              editingId === String(a.id) && editForm ? (
                // Edit mode
                <div key={a.id} className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-200">
                  <h3 className="font-bold text-gray-900 mb-3">Editing: {a.title}</h3>
                  <div className="space-y-3">
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      disabled={isLoading}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        className="p-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                        disabled={isLoading}
                      />
                      <input
                        placeholder="Time"
                        value={editForm.time || ""}
                        onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                        className="p-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                        disabled={isLoading}
                      />
                    </div>
                    <input
                      placeholder="Location"
                      value={editForm.location || ""}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      disabled={isLoading}
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none"
                      rows={3}
                      disabled={isLoading}
                    />
                    <div className="flex items-center gap-4">
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value as any })}
                        className="p-2.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                        disabled={isLoading}
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.hasDocument || false}
                          onChange={(e) => setEditForm({ ...editForm, hasDocument: e.target.checked })}
                          className="w-4 h-4"
                          disabled={isLoading}
                        />
                        <span className="text-sm font-medium text-gray-700">Has PDF</span>
                      </label>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleSaveEdit}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        <Check size={16} />
                        {isLoading ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setEditForm(null); }}
                        disabled={isLoading}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // View mode
                <div key={a.id} className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-primary flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {a.category}
                      </span>
                      {a.hasDocument && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                          📄 PDF
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{a.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{a.description}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                      <span>📅 {new Date(a.date).toLocaleDateString()}</span>
                      {a.time && <span>⏰ {a.time}</span>}
                      {a.location && <span>📍 {a.location}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleStartEdit(a)}
                      disabled={isLoading}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      disabled={isLoading}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}