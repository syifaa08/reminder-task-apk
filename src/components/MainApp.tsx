
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ListTodo, Plus, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isToday, isPast } from 'date-fns';
import { id } from 'date-fns/locale';
import TaskFormNew from './TaskFormNew';

interface Task {
  id: string;
  title: string;
  subject: string;
  type: string;
  deadline: Date;
  priority: 'tinggi' | 'sedang' | 'rendah';
  description?: string;
  completed: boolean;
}

interface MainAppProps {
  userName: string;
}

const MainApp: React.FC<MainAppProps> = ({ userName }) => {
  const [activeTab, setActiveTab] = useState<'kalender' | 'tugasku'>('tugasku');
  const [filterStatus, setFilterStatus] = useState<'aktif' | 'selesai'>('aktif');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'tinggi': return 'bg-red-500';
      case 'sedang': return 'bg-blue-500';
      case 'rendah': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'tinggi': return 'TINGGI';
      case 'sedang': return 'SEDANG';
      case 'rendah': return 'RENDAH';
      default: return 'SEDANG';
    }
  };

  const filteredTasks = tasks.filter(task => 
    filterStatus === 'aktif' ? !task.completed : task.completed
  );

  const addTask = (taskData: any) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      subject: taskData.subject,
      type: taskData.type,
      deadline: new Date(`${taskData.date}T${taskData.time}`),
      priority: taskData.priority,
      description: taskData.description,
      completed: false
    };
    setTasks(prev => [...prev, newTask]);
    setShowTaskForm(false);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header with Avatar */}
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-3">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">Halo, {userName}</h1>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-lg p-1 mb-4 shadow-sm">
          <button
            onClick={() => setActiveTab('kalender')}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md transition-colors ${
              activeTab === 'kalender' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Kalender
          </button>
          <button
            onClick={() => setActiveTab('tugasku')}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md transition-colors ${
              activeTab === 'tugasku' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <ListTodo className="w-4 h-4 mr-2" />
            Tugasku
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex bg-white rounded-lg p-1 mb-6 shadow-sm">
          <button
            onClick={() => setFilterStatus('aktif')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors text-sm font-medium ${
              filterStatus === 'aktif' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Aktif
          </button>
          <button
            onClick={() => setFilterStatus('selesai')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors text-sm font-medium ${
              filterStatus === 'selesai' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Selesai
          </button>
        </div>

        {/* Tasks List */}
        <div className="space-y-3 mb-20">
          {filteredTasks.length === 0 ? (
            <Card className="border-0 bg-white shadow-sm">
              <CardContent className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-4">📋</div>
                <p>
                  {filterStatus === 'aktif' 
                    ? 'Belum ada tugas aktif. Tambahkan tugas pertamamu!' 
                    : 'Belum ada tugas yang selesai'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} className="border-0 shadow-sm bg-white">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{task.subject}</h3>
                      <p className="text-sm text-gray-600 mb-2">{task.type}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)} ml-2 mt-1`}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{format(task.deadline, 'd MMM yyyy', { locale: id })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{format(task.deadline, 'HH:mm')}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        task.completed 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {task.completed ? 'SELESAI' : 'BELUM'}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Floating Add Button */}
        <button
          onClick={() => setShowTaskForm(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors z-30 flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Task Form Modal */}
        {showTaskForm && (
          <TaskFormNew
            onSubmit={addTask}
            onCancel={() => setShowTaskForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MainApp;
