
import React, { useState } from 'react';
import { X, Calendar, Clock, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TaskFormNewProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const TaskFormNew: React.FC<TaskFormNewProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    type: '',
    date: '',
    time: '',
    priority: 'sedang' as 'tinggi' | 'sedang' | 'rendah',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.subject.trim() && formData.date) {
      onSubmit(formData);
    }
  };

  const taskTypes = [
    'Proyek', 'Tugas', 'UAS', 'UTS', 'Kuis', 'Presentasi', 'Laporan', 'Diskusi'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">+ Tambah Tugas</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul Tugas *
              </label>
              <Input
                placeholder="Contoh: Membuat website e-commerce"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mata Kuliah / Pelajaran *
              </label>
              <Input
                placeholder="Contoh: Pemrograman Web"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Tugas
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Pilih jenis tugas</option>
                {taskTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  Tanggal *
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Clock className="w-4 h-4 mr-1" />
                  Jam *
                </label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Flag className="w-4 h-4 mr-1" />
                Tingkat Prioritas
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: 'rendah' })}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    formData.priority === 'rendah'
                      ? 'bg-yellow-500 text-white border-yellow-500'
                      : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                  }`}
                >
                  🟡 Rendah
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: 'sedang' })}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    formData.priority === 'sedang'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  🔵 Sedang
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: 'tinggi' })}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    formData.priority === 'tinggi'
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                  }`}
                >
                  🔴 Tinggi
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi (Opsional)
              </label>
              <Textarea
                placeholder="Tambahkan detail tugas..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Keluar
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Buat
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskFormNew;
