
import React, { useState, useEffect } from 'react';
import { Calendar, Flag, Trash2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import BottomNavigation from '@/components/BottomNavigation';
import FloatingAddButton from '@/components/FloatingAddButton';
import TaskForm, { TaskFormData } from '@/components/TaskForm';
import SearchAndFilter from '@/components/SearchAndFilter';
import SettingsPage from '@/components/SettingsPage';
import { scheduleTaskNotification, cancelTaskNotification, requestNotificationPermissions } from '@/utils/notifications';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: 'personal' | 'work' | 'school';
  dueDate: Date;
  reminderMinutes: number;
  createdAt: Date;
}

interface Settings {
  theme: 'light' | 'dark';
  defaultReminderTime: number;
  notificationsEnabled: boolean;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'settings'>('home');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [settings, setSettings] = useState<Settings>({
    theme: 'light',
    defaultReminderTime: 30,
    notificationsEnabled: true,
  });
  const { toast } = useToast();

  // Load data from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskReminderTasks');
    const savedSettings = localStorage.getItem('taskReminderSettings');
    
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt)
      }));
      setTasks(parsedTasks);
    }
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Request notification permissions on app start
    requestNotificationPermissions();
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('taskReminderTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('taskReminderSettings', JSON.stringify(settings));
  }, [settings]);

  const addTask = async (formData: TaskFormData) => {
    const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime || '23:59'}`);
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      completed: false,
      category: formData.category,
      dueDate: dueDateTime,
      reminderMinutes: formData.reminderMinutes,
      createdAt: new Date()
    };

    setTasks(prev => [...prev, newTask]);
    
    if (settings.notificationsEnabled) {
      await scheduleTaskNotification(
        newTask.id,
        newTask.title,
        newTask.description,
        newTask.dueDate,
        newTask.reminderMinutes
      );
    }
    
    setShowTaskForm(false);
    toast({
      title: "Task Added",
      description: `"${newTask.title}" has been added successfully.`,
    });
  };

  const toggleTask = async (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, completed: !task.completed };
        if (updatedTask.completed) {
          cancelTaskNotification(id);
        }
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    await cancelTaskNotification(id);
    toast({
      title: "Task Deleted",
      description: "Task has been removed successfully.",
    });
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'work': return { color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Work' };
      case 'school': return { color: 'bg-purple-50 text-purple-700 border-purple-200', label: 'School' };
      case 'personal': return { color: 'bg-green-50 text-green-700 border-green-200', label: 'Personal' };
      default: return { color: 'bg-gray-50 text-gray-700 border-gray-200', label: category };
    }
  };

  const getUrgencyInfo = (dueDate: Date, completed: boolean) => {
    if (completed) return { color: 'text-green-600', label: 'Completed' };
    if (isPast(dueDate) && !isToday(dueDate)) return { color: 'text-red-600', label: 'Overdue' };
    if (isToday(dueDate)) return { color: 'text-orange-600', label: 'Due Today' };
    return { color: 'text-gray-600', label: 'Upcoming' };
  };

  const filteredTasks = tasks
    .filter(task => {
      if (activeTab === 'history') return task.completed;
      if (activeTab === 'home') return !task.completed;
      return true;
    })
    .filter(task => {
      if (searchTerm) {
        return task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               task.description.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .filter(task => {
      if (selectedCategory === 'all') return true;
      return task.category === selectedCategory;
    })
    .sort((a, b) => {
      if (activeTab === 'history') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
      return a.dueDate.getTime() - b.dueDate.getTime();
    });

  const todaysTasks = tasks.filter(task => !task.completed && isToday(task.dueDate));
  const overdueTasks = tasks.filter(task => !task.completed && isPast(task.dueDate) && !isToday(task.dueDate));

  if (activeTab === 'settings') {
    return (
      <>
        <SettingsPage settings={settings} onSettingsChange={setSettings} />
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {activeTab === 'home' ? 'Today\'s Tasks' : 'Task History'}
          </h1>
          {activeTab === 'home' && (
            <div className="flex justify-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                {todaysTasks.length} due today
              </span>
              {overdueTasks.length > 0 && (
                <span className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  {overdueTasks.length} overdue
                </span>
              )}
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-4">
                  {activeTab === 'home' ? '📋' : '✅'}
                </div>
                <p>
                  {activeTab === 'home' 
                    ? searchTerm || selectedCategory !== 'all' 
                      ? 'No tasks match your search criteria'
                      : 'No active tasks. Add your first task!'
                    : 'No completed tasks yet'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => {
              const categoryInfo = getCategoryInfo(task.category);
              const urgencyInfo = getUrgencyInfo(task.dueDate, task.completed);
              
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTask(task.id)}
                        className={`mt-1 p-1 h-6 w-6 rounded-full border-2 ${
                          task.completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {task.completed && <Check className="w-3 h-3" />}
                      </Button>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-sm font-medium ${
                            task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                          }`}>
                            {task.title}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs capitalize ${categoryInfo.color}`}
                          >
                            {categoryInfo.label}
                          </Badge>
                        </div>
                        
                        {task.description && (
                          <p className={`text-xs mb-2 ${
                            task.completed ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {task.description}
                          </p>
                        )}
                        
                        <div className={`flex items-center gap-1 text-xs ${urgencyInfo.color}`}>
                          <Calendar className="w-3 h-3" />
                          <span>
                            {urgencyInfo.label}: {format(task.dueDate, 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          onSubmit={addTask}
          onCancel={() => setShowTaskForm(false)}
        />
      )}

      {/* Floating Add Button */}
      {activeTab === 'home' && (
        <FloatingAddButton onClick={() => setShowTaskForm(true)} />
      )}

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
