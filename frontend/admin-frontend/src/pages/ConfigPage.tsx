import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { configAPI } from '../services/api';
import type { Config } from '../types';

export function ConfigPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    restaurantName: '',
    address: '',
    phone: '',
    email: '',
    schedule: {
      monday: { open: '', close: '', closed: false },
      tuesday: { open: '', close: '', closed: false },
      wednesday: { open: '', close: '', closed: false },
      thursday: { open: '', close: '', closed: false },
      friday: { open: '', close: '', closed: false },
      saturday: { open: '', close: '', closed: false },
      sunday: { open: '', close: '', closed: false },
    },
    preparationTimes: {
      default: 15,
      express: 10,
      complex: 30,
    },
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await configAPI.get();
      const configData = response.data.data;
      if (configData) {
        setConfig(configData);
        setFormData({
          restaurantName: configData.restaurantName,
          address: configData.address,
          phone: configData.phone,
          email: configData.email,
          schedule: configData.schedule,
          preparationTimes: configData.preparationTimes,
        });
      }
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await configAPI.update(formData);
      alert('Configuration saved successfully');
      loadConfig();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleScheduleChange = (day: string, field: string, value: string | boolean) => {
    setFormData({
      ...formData,
      schedule: {
        ...formData.schedule,
        [day]: {
          ...formData.schedule[day as keyof typeof formData.schedule],
          [field]: value,
        },
      },
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Configuration</h1>
          <p className="text-gray-600 mt-2">Manage general settings and schedules</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Restaurant Name"
                value={formData.restaurantName}
                onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                required
              />
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <div className="col-span-2">
                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </Card>

          {/* Schedule */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Weekly Schedule</h2>
            <div className="space-y-4">
              {days.map((day) => {
                const daySchedule = formData.schedule[day as keyof typeof formData.schedule];
                return (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-32 font-medium capitalize">{day}</div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={daySchedule.closed}
                        onChange={(e) => handleScheduleChange(day, 'closed', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Closed</span>
                    </label>
                    {!daySchedule.closed && (
                      <>
                        <Input
                          type="time"
                          value={daySchedule.open}
                          onChange={(e) => handleScheduleChange(day, 'open', e.target.value)}
                          className="w-32"
                        />
                        <span>to</span>
                        <Input
                          type="time"
                          value={daySchedule.close}
                          onChange={(e) => handleScheduleChange(day, 'close', e.target.value)}
                          className="w-32"
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Preparation Times */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Preparation Times (minutes)</h2>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Default"
                type="number"
                value={formData.preparationTimes.default}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preparationTimes: {
                      ...formData.preparationTimes,
                      default: parseInt(e.target.value),
                    },
                  })
                }
                required
              />
              <Input
                label="Express"
                type="number"
                value={formData.preparationTimes.express}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preparationTimes: {
                      ...formData.preparationTimes,
                      express: parseInt(e.target.value),
                    },
                  })
                }
                required
              />
              <Input
                label="Complex"
                type="number"
                value={formData.preparationTimes.complex}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preparationTimes: {
                      ...formData.preparationTimes,
                      complex: parseInt(e.target.value),
                    },
                  })
                }
                required
              />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

