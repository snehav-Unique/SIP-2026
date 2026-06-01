import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Trash2, Edit2, Plus, X, Check } from "lucide-react";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { Announcement } from "../data/announcements";
import { DEAN_TOKEN } from "../config/dean";

export function DeanPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { announcements, deleteById, updateById, addAnnouncement } = useAnnouncements();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState<Announcement | null>(null);
  const [createForm, setCreateForm] = useState<Omit<Announcement, "id">>({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    author: "Dean",
    category: "Dean",
    hasDocument: false,
  });

  useEffect(() => {
    const token = searchParams.get("token");
    if (token === DEAN_TOKEN) {
      setIsAuthorized(true);
    }
  }, [searchParams]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">Invalid or missing access token. This page is restricted to administrators only.</p>
            <button
              onClick={() => navigate("/")}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleStartEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setEditForm(announcement);
  };

  const handleSaveEdit = () => {
    if (editForm) {
      updateById(editForm.id, editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleCreateSubmit = () => {
    if (createForm.title.trim() && createForm.date && createForm.description.trim()) {
      addAnnouncement(createForm);
      setCreateForm({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        author: "Dean",
        category: "Dean",
        hasDocument: false,
      });
      setIsCreating(false);
    }
  };

  const categories = ["Dean", "Department", "Timetable", "Venue"] as const;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900">Dean Management Panel</h1>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              ✓ Authorized
            </span>
          </div>
          <div className="w-20 h-1 bg-primary mb-4"></div>
          <p className="text-gray-600">Manage all announcements for the student dashboard</p>
        </div>

        {/* New Announcement Button */}
        <div className="mb-8">
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
            New Announcement
          </button>
        </div>

        {/* Create Form */}
        {isCreating && (
          <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border-2 border-primary/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Announcement</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Announcement title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={createForm.date}
                    onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time (optional)</label>
                  <input
                    type="text"
                    value={createForm.time || ""}
                    onChange={(e) => setCreateForm({ ...createForm, time: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="e.g., 10:00 AM - 12:00 PM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location (optional)</label>
                <input
                  type="text"
                  value={createForm.location || ""}
                  onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Venue location"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none"
                  rows={4}
                  placeholder="Detailed description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={createForm.category}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        category: e.target.value as "Dean" | "Department" | "Timetable" | "Venue",
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createForm.hasDocument || false}
                      onChange={(e) => setCreateForm({ ...createForm, hasDocument: e.target.checked })}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-gray-700">Has Document/PDF</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateSubmit}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Create Announcement
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Announcements List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Announcements ({announcements.length})</h2>
          {announcements.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <p className="text-gray-600">No announcements yet. Create one to get started!</p>
            </div>
          ) : (
            announcements.map((announcement) =>
              editingId === announcement.id && editForm ? (
                // Edit Mode
                <div key={announcement.id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Editing: {announcement.title}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                        <input
                          type="text"
                          value={editForm.time || ""}
                          onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={editForm.location || ""}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                        <select
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              category: e.target.value as "Dean" | "Department" | "Timetable" | "Venue",
                            })
                          }
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editForm.hasDocument || false}
                            onChange={(e) =>
                              setEditForm({ ...editForm, hasDocument: e.target.checked })
                            }
                            className="w-5 h-5 cursor-pointer"
                          />
                          <span className="text-sm font-semibold text-gray-700">Has Document/PDF</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Check size={18} />
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // View Mode
                <div
                  key={announcement.id}
                  className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          {announcement.category}
                        </span>
                        {announcement.hasDocument && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                            📄 PDF
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{announcement.title}</h3>
                      <p className="text-gray-700 mb-3">{announcement.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>📅 {new Date(announcement.date).toLocaleDateString()}</span>
                        {announcement.time && <span>⏰ {announcement.time}</span>}
                        {announcement.location && <span>📍 {announcement.location}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleStartEdit(announcement)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => deleteById(announcement.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
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
