import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { Check, Edit2, Trash2, Plus, Upload, FileDown, X } from "lucide-react";
import { useNavigate } from "react-router";
import {
  collection,
  serverTimestamp,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Announcement } from "../data/announcements";
import { uploadAnnouncementFile } from "../utils/uploadfile";
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { ThemeProvider, createTheme } from '@mui/material/styles';

dayjs.extend(customParseFormat);

const muiTheme = createTheme({
  palette: {
    primary: { main: '#F96500' },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
  },
});

function parseTime(timeStr: string | undefined): Dayjs | null {
  if (!timeStr) return null;
  if (timeStr.includes("AM") || timeStr.includes("PM")) {
    return dayjs(timeStr, "hh:mm A");
  }
  return dayjs(timeStr, "HH:mm");
}

const CATEGORIES = ["Dean", "Department", "Timetable", "Venue"] as const;

function FileAttachmentRow({
  hasDocument,
  file,
  existingFileName,
  inputId,
  disabled,
  onToggle,
  onFileChange,
  onClearFile,
}: {
  hasDocument: boolean;
  file: File | null;
  existingFileName?: string;
  inputId: string;
  disabled: boolean;
  onToggle: (checked: boolean) => void;
  onFileChange: (file: File | null) => void;
  onClearFile: () => void;
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={hasDocument}
          onChange={(e) => onToggle(e.target.checked)}
          className="h-4 w-4 accent-primary"
          disabled={disabled}
        />
        <span className="text-sm font-medium text-stone-700">
          Attach a file (PDF, PNG, JPG or JPEG)
        </span>
      </label>

      <div className="mt-3 space-y-2">
        {file ? (
          <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-white px-3 py-2">
            <span className="flex items-center gap-2 truncate text-sm text-stone-700">
              <FileDown size={14} className="shrink-0 text-primary" />
              <span className="truncate">{file.name}</span>
            </span>
            <button
              type="button"
              onClick={onClearFile}
              disabled={disabled}
              className="ml-2 shrink-0 text-stone-400 transition hover:text-stone-600 disabled:opacity-50"
              aria-label="Remove selected file"
            >
              <X size={14} />
            </button>
          </div>
        ) : existingFileName ? (
          <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-500">
            <FileDown size={14} className="shrink-0 text-stone-400" />
            <span className="truncate">Current: {existingFileName}</span>
          </div>
        ) : null}

        <input
          id={inputId}
          type="file"
          accept=".pdf,image/*"
          onChange={(e) => {
            const nextFile = e.target.files?.[0] ?? null;
            onFileChange(nextFile);
            if (nextFile) {
              onToggle(true);
            }
          }}
          className={`block w-full cursor-pointer rounded-lg border border-dashed border-primary/40 bg-white px-4 py-2 text-sm text-stone-600 file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:bg-primary/5 ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
          disabled={disabled}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Upload size={14} className="text-primary" />
          <p className="text-xs text-stone-400">
            PDF, PNG, JPG or JPEG accepted. Choosing a file enables the attachment automatically.
          </p>
        </div>
      </div>
    </div>
  );
}

export function DeanDashboard() {
  const { logout, method } = useAuth();
  const { announcements } = useAnnouncements();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Announcement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEditFile, setSelectedEditFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  const busy = isSaving || uploading;

  const resetCreateForm = () => {
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
    setSelectedFile(null);
  };

  const handleCreate = async () => {
    if (!form.title.trim() || !form.date || !form.description.trim()) {
      setError("Title, date and description are required");
      return;
    }
    if (form.hasDocument && !selectedFile) {
      setError("Please select a file to attach before creating this notice");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const docRef = doc(collection(db, "announcements"));
      let documentUrl = "";
      let fileUrl = "";
      let documentName = "";
      let documentType = "";

      if (form.hasDocument && selectedFile) {
        setUploading(true);
        fileUrl = await uploadAnnouncementFile(selectedFile, docRef.id);
        documentUrl = fileUrl;
        documentName = selectedFile.name;
        documentType = selectedFile.type || "application/octet-stream";
      }

      await setDoc(docRef, {
        title: form.title,
        description: form.description,
        date: form.date,
        time: form.time || "",
        location: form.location || "",
        category: form.category,
        author: "Dean",
        hasDocument: form.hasDocument || false,
        documentUrl,
        fileUrl,
        documentName,
        documentType,
        createdAt: serverTimestamp(),
      });

      resetCreateForm();
      setCreating(false);
    } catch (err) {
      console.error("Error creating announcement:", err);
      setError("Failed to create announcement");
    } finally {
      setUploading(false);
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Delete this announcement?")) return;
    setIsSaving(true);
    setError(null);
    try {
      await deleteDoc(doc(db, "announcements", String(id)));
    } catch (err) {
      console.error("Error deleting:", err);
      setError("Failed to delete announcement");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartEdit = (announcement: Announcement) => {
    setEditingId(String(announcement.id));
    setEditForm(announcement);
    setSelectedEditFile(null);
  };

  const handleSaveEdit = async () => {
    if (!editForm) return;
    if (editForm.hasDocument && !selectedEditFile && !editForm.documentUrl && !editForm.fileUrl) {
      setError("Please select a file to attach for this notice");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const docRef = doc(db, "announcements", String(editForm.id));
      const existing = await getDoc(docRef);
      const hasCreatedAt = existing.exists() && existing.data()?.createdAt;
      const updatePayload: Record<string, unknown> = {
        title: editForm.title,
        description: editForm.description,
        date: editForm.date,
        time: editForm.time || "",
        location: editForm.location || "",
        category: editForm.category,
        hasDocument: editForm.hasDocument || false,
        updatedAt: serverTimestamp(),
        ...(!hasCreatedAt ? { createdAt: serverTimestamp() } : {}),
      };

      if (editForm.hasDocument) {
        if (selectedEditFile) {
          setUploading(true);
          const fileUrl = await uploadAnnouncementFile(
            selectedEditFile,
            String(editForm.title || editForm.id),
          );
          updatePayload.documentUrl = fileUrl;
          updatePayload.fileUrl = fileUrl;
          updatePayload.documentName = selectedEditFile.name;
          updatePayload.documentType = selectedEditFile.type || "application/octet-stream";
        } else {
          updatePayload.documentUrl = editForm.documentUrl || editForm.fileUrl || "";
          updatePayload.fileUrl = editForm.fileUrl || editForm.documentUrl || "";
          updatePayload.documentName = editForm.documentName || "";
          updatePayload.documentType = editForm.documentType || "";
        }
      } else {
        updatePayload.documentUrl = "";
        updatePayload.fileUrl = "";
        updatePayload.documentName = "";
        updatePayload.documentType = "";
      }

      await setDoc(docRef, updatePayload, { merge: true });
      setEditingId(null);
      setEditForm(null);
      setSelectedEditFile(null);
    } catch (err) {
      console.error("Error updating:", err);
      setError("Failed to update announcement");
    } finally {
      setUploading(false);
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen px-3 py-4 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-stone-950">Dean Dashboard</h1>
            <div className="mt-2 h-1 w-16 bg-primary" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {method === "google" ? "Google" : "Emergency"}
            </span>
            <button
              onClick={async () => {
                await logout();
                navigate("/sipannouncements/secretlogin", { replace: true });
              }}
              className="rounded-lg bg-stone-200 px-4 py-2 font-medium text-stone-700 transition-colors hover:bg-stone-300"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6">
          <button
            onClick={() => setCreating(!creating)}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
          >
            <Plus size={18} />
            New Announcement
          </button>
        </div>

        {creating && (
          <div className="mb-6 rounded-2xl border border-stone-100 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 text-xl font-bold text-stone-950">Create Announcement</h2>
            <div className="space-y-3">
              <input
                placeholder="Title *"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-stone-200 p-3 outline-none transition focus:border-primary"
                disabled={busy}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="rounded-lg border border-stone-200 p-3 outline-none transition focus:border-primary"
                  disabled={busy}
                />
                <ThemeProvider theme={muiTheme}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label="Time"
                      value={parseTime(form.time)}
                      onChange={(newValue) => setForm({ ...form, time: newValue ? newValue.format('HH:mm') : '' })}
                      disabled={busy}
                      viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock,
                        seconds: renderTimeViewClock,
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '0.5rem',
                              '& fieldset': { borderColor: '#E5E7EB' },
                              '&:hover fieldset': { borderColor: '#F96500' },
                              '&.Mui-focused fieldset': { borderColor: '#F96500' },
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </ThemeProvider>
              </div>
              <input
                placeholder="Location (optional)"
                value={form.location || ""}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full rounded-lg border border-stone-200 p-3 outline-none transition focus:border-primary"
                disabled={busy}
              />
              <textarea
                placeholder="Description *"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full resize-none rounded-lg border border-stone-200 p-3 outline-none transition focus:border-primary"
                rows={4}
                disabled={busy}
              />
              <div className="flex flex-wrap items-center gap-4">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                  className="rounded-lg border border-stone-200 p-3 outline-none transition focus:border-primary"
                  disabled={busy}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <FileAttachmentRow
                hasDocument={form.hasDocument || false}
                file={selectedFile}
                inputId="create-file-input"
                disabled={busy}
                onToggle={(checked) => {
                  setForm({ ...form, hasDocument: checked });
                  if (!checked) setSelectedFile(null);
                }}
                onFileChange={(file) => {
                  setSelectedFile(file);
                  if (file) {
                    setForm({ ...form, hasDocument: true });
                  }
                }}
                onClearFile={() => setSelectedFile(null)}
              />

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleCreate}
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
                >
                  <Check size={16} />
                  {uploading ? "Uploading..." : isSaving ? "Creating..." : "Create"}
                </button>
                <button
                  onClick={() => {
                    setCreating(false);
                    resetCreateForm();
                  }}
                  disabled={busy}
                  className="rounded-xl bg-stone-200 px-4 py-2 font-semibold text-stone-700 transition-colors hover:bg-stone-300 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <h2 className="mb-4 text-xl font-bold text-stone-950">
          Announcements ({announcements.length})
        </h2>
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div className="rounded-2xl border border-stone-100 bg-white p-8 text-center text-stone-500">
              No announcements yet. Create one to get started.
            </div>
          ) : (
            announcements.map((a) =>
              editingId === String(a.id) && editForm ? (
                <div key={a.id} className="rounded-2xl border border-primary/30 bg-white p-5 shadow-sm sm:p-6">
                  <h3 className="mb-3 font-bold text-stone-950">Editing: {a.title}</h3>
                  <div className="space-y-3">
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full rounded-lg border border-stone-200 p-3 outline-none transition focus:border-primary"
                      disabled={busy}
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        className="rounded-lg border border-stone-200 p-3 outline-none transition focus:border-primary"
                        disabled={busy}
                      />
                      <ThemeProvider theme={muiTheme}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            label="Time"
                            value={parseTime(editForm.time)}
                            onChange={(newValue) => setEditForm({ ...editForm, time: newValue ? newValue.format('HH:mm') : '' })}
                            disabled={busy}
                            viewRenderers={{
                              hours: renderTimeViewClock,
                              minutes: renderTimeViewClock,
                              seconds: renderTimeViewClock,
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                sx: {
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '0.5rem',
                                    '& fieldset': { borderColor: '#E5E7EB' },
                                    '&:hover fieldset': { borderColor: '#F96500' },
                                    '&.Mui-focused fieldset': { borderColor: '#F96500' },
                                  },
                                },
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </ThemeProvider>
                    </div>
                    <input
                      placeholder="Location"
                      value={editForm.location || ""}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="w-full rounded-lg border border-stone-200 p-3 outline-none transition focus:border-primary"
                      disabled={busy}
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full resize-none rounded-lg border border-stone-200 p-3 outline-none transition focus:border-primary"
                      rows={4}
                      disabled={busy}
                    />
                    <div className="flex flex-wrap items-center gap-4">
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value as any })}
                        className="rounded-lg border border-stone-200 p-3 outline-none transition focus:border-primary"
                        disabled={busy}
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <FileAttachmentRow
                      hasDocument={editForm.hasDocument || false}
                      file={selectedEditFile}
                      existingFileName={editForm.documentName}
                      inputId="edit-file-input"
                      disabled={busy}
                      onToggle={(checked) => {
                        setEditForm({ ...editForm, hasDocument: checked });
                        if (!checked) setSelectedEditFile(null);
                      }}
                      onFileChange={(file) => {
                        setSelectedEditFile(file);
                        if (file) {
                          setEditForm({ ...editForm, hasDocument: true });
                        }
                      }}
                      onClearFile={() => setSelectedEditFile(null)}
                    />

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleSaveEdit}
                        disabled={busy}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
                      >
                        <Check size={16} />
                        {uploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditForm(null);
                          setSelectedEditFile(null);
                        }}
                        disabled={busy}
                        className="rounded-xl bg-stone-200 px-4 py-2 font-semibold text-stone-700 transition-colors hover:bg-stone-300 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={a.id} className="flex items-start justify-between gap-4 rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {a.category}
                      </span>
                      {a.hasDocument && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-500">
                          <FileDown size={13} />
                          {a.documentType?.includes("image") ? "Image" : "PDF"}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-stone-950">{a.title}</h3>
                    <p className="mt-1 text-sm text-stone-500">{a.description}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-stone-400">
                      <span>📅 {new Date(a.date).toLocaleDateString()}</span>
                      {a.time && <span>⏰ {a.time}</span>}
                      {a.location && <span>📍 {a.location}</span>}
                      {a.documentName && <span>File: {a.documentName}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartEdit(a)}
                      disabled={busy}
                      className="rounded-lg p-2 text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      disabled={busy}
                      className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ),
            )
          )}
        </div>
      </div>
    </div>
  );
}
