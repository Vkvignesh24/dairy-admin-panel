import { useState } from 'react';

import {
  Bell,
  Send,
  CheckCircle2,
} from 'lucide-react';

import { AdminAPI }
from '../api/admin';

import {
  PageHeader,
  ErrorBox,
} from '../components/UI';

export default function Notifications() {

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState('');

  const [error, setError] =
    useState('');

  const sendReminder = async () => {

    try {

      setLoading(true);
      setError('');
      setSuccess('');

      await AdminAPI
        .sendSubscriptionReminder();

      setSuccess(
        'Notification sent successfully to all active users.'
      );

    } catch (e) {

      setError(
        e?.response?.data?.message ||
        'Failed to send notification'
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      <PageHeader
        title="Push Notifications"
        subtitle="Send subscription reminders to all users"
      />

      <ErrorBox message={error} />

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 text-[14px] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {success}
        </div>
      )}

      <div className="card max-w-2xl">

        <div className="flex items-start gap-4">

          <div className="h-14 w-14 rounded-2xl bg-brand-50 flex items-center justify-center">
            <Bell className="w-7 h-7 text-brand-600" />
          </div>

          <div className="flex-1">

            <h2 className="text-[18px] font-bold text-slate-900">
              Subscription Reminder
            </h2>

            <p className="text-slate-500 mt-1 text-[14px]">
              Sends notification to all users:
            </p>

            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4">
              <div className="font-semibold text-slate-900">
                Milk delivery locks at 5 PM
              </div>

              <div className="text-[14px] text-slate-500 mt-1">
                Tomorrow milk quantity will lock at 5 PM.
                Edit quantity before 5 PM if needed.
              </div>
            </div>

            <button
              onClick={sendReminder}
              disabled={loading}
              className="btn-primary mt-5"
            >
              <Send className="w-4 h-4" />

              {loading
                ? 'Sending...'
                : 'Send Notification'}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}