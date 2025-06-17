
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ListTodo, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { format, isToday, isPast, isSameDay, compareAsc } from 'date-fns';
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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'tinggi': return 'bg-red-100 text-red-700 border-red-200';
      case 'sedang': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'rendah': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'tinggi': return '🔴';
      case 'sedang': return '🔵';
      case 'rendah': return '🟡';
      default: return '⚪';
    }
  };

  const getUrgencyInfo = (deadline: Date, completed: boolean) => {
    if (completed) return { color: 'text-green-600', label: 'Selesai', icon: CheckCircle };
    if (isPast(deadline) && !isToday(deadline)) return { color: 'text-red-600', label: 'Terlambat', icon: AlertCircle };
    if (isToday(deadline)) return { color: 'text-orange-600', label: 'Hari Ini', icon: Clock };
    return { color: 'text-gray-600', label: 'Mendatang', icon: Clock };
  };

  // Filter tasks for Tugasku tab
  const filteredTasks = tasks.filter(task => 
    filterStatus === 'aktif' ? !task.completed : task.completed
  );

  // Sort tasks for Tugasku tab
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (filterStatus === 'aktif') {
      // For active tasks, sort by deadline (nearest first)
      return compareAsc(a.deadline, b.deadline);
    } else {
      // For completed tasks, sort by completion date (newest first) - using deadline as proxy
      return compareAsc(b.deadline, a.deadline);
    }
  });

  // Filter tasks for selected date in Kalender tab
  const tasksForSelectedDate = tasks
    .filter(task => isSameDay(task.deadline, selectedDate))
    .sort((a, b) => compareAsc(a.deadline, b.deadline));

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

  const renderTaskCard = (task: Task, showDate: boolean = false) => {
    const urgencyInfo = getUrgencyInfo(task.deadline, task.completed);
    const StatusIcon = urgencyInfo.icon;
    
    return (
      <Card 
        key={task.id} 
        className={`border-0 shadow-sm transition-all duration-200 hover:shadow-md ${
          task.completed 
            ? 'bg-gray-50/80 backdrop-blur-sm' 
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <button
              onClick={() => toggleTask(task.id)}
              className={`mt-1 p-1 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                task.completed 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : 'border-gray-300 hover:border-green-500'
              }`}
            >
              {task.completed && '✓'}
            </button>

            {/* Task Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`font-medium ${
                  task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                }`}>
                  {task.subject}
                </span>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getPriorityColor(task.priority)}`}
                >
                  {getPriorityIcon(task.priority)} {task.priority.toUpperCase()}
                </Badge>
              </div>
              
              <p className={`text-sm mb-2 ${
                task.completed ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {task.type}: {task.title}
              </p>
              
              <div className="flex items-center gap-3 text-xs">
                <div className={`flex items-center gap-1 ${urgencyInfo.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  <span>{urgencyInfo.label}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <CalendarIcon className="w-3 h-3" />
                  <span>
                    {showDate 
                      ? format(task.deadline, 'dd MMM yyyy, HH:mm', { locale: id })
                      : format(task.deadline, 'HH:mm', { locale: id })
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Halo, {userName}! 👋</h1>
          <p className="text-gray-600">Mari kelola tugas-tugasmu hari ini</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-lg p-1 mb-6 shadow-sm">
          <button
            onClick={() => setActiveTab('kalender')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-colors ${
              activeTab === 'kalender' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Kalender
          </button>
          <button
            onClick={() => setActiveTab('tugasku')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-colors ${
              activeTab === 'tugasku' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <ListTodo className="w-4 h-4 mr-2" />
            Tugasku
          </button>
        </div>

        {/* Calendar Tab Content */}
        {activeTab === 'kalender' && (
          <div className="space-y-6 mb-20">
            {/* Calendar Widget */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-sm">
              <CardContent className="p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={id}
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Selected Date Tasks */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Tugas untuk {format(selectedDate, 'dd MMMM yyyy', { locale: id })}
              </h3>
              
              <div className="space-y-3">
                {tasksForSelectedDate.length === 0 ? (
                  <Card className="border-0 bg-white/60 backdrop-blur-sm">
                    <CardContent className="p-8 text-center text-gray-500">
                      <div className="text-4xl mb-4">📅</div>
                      <p>Tidak ada tugas pada tanggal ini</p>
                    </CardContent>
                  </Card>
                ) : (
                  tasksForSelectedDate.map((task) => renderTaskCard(task, false))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tugasku Tab Content */}
        {activeTab === 'tugasku' && (
          <>
            {/* Filter Buttons */}
            <div className="flex gap-2 mb-6">
              <Button
                variant={filterStatus === 'aktif' ? "default" : "outline"}
                onClick={() => setFilterStatus('aktif')}
                className={`${filterStatus === 'aktif' ? 'bg-blue-600' : ''}`}
              >
                <Clock className="w-4 h-4 mr-2" />
                Aktif ({tasks.filter(t => !t.completed).length})
              </Button>
              <Button
                variant={filterStatus === 'selesai' ? "default" : "outline"}
                onClick={() => setFilterStatus('selesai')}
                className={`${filterStatus === 'selesai' ? 'bg-blue-600' : ''}`}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Selesai ({tasks.filter(t => t.completed).length})
              </Button>
            </div>

            {/* Tasks List */}
            <div className="space-y-3 mb-20">
              {sortedTasks.length === 0 ? (
                <Card className="border-0 bg-white/60 backdrop-blur-sm">
                  <CardContent className="p-8 text-center text-gray-500">
                    <div className="text-4xl mb-4">
                      {filterStatus === 'aktif' ? '📋' : '✅'}
                    </div>
                    <p>
                      {filterStatus === 'aktif' 
                        ? 'Belum ada tugas aktif. Tambahkan tugas pertamamu!' 
                        : 'Belum ada tugas yang selesai'
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                sortedTasks.map((task) => renderTaskCard(task, true))
              )}
            </div>
          </>
        )}

        {/* Floating Add Button */}
        <button
          onClick={() => setShowTaskForm(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-30 flex items-center justify-center"
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
